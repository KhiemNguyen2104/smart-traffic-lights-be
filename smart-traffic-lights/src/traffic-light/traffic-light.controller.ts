import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TrafficLightService } from './traffic-light.service';
import { AuthGuard } from '@nestjs/passport';
import { AddTLDto, UpdateTLDto } from './dto/traffic-light.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Traffic-lights')
@Controller('traffic-lights')
export class TrafficLightController {
    constructor(private TLService: TrafficLightService) { }

    @ApiOperation({ summary: 'Add a traffic light into the system, users cannot do this, just for developer.' })
    @ApiBody({ type: AddTLDto })
    @Post()
    async add(@Body() dto: AddTLDto) {
        return await this.TLService.add(dto);
    }

    // @ApiOperation({ summary: 'Remove a traffic light from the database, users cannot do this, just for developer.' })
    // @ApiParam({ name: 'id', required: true, description: 'Traffic light ID', type: String })
    // @Delete(':id')
    // async delete(@Param('id') id: string) {
    //     return await this.TLService.delete(id);
    // }

    @ApiOperation({ summary: 'Get a specific traffic light or get all of them.' })
    @ApiQuery({ name: 'id', required: false, description: 'Traffic light ID', type: String })
    @ApiQuery({ name: 'cr_id', required: true, description: 'Crossroads ID', type: String })
    @Get(':id')
    async find(@Query('id') id: string | undefined, @Query('cr_id') cr_id: string) {
        return await this.TLService.find(cr_id, id);
    }

    // @ApiOperation({ summary: 'Update allowed information of a specific traffic light.' })
    // @ApiParam({ name: 'id', required: false, description: 'Traffic light ID' })
    // @ApiBody({ type: UpdateTLDto })
    // @Put(':id')
    // async update(@Param('id') id: string, dto: UpdateTLDto) {
    //     return await this.TLService.update(dto);
    // }
}