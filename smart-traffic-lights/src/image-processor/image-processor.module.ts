import { Module } from '@nestjs/common';
import { ImageProcessorService } from './image-processor.service';
import { ImageProcessorController } from './image-processor.controller';
import { ImageGateway } from './image-processor.gateway';

@Module({
  providers: [ImageProcessorService, ImageGateway],
  controllers: [ImageProcessorController]
})
export class ImageProcessorModule {}
