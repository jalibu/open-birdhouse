import { Injectable } from '@nestjs/common';

import { Video } from '@open-birdhouse/common';

@Injectable()
export class GalleryService {
  async getGalery(): Promise<Video[]> {
    const galery: Video[] = [];
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
    return galery;
  }
}
