import { Injectable } from '@nestjs/common';

import { Video, VideoApiResponse } from '@open-birdhouse/common';
import vision from '@google-cloud/vision';
import { join } from 'path/posix';
import * as fs from 'fs';

@Injectable()
export class GalleryService {
  private db: Video[] = [];

  private annotatotClient = new vision.ImageAnnotatorClient({
    keyFile: process.env.GOOGLE_KEYFILE,
  });

  constructor() {
    const path = join(process.env.MEDIA_FOLDER, 'db.json');
    try {
      this.db = JSON.parse(fs.readFileSync(path, 'utf-8'));
    } catch (err) {
      console.warn('Could not read db. Creating a new one');
      fs.writeFileSync(path, JSON.stringify(this.db));
    }

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

    console.log('Updating galery. Current entries', this.db.length);

    fileContents.forEach((content) => {
      if (content.endsWith('.jpg')) {
        const id = content.substr(0, content.length - 4);
        if (fileContents.includes(`${id}.mp4`)) {
          fileVideoIds.push(id);
          const exists = this.db.find((video) => video.id === id);
          if (!exists) {
            console.log(id, 'does not exist');
            newVideoIds.push(id);
          }
        }
      }
    });

    // Cleanup database. Remove non-existent videos
    this.db = this.db.filter((video) => fileVideoIds.includes(video.id));

    console.log('Adding new videos to database', newVideoIds);

    // Add new videos to db
    for (const videoId of newVideoIds) {
      this.db.push(await this.createAndTag(videoId));
    }

    const path = join(process.env.MEDIA_FOLDER, 'db.json');
    try {
      fs.writeFileSync(path, JSON.stringify(this.db));
    } catch (err) {
      console.warn('Could not write db', err);
    }

    this.db.sort((a, b) => {
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    });

    console.log('Done updating galery. New number of entries', this.db.length);
  }

  async getGalery(): Promise<VideoApiResponse> {
    return {
      uri: process.env.MEDIA_URI,
      videos: this.db,
    };
  }
}
