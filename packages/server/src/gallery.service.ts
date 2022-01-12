import { Injectable } from '@nestjs/common';

import { Video, VideoApiResponse } from '@open-birdhouse/common';
import vision from '@google-cloud/vision';
import { join } from 'path/posix';
import * as fs from 'fs';
import { DatabaseService } from './database.service';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class GalleryService {
  private annotatotClient = new vision.ImageAnnotatorClient({
    keyFile: process.env.GOOGLE_KEYFILE,
  });

  constructor(private readonly databaseService: DatabaseService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    this.updateGalery();
  }

  async createAndTag(id: string): Promise<Video> {
    const video: Video = {
      id: id,
      imageUrl: `${id}.jpg`,
      videoUrl: `${id}.mp4`,
      annotations: [],
    };

    const videoPath = join(process.env.MEDIA_FOLDER, video.videoUrl);
    const filestats = fs.statSync(videoPath);
    const date = new Date(filestats.ctime);

    video.date = date;
    video.filesize = filestats.size;

    const imgPath = join(process.env.MEDIA_FOLDER, video.imageUrl);
    try {
      try {
        const existingImage = await cloudinary.uploader.explicit(
          `img-${video.id}`,
        );
        console.log('Image exists', existingImage);
      } catch (err) {
        const uploadImageResponse = await cloudinary.uploader.upload(imgPath, {
          resource_type: 'image',
          overwrite: false,
          public_id: `img-${video.id}`,
        });
        video.imageUrl = uploadImageResponse.url;
        console.log(`Upload of image-${video.id} successful`);
      }

      try {
        const existingVideo = await cloudinary.uploader.explicit(
          `video-${video.id}`,
          { resource_type: 'video' },
        );
        console.log('Video exists', existingVideo);
      } catch (err) {
        const uploadVideoResponse = await cloudinary.uploader.upload(
          videoPath,
          {
            resource_type: 'video',
            overwrite: false,
            public_id: `video-${video.id}`,
            chunk_size: 6000000,
          },
        );

        video.videoUrl = uploadVideoResponse.url;
        console.log(`Upload of video-${video.id} successful`);
      }
    } catch (err) {
      console.warn(`Error uploading ${video.id}`, err);
    }

    // Performs label detection on the image file
    const [result] = await this.annotatotClient.annotateImage({
      image: {
        source: {
          filename: imgPath,
        },
      },
      features: [
        {
          maxResults: 5,
          type: 'OBJECT_LOCALIZATION',
        },
      ],
    });

    for (const { name, score } of result.localizedObjectAnnotations) {
      video.annotations.push({ name, score });
    }

    return video;
  }

  async updateGalery(): Promise<void> {
    const fileContents = fs.readdirSync(process.env.MEDIA_FOLDER);
    const fileVideoIds: string[] = [];
    const newVideoIds: string[] = [];

    let gallery = this.databaseService.getGallery();

    console.log('Updating gallery. Current entries', gallery.length);

    fileContents.forEach((content) => {
      try {
        if (content.endsWith('.jpg')) {
          const id = content.substr(0, content.length - 4);
          if (fileContents.includes(`${id}.mp4`)) {
            fileVideoIds.push(id);
            const exists = gallery.find((video) => video.id === id);
            if (!exists) {
              console.log(id, 'does not exist');
              newVideoIds.push(id);
            }
          }
        }
      } catch (err) {
        console.warn('Err processing video', err.message);
      }
    });

    // Cleanup database. Remove non-existent videos
    gallery = gallery.filter((video) => {
      try {
        return fileVideoIds.includes(video.id);
      } catch (err) {
        console.warn('Err filtering video entry', err.message);
        return false;
      }
    });

    console.log('Adding new videos to database', newVideoIds);

    const promises = newVideoIds.map((videoId) => this.createAndTag(videoId));

    const newVideos = await Promise.all(promises.map((p) => p.catch((e) => e)));
    for (const response of newVideos) {
      if (response instanceof Error) {
        console.warn(`Creation request for video failed:`, response.message);
      } else {
        gallery.push(response);
      }
    }

    gallery.sort((a, b) => {
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    });

    this.databaseService.setGallery(gallery);

    console.log('Done updating galery. New number of entries', gallery.length);
  }

  getGalery(): VideoApiResponse {
    return {
      uri: process.env.MEDIA_URI,
      videos: this.databaseService.getGallery(),
    };
  }
}
