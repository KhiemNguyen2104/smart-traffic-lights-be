import { Module } from '@nestjs/common';
import { ImageProcessorService } from './image-processor.service';
import { ImageProcessorController } from './image-processor.controller';
import { ImageGateway } from './image-processor.gateway';
import { GlobalService } from 'src/global/global.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GlobalModule } from 'src/global/global.module';

@Module({
  providers: [ImageProcessorService, ImageGateway],
  controllers: [ImageProcessorController],
  imports: [PrismaModule, GlobalModule]
})
export class ImageProcessorModule {}
