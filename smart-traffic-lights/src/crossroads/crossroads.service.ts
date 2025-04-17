import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CrossroadsService {
    constructor(private prisma: PrismaService) { }

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
}
