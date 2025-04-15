import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdafruitService } from './adafruit.service';
import { AdafruitModule } from './adafruit.module';

@Controller('mqtt')
export class AdafruitController {
  constructor(private readonly adafruitService: AdafruitService) {}

  @Post('publish')
  publish(@Body() body: { value: string }) {
    this.adafruitService.publishData(body.value);
    return { message: 'Data published', value: body.value };
  }
}