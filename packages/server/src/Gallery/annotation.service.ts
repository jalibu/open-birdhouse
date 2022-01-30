import { Injectable, Logger } from '@nestjs/common';
import { Content } from '@open-birdhouse/common';
import vision from '@google-cloud/vision';
import { join } from 'path';
import { Config } from 'src/Config';

@Injectable()
export class AnnotationService {
  private annotatotClient = new vision.ImageAnnotatorClient({
    keyFile: process.env.GOOGLE_KEYFILE,
  });

  private annotationsBlacklist = JSON.parse(
    Config.getAsString('ANNOTATIONS_BLACKLIST', '[]'),
  );

  constructor(private readonly logger: Logger) {
    logger.log(
      `Annotator blacklist: ${this.annotationsBlacklist}`,
      AnnotationService.name,
    );
  }

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
        if (!this.annotationsBlacklist.includes(name)) {
          content.annotations.push({ name, score });
        }
      }
      this.logger.log(
        `Finished annotating ${content.imageUrl} with ${content.annotations.length} annotations`,
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
