import { Controller, Post } from '@nestjs/common';
import { ImageProcessorService } from './image-processor.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Models')
@Controller('image-processor')
export class ImageProcessorController {
    constructor(private imageService: ImageProcessorService) { }

    @Post()
    featureDetect(path: string) {
        return this.imageService.featureDetect('../smart-traffic-lights/src/model/images/image_339.jpg');
    }
}
