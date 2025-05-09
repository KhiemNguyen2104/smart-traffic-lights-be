import { Injectable, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ERRORS } from "src/common/errors";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: {
        sub: string,
        user_name: string,
        user_role: string,
    }) {
        const user = await this.prisma.user.findUnique({
            where: {
                user_id: payload.sub,
            },
        });

        if (!user) {
            throw new ForbiddenException(ERRORS.USER_NOT_FOUND)
        }

        return {
            user_id: user?.user_id,
            user_name: user?.user_name,
            user_role: user?.role
        }
    }
}