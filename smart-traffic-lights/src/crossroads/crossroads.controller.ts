import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CrossroadsService } from './crossroads.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NewCRDto } from './dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Crossroads')
@Controller('crossroads')
export class CrossroadsController {
    constructor(private CRService: CrossroadsService) { }

    @Get(':id')
    async find(@Param('id') id: string) {
        return await this.CRService.find(id)
    }

    @ApiOperation({ summary: "Create new crossroads" })
    @ApiBody({ type: NewCRDto })
    @Post()
    async create(@Body() dto: NewCRDto) {
        return await this.CRService.create(dto)
    }
}
