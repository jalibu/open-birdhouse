import { Injectable, Logger } from '@nestjs/common';
import { GalleryUpdateResult } from '@open-birdhouse/common';
import { DatabaseService } from '../database.service';
import { GalleryUtils } from './gallery.utils';
import { UploaderService } from './uploader.service';
import { AnnotationService } from './annotation.service';
import { Config } from 'src/Config';

@Injectable()
export class GalleryService {
  private isWorking = false;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly uploaderService: UploaderService,
    private readonly annotationService: AnnotationService,
    private readonly logger: Logger,
  ) {
    this.updateGalery();
  }

  async updateGalery(): Promise<GalleryUpdateResult> {
    try {
      if (this.isWorking) {
        this.logger.log(
          `Gallery updater is already working`,
          GalleryService.name,
        );
        return;
      }
      this.isWorking = true;

      const updateResult: GalleryUpdateResult = {};

      const databaseContents = this.databaseService.getGallery();
      const filesystemContents = GalleryUtils.getFilesystemContents(
        this.logger,
      );

      this.logger.log(
        `Updating gallery. Current number of contents:  Database '${databaseContents.length}'; Filesystem '${filesystemContents.length}'`,
        GalleryService.name,
      );

      // Cleanup database. Remove non-existent content
      updateResult.databaseDeletes = GalleryUtils.pruneDatabaseContens(
        databaseContents,
        filesystemContents,
        this.logger,
      );

      const newContents = GalleryUtils.getNewContents(
        databaseContents,
        filesystemContents,
      );

      this.logger.log(
        `The following new contents will now be added to the database: ${newContents.map(
          (content) => content.id,
        )}`,
        GalleryService.name,
      );

      for (const newContent of newContents) {
        try {
          // Annotate Image
          if (Config.getAsBoolean('ANNOTATE_IMAGES')) {
            await this.annotationService.annotateContent(newContent);
          }

          if (
            Config.getAsBoolean('ANNOTATE_IMAGES') &&
            newContent.annotations.length <
              Config.getAsNumber('MINIMAL_ANNOTATION_EXPECTATION')
          ) {
            this.logger.log(
              `${
                newContent.imageUrl
              } does not have the expected minimal number of annotations (${
                newContent.annotations.length
              }/${Config.getAsNumber('MINIMAL_ANNOTATION_EXPECTATION')})`,
              GalleryService.name,
            );
            GalleryUtils.removeContentFromFilesystem(newContent, this.logger);
          } else {
            // Upload Content to CDN
            if (Config.getAsBoolean('USE_CDN')) {
              await this.uploaderService.uploadContent(newContent);
            }
            databaseContents.push(newContent);
          }
        } catch (err) {
          this.logger.warn(
            `Upload request for content '${newContent.id}' failed: ${err.message}`,
            GalleryService.name,
          );
        }
      }

      GalleryUtils.sortContents(databaseContents);

      this.databaseService.setGallery(databaseContents);

      this.logger.log(
        `Done updating the database. New number of entries: ${databaseContents.length}`,
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
}
