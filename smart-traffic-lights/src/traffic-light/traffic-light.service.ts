import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddTLDto, UpdateTLDto } from './dto';
import { ERRORS } from 'src/common/errors';
import * as argon from 'argon2';
import { AdafruitService } from 'src/adafruit/adafruit.service';
import { NewFeedDto } from 'src/adafruit/dto';

@Injectable()
export class TrafficLightService {
    constructor(private prisma: PrismaService, private adafruit: AdafruitService) {}

    async add(dto: AddTLDto) {
        if (!dto) {
            throw new ForbiddenException(ERRORS.MISSED_DATA)
        }

        const count = await this.prisma.traffic_light.count({
            where: {
                cr_id: dto.cr_id
            }
        })

        const crossroads = await this.prisma.crossroads.findUnique({
            where: {
                cr_id: dto.cr_id
            }
        })

        if (!crossroads) {
            throw new ForbiddenException(ERRORS.CROSSROADS_NOT_FOUND)
        }

        const id = 'tl-' + (count + 1)
        const state_feed = `state-${(count + 1) + ""}`;
        const time_feed = `time-${(count + 1) + ""}`;
        const dens_feed = `dens-${(count + 1) + ""}`;

        const newTL = await this.prisma.traffic_light.create({
            data: {
                tl_id: id,
                length: dto.length,
                width: dto.width,
                cr_id: dto.cr_id,
                type: dto.type,
                g_thres: dto.g_thres,
                r_thres: dto.r_thres,
                y_thres: dto.y_thres,
                time_feed: time_feed,
                state_feed: state_feed,
                dens_feed: dens_feed,
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
                        tl_id: id
                    }
                }
            }
        })

        

        await this.adafruit.createNewFeed(new NewFeedDto({group: dto.cr_id, id: `time-${(count + 1) + ""}`}))
        await this.adafruit.createNewFeed(new NewFeedDto({group: dto.cr_id, id: `state-${(count + 1) + ""}`}))
        await this.adafruit.createNewFeed(new NewFeedDto({group: dto.cr_id, id: `dens-${(count + 1) + ""}`}))

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

    async update(dto: UpdateTLDto) {
        if (!dto.tl_id) {
            throw new ForbiddenException(ERRORS.USER_NOT_FOUND)
        }

        try {
            await this.prisma.traffic_light.update({
                where: {
                    tl_id: dto.tl_id
                },
                data: {
                    ...(dto.g_thres && {g_thres: dto.g_thres}),
                    ...(dto.r_thres && {r_thres: dto.r_thres}),
                    ...(dto.y_thres && {y_thres: dto.y_thres}),
                }
            })

            return dto
        } catch (err) {
            throw new ForbiddenException(ERRORS.UPDATE_ERROR)
        }
    }
}
