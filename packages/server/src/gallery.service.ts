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
    const dateParts = id.split('-');
    const date = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2]),
      Number(dateParts[3]) + 1,
      Number(dateParts[4]),
      Number(dateParts[5]),
    );
    const video: Video = {
      id: id,
      date: date,
      imageUrl: `${id}.jpg`,
      videoUrl: `${id}.mp4`,
    };

    const path = join(process.env.MEDIA_FOLDER, video.imageUrl);

    // Performs label detection on the image file
    const [result] = await this.annotatotClient.annotateImage({
      image: {
        source: {
          filename: path,
        },
      },
      features: [
        {
          maxResults: 5,
          type: 'OBJECT_LOCALIZATION',
        },
      ],
    });
    video.metadata = result.localizedObjectAnnotations;

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
    console.log('Done updating galery. New number of entries', this.db.length);
  }

  async getGalery(): Promise<VideoApiResponse> {
    return {
      uri: process.env.MEDIA_URI,
      videos: this.db,
    };
    /*
    //const VIDEO_DIR = '/var/www/html/galery';
    const VIDEO_DIR =
      '/Users/I543928/git/birdhouse-cam/birdhouse-ui/public/galery';


      const files = fs.readdirSync(VIDEO_DIR);
    const thumbnails = files.filter((file) => file.endsWith('.jpg'));
    for (const thumbnail of thumbnails) {
      const filename = thumbnail.replace('.jpg', '');
      if (files.includes(`${filename}.mp4`)) {
        const stream = fs.createReadStream(`${VIDEO_DIR}/${filename}.mp4`);
        const lengthInSeconds = 
        if (lengthInSeconds < 10) {
          try {
            fs.unlink(`${VIDEO_DIR}/${filename}.mp4`, () => {
              // done
            });
            fs.unlink(`${VIDEO_DIR}/${filename}.jpg`, () => {
              // done
            });
          } catch (err) {
            console.log('Error deleting videos');
          }
          continue;
        }

        const dateParts = filename.split('-');
        const date = new Date(
          Number(dateParts[0]),
          Number(dateParts[1]) - 1,
          Number(dateParts[2]),
          Number(dateParts[6]),
          Number(dateParts[7]),
        );

        galery.push({
          imageUrl: thumbnail,
          videoUrl: `${filename}.mp4`,
          date,
          lengthInSeconds,
        });
      }
    }
    galery.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      } else {
        1;
      }
    });
    */
    //return galery;
  }
}
