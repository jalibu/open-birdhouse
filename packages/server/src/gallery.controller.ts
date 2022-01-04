import { Controller, Get } from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Controller()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get('/api/galery')
  getGalery(): any {
    return this.galleryService.getGalery();
  }
}
