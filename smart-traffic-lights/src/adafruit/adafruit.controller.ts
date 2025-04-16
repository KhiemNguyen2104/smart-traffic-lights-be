import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AdafruitService } from './adafruit.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { PublicDto } from './dto';

@ApiTags('Adafruit')
@Controller('mqtt')
export class AdafruitController {
  constructor(private readonly adafruitService: AdafruitService) { }

  @Post('publish')
  @ApiBody({ type: PublicDto })
  publish(@Body() body: PublicDto) {
    this.adafruitService.publishData(body);
    return { message: 'Data published', value: body };
  }

  @Post('new/:id')
  @ApiParam({ name: 'id', required: true, description: "Feed name", type: String })
  createNewFeed(@Param('id') id: string) {
    this.adafruitService.createNewFeed(id)
    return { message: 'New feed created', value: id }
  }
}