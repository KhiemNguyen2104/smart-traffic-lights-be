import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddTLDto, UpdateTLDto } from './dto';
import { ERRORS } from 'src/common/errors';

@Injectable()
export class TrafficLightService {
    constructor(private prisma: PrismaService) {}

    async add(dto: AddTLDto) {
        if (!dto) {
            throw new ForbiddenException(ERRORS.MISSED_DATA)
        }

        const crossroads = await this.prisma.crossroads.findUnique({
            where: {
                cr_id: dto.cr_id
            }
        })

        if (!crossroads) {
            throw new ForbiddenException(ERRORS.CROSSROADS_NOT_FOUND)
        }

        const newTL = await this.prisma.traffic_light.create({
            data: {
                tl_id: dto.tl_id,
                length: dto.length,
                width: dto.width,
                g_time: dto.g_time,
                r_time: dto.r_time,
                y_time: dto.y_time,
                cr_id: dto.cr_id,
                type: dto.type,
                g_thres: dto.g_thres,
                r_thres: dto.r_thres,
                y_thres: dto.y_thres,
                green_feed: dto.green_feed,
                red_feed: dto.red_feed,
                yellow_feed: dto.yellow_feed,
            }
        })

        if (!newTL) {
            throw new ForbiddenException(ERRORS.ADDING_ERROR)
        }

        await this.prisma.crossroads.update({
            where: {cr_id: dto.cr_id},
            data: {
                traffic_lights: {
                    connect: {
                        tl_id: dto.tl_id
                    }
                }
            }
        })

        return newTL
    }

    async find(id?: string) {
        if (!id) {
            const traffic_light = await this.prisma.traffic_light.findMany({})

            if (!traffic_light) {
                throw new ForbiddenException(ERRORS.TRAFFIC_LIGHT_NOT_FOUND)
            }
            
            return traffic_light
        } else {
            const traffic_light = await this.prisma.traffic_light.findUnique({
                where: {
                    tl_id: id
                }
            })

            if (!traffic_light) {
                throw new ForbiddenException(ERRORS.TRAFFIC_LIGHT_NOT_FOUND)
            }
            
            return traffic_light
        }
    }

    async update(id: string, dto: UpdateTLDto) {}

    async delete(id: string) {}
}
