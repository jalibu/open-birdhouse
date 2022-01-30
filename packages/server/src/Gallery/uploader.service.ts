import { Injectable, Logger } from '@nestjs/common';
import { Content } from '@open-birdhouse/common';
import { join } from 'path';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploaderService {
  constructor(private readonly logger: Logger) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  public async uploadContent(content: Content): Promise<Content> {
    const imgPath = join(process.env.MEDIA_FOLDER, content.imageUrl);
    content.imageUrl = await this.performUpload(content.id, imgPath, 'image');
    if (content.videoUrl) {
      const videoPath = join(process.env.MEDIA_FOLDER, content.videoUrl);
      content.videoUrl = await this.performUpload(
        content.id,
        videoPath,
        'video',
      );
    }

    return content;
  }

  private async performUpload(
    id: string,
    filePath: string,
    resourceType: string,
  ): Promise<string> {
    try {
      const existingImage = await cloudinary.uploader.explicit(id, {
        type: 'upload',
        resource_type: resourceType,
      });
      this.logger.debug(`Skipped ${filePath} (exists)`, UploaderService.name);
      return existingImage.secure_url;
    } catch (err) {
      const uploadImageResponse = await cloudinary.uploader.upload(filePath, {
        resource_type: resourceType,
        overwrite: false,
        public_id: id,
      });
      this.logger.log(`Upload of ${filePath} successful`, UploaderService.name);
      return uploadImageResponse.secure_url;
    }
  }
}
