import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthSignUpDto } from './dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @ApiOperation({summary: 'Login'})
    @Post('login')
    @ApiBody({type: AuthLoginDto})
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

    @ApiOperation({summary: 'Signup for a new account'})
    @Post('signup')
    @ApiBody({type: AuthSignUpDto})
    async signup(@Body() dto: AuthSignUpDto) {
        return await this.authService.signup(dto)
    }
}
