import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewCRDto } from './dto';
import { AdafruitService } from 'src/adafruit/adafruit.service';

@Injectable()
export class CrossroadsService {
    constructor(private prisma: PrismaService, private adafruit: AdafruitService) { }

    async find(id: string) {
        const crossroads = await this.prisma.crossroads.findUnique({
            where: {
                cr_id: id
            },
            include: {
                traffic_lights: true
            }
        })
        if (!crossroads) {
            throw new BadRequestException('Crossroads not found')
        }
        return crossroads
    }

    async create(dto: NewCRDto) {
        const crossroads = await this.prisma.crossroads.create({
            data: dto
        })

        await this.adafruit.createGroup(dto.cr_id)

        return crossroads
    }
}
