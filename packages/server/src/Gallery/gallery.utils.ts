import { Logger } from '@nestjs/common';
import { Content } from '@open-birdhouse/common';
import * as fs from 'fs';
import { join } from 'path';
const VIDEO_FILES_TYPE = 'mp4';
const IMAGE_FILES_TYPE = 'jpg';

export class GalleryUtils {
  private static getContentId(fileName: string): string {
    if (fileName.endsWith(VIDEO_FILES_TYPE)) {
      return fileName.substring(
        0,
        fileName.length - VIDEO_FILES_TYPE.length - 1,
      );
    }
    if (fileName.endsWith(IMAGE_FILES_TYPE)) {
      return fileName.substring(
        0,
        fileName.length - IMAGE_FILES_TYPE.length - 1,
      );
    }
    return null;
  }

  public static getFilesystemContents(logger: Logger): Content[] {
    const contents: Content[] = [];

    const fileSystemContentFiles = fs.readdirSync(process.env.MEDIA_FOLDER);

    fileSystemContentFiles.forEach((fileName) => {
      try {
        if (fileName.endsWith(IMAGE_FILES_TYPE)) {
          const id = this.getContentId(fileName);

          const imageStats = fs.statSync(
            join(process.env.MEDIA_FOLDER, fileName),
          );

          const content: Content = {
            id: this.getContentId(fileName),
            imageUrl: fileName,
            date: new Date(imageStats.ctime),
          };

          // Add video content, if available
          if (fileSystemContentFiles.includes(`${id}.${VIDEO_FILES_TYPE}`)) {
            const videoStats = fs.statSync(
              join(process.env.MEDIA_FOLDER, `${id}.${VIDEO_FILES_TYPE}`),
            );
            content.videoUrl = `${id}.${VIDEO_FILES_TYPE}`;
            content.filesize = videoStats.size;
          } else {
            logger.debug(
              `Image '${fileName}' does not have corresponding video file on filesystem`,
              GalleryUtils.name,
            );
          }
          contents.push(content);
        } else if (fileName.endsWith(VIDEO_FILES_TYPE)) {
          const id = this.getContentId(fileName);

          if (!fileSystemContentFiles.includes(`${id}.${IMAGE_FILES_TYPE}`)) {
            // We expect an image to each video
            logger.warn(
              `Video '${fileName}' does not have corresponding image file on filesystem`,
              GalleryUtils.name,
            );
          }
        }
      } catch (err) {
        logger.warn(
          `Error processing content file on filesystem: ${err.message}`,
          GalleryUtils.name,
        );
      }
    });

    return contents;
  }

  public static pruneDatabaseContens(
    databaseContents: Content[],
    filesystemContents: Content[],
    logger: Logger,
  ): Content[] {
    const deletedContens: Content[] = [];

    databaseContents = databaseContents.filter((databaseContent) => {
      try {
        const existsOnFilesystem = filesystemContents.find(
          (fileSystemContent) => fileSystemContent.id === databaseContent.id,
        );

        if (!existsOnFilesystem) {
          logger.warn(
            `Database video '${databaseContent.id}' does not exist on filesystem. Removing entry from database...`,
            GalleryUtils.name,
          );
          deletedContens.push(databaseContent);
        }

        return existsOnFilesystem;
      } catch (err) {
        logger.warn(
          `Error filtering content entry: ${err.message}`,
          GalleryUtils.name,
        );
        return false;
      }
    });

    return deletedContens;
  }

  public static getNewContents(
    databaseContents: Content[],
    filesystemContents: Content[],
  ): Content[] {
    return filesystemContents.filter((filesystemContent) => {
      return !databaseContents.find(
        (databaseContent) => databaseContent.id === filesystemContent.id,
      );
    });
  }

  public static sortContents(contents: Content[]) {
    contents.sort((a, b) => {
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    });
  }

  public static removeContentFromFilesystem(
    content: Content,
    logger: Logger,
  ): void {
    if (content.imageUrl) {
      try {
        fs.unlinkSync(join(process.env.MEDIA_FOLDER, content.imageUrl));
        logger.log(
          `Successfully deleted file '${content.imageUrl}'`,
          GalleryUtils.name,
        );
      } catch (err) {
        logger.warn(
          `Unable to delete file '${content.imageUrl}'`,
          GalleryUtils.name,
        );
      }
    }
    if (content.videoUrl) {
      try {
        fs.unlinkSync(join(process.env.MEDIA_FOLDER, content.imageUrl));
      } catch (err) {
        logger.warn(
          `Unable to delete file '${content.videoUrl}'`,
          GalleryUtils.name,
        );
      }
    }
  }
}
