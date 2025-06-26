import { Controller, Get, Post, Body, Param, Delete, Query, ForbiddenException } from '@nestjs/common';
import { AdafruitService } from './adafruit.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NewFeedDto, PublicDto } from './dto';

@ApiTags('Adafruit')
@Controller('mqtts')
export class AdafruitController {
  constructor(private readonly adafruitService: AdafruitService) { }

  @Post('publish')
  @ApiOperation({ summary: 'Publish data to a specific traffic light' })
  @ApiBody({ type: PublicDto })
  publish(@Body() body: PublicDto) {
    this.adafruitService.publishData(body);
    return { message: 'Data published', value: body };
  }

  @Post('feeds/:id')
  @ApiOperation({ summary: 'Create a new feed in the Adafruit server' })
  @ApiParam({ name: 'id', required: true, description: "Feed name", type: String })
  @ApiQuery({ name: 'group', required: false, description: 'Group key', type: String })
  createNewFeed(@Query('group') group: string | undefined, @Param('id') id: string) {
    try {
      this.adafruitService.createNewFeed(new NewFeedDto({ group: group, id: id }))
    } catch (err) {
      throw new ForbiddenException(err)
    }
    return { message: 'New feed created', value: `Group: ${group}, id: ${id}` }
  }

  @Delete('feeds/:id')
  @ApiOperation({ summary: 'Delete an already specific feed in the Adafruit server' })
  @ApiParam({ name: 'id', required: true, description: "Feed name", type: String })
  @ApiQuery({ name: 'group', required: false, description: 'Group key', type: String })
  deleteFeed(@Query('group') group: string | undefined, @Param('id') id: string) {
    try {
      this.adafruitService.deleteFeed(new NewFeedDto({ group: group, id: id }))
    } catch (err) {
      throw new ForbiddenException(err)
    }
    return { message: "Feed deleted", value: `Group: ${group}, id: ${id}` }
  }

  @Post('group/:id')
  @ApiOperation({ summary: 'Create a new group in the Adafruit server' })
  @ApiParam({ name: 'id', required: true, description: "Group name", type: String })
  creatGroup(@Param('id') id: string) {
    try {
      this.adafruitService.createGroup(id)
    } catch (err) {
      throw new ForbiddenException(err)
    }
    return { message: 'Group created', value: id }
  }

  @Delete('group/:id')
  @ApiOperation({ summary: 'Delete an already group in the Adafruit server' })
  @ApiParam({ name: 'id', required: true, description: 'Group key', type: String })
  deleteGroup(@Param('id') id: string) {
    try {
      this.adafruitService.deleteGroup(id)
    } catch (err) {
      throw new ForbiddenException(err)
    }
    return { message: 'Group deleted', value: id }
  }
}