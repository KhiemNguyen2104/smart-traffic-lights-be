import { Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TrafficLightService } from './traffic-light.service';
import { AuthGuard } from '@nestjs/passport';
import { AddTLDto, UpdateTLDto } from './dto/traffic-light.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('traffic-lights')
@Controller('traffic-light')
export class TrafficLightController {
    constructor(private TLService: TrafficLightService) { }

    // @Post('add')
    // async add(dto: AddTLDto) {
    //     return await this.TLService.add(dto);
    // }

    // @Get(':id')
    // async find(@Param('id') id: string | undefined) {
    //     return this.TLService.find(id);
    // }

    // @Put(':id')
    // async update(@Param('id') id: string, dto: UpdateTLDto) {
    //     return this.TLService.update(id, dto);
    // }
}