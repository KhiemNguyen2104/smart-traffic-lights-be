import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('login')
    async login(@Body() body: AuthLoginDto) {
        if (!body.user_name || !body.password) {
            throw new BadRequestException("User name or password is empty");
        }
        const data = {
            user_name: body.user_name,
            password: body.password
        }
        const res = await this.authService.login(data);
        return res;
    }

}
