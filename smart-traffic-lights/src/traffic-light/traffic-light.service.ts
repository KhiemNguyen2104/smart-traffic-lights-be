import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddTLDto, UpdateTLDto } from './dto';
import { ERRORS } from 'src/common/errors';
import * as argon from 'argon2';

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

        const id = (await argon.hash((new Date().toISOString())))
        const g_feed = `g-time-${id}`;
        const r_feed = `r-time-${id}`;
        const y_feed = `y-time-${id}`;

        const newTL = await this.prisma.traffic_light.create({
            data: {
                tl_id: id,
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
                green_feed: g_feed,
                red_feed: r_feed,
                yellow_feed: y_feed,
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
                    g_time: dto.g_time,
                    r_time: dto.r_time,
                    ...(dto.g_thres && {g_thres: dto.g_thres}),
                    ...(dto.r_thres && {r_thres: dto.r_thres}),
                    ...(dto.y_thres && {y_thres: dto.y_thres}),
                    ...(dto.y_time && {y_time: dto.y_time}),
                }
            })

            if (dto.user_id) {
                const t = new Date()
                
                await this.prisma.user.update({
                    where: {
                        user_id: dto.user_id
                    },
                    data: {
                        fines: {
                            create: {
                                tl_id: dto.tl_id,
                                time: t,
                                g_time: dto.g_time,
                                ...(dto.y_time && {y_time: dto.y_time}),
                                ...(dto.y_thres && {y_thres: dto.y_thres}),
                                ...(dto.g_thres && {g_thres: dto.g_thres}),
                                ...(dto.r_thres && {r_thres: dto.r_thres}),
                                r_time: dto.r_time,
                            }
                        }
                    }
                })

                await this.prisma.traffic_light.update({
                    where: {
                        tl_id: dto.tl_id
                    },
                    data: {
                        fines: {
                            connect: {
                                tl_id_user_id_time: {
                                    tl_id: dto.tl_id,
                                    user_id: dto.user_id,
                                    time: t
                                }
                            }
                        }
                    }
                })

                return dto
            } else if (!dto.cr_id) {
                throw new ForbiddenException(ERRORS.UPDATE_ACTOR_NOT_FOUND)
            } else {
                const t = new Date()
                
                await this.prisma.crossroads.update({
                    where: {
                        cr_id: dto.cr_id
                    },
                    data: {
                        updates: {
                            create: {
                                tl_id: dto.tl_id,
                                time: t,
                                g_time: dto.g_time,
                                r_time: dto.r_time,
                            }
                        }
                    }
                })

                await this.prisma.traffic_light.update({
                    where: {
                        tl_id: dto.tl_id
                    },
                    data: {
                        updates: {
                            connect: {
                                cr_id_time_tl_id: {
                                    cr_id: dto.cr_id,
                                    time: t,
                                    tl_id: dto.tl_id
                                }
                            }
                        }
                    }
                })

                return dto
            }
        } catch (err) {
            throw new ForbiddenException(ERRORS.UPDATE_ERROR)
        }
    }

    async delete(id: string) {}
}
