import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthLoginDto, AuthSignUpDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    async login(dto: AuthLoginDto) {
        const user = await this.getUserByUserName(dto.user_name);
        if (!user) {
            throw new BadRequestException("User not found");
        }
        const hashPassword = user.hash_key;
        const isMatch = await argon.verify(hashPassword, dto.password);
        if (!isMatch) {
            throw new BadRequestException("Password is wrong");
        }
        const token = await this.signToken(user.user_id, user.user_name, user.role);
        return { token: token };
    }

    async getUserByUserName(user_name: string) {
        return await this.prisma.user.findFirst({
            where: {
                user_name: user_name,
            },
        });
    }
    /** 
        This service just use for create already accounts by developers or DBA, it is invisible with users.
    */
    async signup(dto: AuthSignUpDto) { } // TODO

    async signToken(user_id: string, user_name: string, user_role: string): Promise<{ access_token: string }> {
        const payload = {
            sub: user_id,
            user_name,
            user_role,
        }

        const secret = process.env.JWT_SECRET;

        try {
            const token = await this.jwt.signAsync(payload, {
                expiresIn: '30m',
                secret: secret,
            });

            return { access_token: token };
        }
        catch (error) {
            throw new Error('Error signing the token');
        }
    }
}