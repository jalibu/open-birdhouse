import { Injectable, Logger } from '@nestjs/common';
import { Video, VideoApiResponse } from '@open-birdhouse/common';
import vision from '@google-cloud/vision';
import { join } from 'path/posix';
import * as fs from 'fs';
import { DatabaseService } from './database.service';
import { v2 as cloudinary } from 'cloudinary';
import { execSync } from 'child_process';

const VIDEO_FILES_TYPE = 'webm';

@Injectable()
export class GalleryService {
  private annotatotClient = new vision.ImageAnnotatorClient({
    keyFile: process.env.GOOGLE_KEYFILE,
  });

  private isWorking = false;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly logger: Logger,
  ) {
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
      videoUrl: `${id}.${VIDEO_FILES_TYPE}`,
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
          `${video.id}`,
          {
            type: 'upload',
          },
        );
        this.logger.warn(
          `Skipped ${video.imageUrl} (exists)`,
          GalleryService.name,
        );
        video.imageUrl = existingImage.secure_url;
      } catch (err) {
        const uploadImageResponse = await cloudinary.uploader.upload(imgPath, {
          resource_type: 'image',
          overwrite: false,
          public_id: `${video.id}`,
        });

        this.logger.log(
          `Upload of ${video.imageUrl} successful`,
          GalleryService.name,
        );
        video.imageUrl = uploadImageResponse.secure_url;
      }

      try {
        const existingVideo = await cloudinary.uploader.explicit(
          `${video.id}`,
          {
            resource_type: 'video',
            type: 'upload',
          },
        );
        this.logger.log(
          `Skipped ${video.videoUrl} (exists)`,
          GalleryService.name,
        );
        video.filesize = existingVideo.bytes;
        video.videoUrl = existingVideo.secure_url;
      } catch (err) {
        const uploadVideoResponse = await cloudinary.uploader.upload(
          videoPath,
          {
            resource_type: 'video',
            overwrite: false,
            public_id: `${video.id}`,
            chunk_size: 6000000,
          },
        );

        this.logger.log(
          `Upload of ${video.videoUrl} successful`,
          GalleryService.name,
        );
        video.filesize = uploadVideoResponse.bytes;
        video.videoUrl = uploadVideoResponse.secure_url;
      }
    } catch (err) {
      this.logger.warn(
        `Error uploading ${video.videoUrl}: ${err.message}`,
        GalleryService.name,
      );
    }

    // Performs label detection on the image file
    /*
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

    */

    return video;
  }

  async updateGalery(): Promise<void> {
    try {
      if (this.isWorking) {
        this.logger.log(
          `Gallery updater is already working`,
          GalleryService.name,
        );
        return;
      }
      this.isWorking = true;

      try {
        const scriptPath = join(
          __dirname,
          '../../../scripts/videoTransformer.sh',
        );
        this.logger.log(
          `Starting video transformer script`,
          GalleryService.name,
        );
        const transformerResponse = execSync(
          `${scriptPath} ${process.env.MEDIA_FOLDER}`,
          { timeout: 5 * 60 * 1000 },
        );
        this.logger.log(transformerResponse.toString(), 'videoTransformer.sh');
      } catch (err) {
        this.logger.warn(
          `Error calling video transformer: ${err.message}`,
          GalleryService.name,
        );
      }

      const fileContents = fs.readdirSync(process.env.MEDIA_FOLDER);
      const fileVideoIds: string[] = [];
      const newVideoIds: string[] = [];

      let gallery = this.databaseService.getGallery();

      this.logger.log(
        `Updating gallery. Current entries: ${gallery.length}`,
        GalleryService.name,
      );

      fileContents.forEach((content) => {
        try {
          if (content.endsWith('.jpg')) {
            const id = content.substr(0, content.length - 4);
            if (fileContents.includes(`${id}.${VIDEO_FILES_TYPE}`)) {
              fileVideoIds.push(id);
              const exists = gallery.find((video) => video.id === id);
              if (!exists) {
                this.logger.debug(
                  `Video files pair '${id}' exists on filesystem, but they are not (yet) in the database`,
                  GalleryService.name,
                );
                newVideoIds.push(id);
              }
            } else {
              this.logger.warn(
                `Image '${content}' does not have corresponding video file on filesystem`,
                GalleryService.name,
              );
            }
          } else if (content.endsWith(VIDEO_FILES_TYPE)) {
            const id = content.substr(
              0,
              content.length - (VIDEO_FILES_TYPE.length + 1),
            );
            if (!fileContents.includes(`${id}.jpg`)) {
              this.logger.warn(
                `Video '${content}' does not have corresponding image file on filesystem`,
                GalleryService.name,
              );
            }
          }
        } catch (err) {
          this.logger.warn(
            `Error checking filesystem video in database: ${err.message}`,
            GalleryService.name,
          );
        }
      });

      // Cleanup database. Remove non-existent videos
      gallery = gallery.filter((video) => {
        try {
          const doFilesExist = fileVideoIds.includes(video.id);
          if (!doFilesExist) {
            this.logger.warn(
              `Database video '${video.id}' does not exist on filesystem. Removing entry from database...`,
              GalleryService.name,
            );
          }

          return doFilesExist;
        } catch (err) {
          this.logger.warn(
            `Error filtering video entry: ${err.message}`,
            GalleryService.name,
          );
          return false;
        }
      });

      this.logger.log(
        `The following new videos will now be added to the database: ${newVideoIds}`,
        GalleryService.name,
      );

      for (const newVideoId of newVideoIds) {
        try {
          const newVideo = await this.createAndTag(newVideoId);
          gallery.push(newVideo);
        } catch (err) {
          this.logger.warn(
            `Creation request for video failed: ${err.message}`,
            GalleryService.name,
          );
        }
      }

      /*
    const promises = newVideoIds.map((videoId) => this.createAndTag(videoId));

    const newVideos = await Promise.all(promises.map((p) => p.catch((e) => e)));
    for (const response of newVideos) {
      if (response instanceof Error) {
        this.logger.warn(
          `Creation request for video failed: ${response.message}`,
          GalleryService.name,
        );
      } else {
        gallery.push(response);
      }
    }
    */
      gallery.sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? -1 : 1;
      });

      this.databaseService.setGallery(gallery);

      this.logger.log(
        `Done updating the database. New number of entries: ${gallery.length}`,
        GalleryService.name,
      );
    } catch (err) {
      this.logger.warn(
        `There was a problem refreshing the gallery: ${err.message}`,
        GalleryService.name,
      );
    } finally {
      this.isWorking = false;
    }
  }

  getGalery(): VideoApiResponse {
    return {
      uri: process.env.MEDIA_URI,
      videos: this.databaseService.getGallery(),
    };
  }
}
