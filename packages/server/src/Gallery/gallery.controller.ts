import { Controller, Get } from '@nestjs/common';
import { ContentGallery, GalleryUpdateResult } from '@open-birdhouse/common';
import { DatabaseService } from 'src/database.service';
import { GalleryService } from './gallery.service';

@Controller()
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get('/api/gallery')
  getGalery(): ContentGallery {
    return {
      uri: process.env.MEDIA_URI,
      contents: this.databaseService.getGallery(),
    };
  }

  @Get('/api/gallery/refresh')
  updateGalery(): Promise<GalleryUpdateResult> {
    return this.galleryService.updateGalery();
  }
}
