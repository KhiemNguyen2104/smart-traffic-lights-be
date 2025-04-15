import { Module } from '@nestjs/common';
import { AdafruitService } from './adafruit.service';
import { AdafruitController } from './adafruit.controller';

@Module({
  providers: [AdafruitService],
  controllers: [AdafruitController]
})
export class AdafruitModule {}
