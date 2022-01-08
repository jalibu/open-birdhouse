import { Controller, Get } from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Controller()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get('/api/gallery')
  getGalery(): any {
    return this.galleryService.getGalery();
  }

  @Get('/api/gallery/refresh')
  updateGalery(): any {
    return this.galleryService.updateGalery();
  }
}
