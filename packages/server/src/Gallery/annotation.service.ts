import { Injectable, Logger } from '@nestjs/common';
import { Content } from '@open-birdhouse/common';
import vision from '@google-cloud/vision';
import { join } from 'path';

const ANNOTATIONS_BLACKLIST = ['Lightning', 'Shoe'];

@Injectable()
export class AnnotationService {
  private annotatotClient = new vision.ImageAnnotatorClient({
    keyFile: process.env.GOOGLE_KEYFILE,
  });
  constructor(private readonly logger: Logger) {}

  public async annotateContent(content: Content) {
    try {
      const imgPath = join(process.env.MEDIA_FOLDER, content.imageUrl);
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
      if (!content.annotations) {
        content.annotations = [];
      }
      for (const { name, score } of result.localizedObjectAnnotations) {
        if (!ANNOTATIONS_BLACKLIST.includes(name)) {
          content.annotations.push({ name, score });
        }
      }
      this.logger.log(
        `Finished annotating ${content.imageUrl} with ${
          result?.localizedObjectAnnotations?.length
            ? result.localizedObjectAnnotations.length
            : 0
        } annotations`,
        AnnotationService.name,
      );
    } catch (err) {
      this.logger.warn(
        `Error annotating ${content.imageUrl}: ${err.message}`,
        AnnotationService.name,
      );
    }
  }
}
