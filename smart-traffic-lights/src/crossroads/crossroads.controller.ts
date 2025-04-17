import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CrossroadsService } from './crossroads.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
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
}
