import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from 'src/cores/guards/local-auth.guard';
import { UserLoginDto } from './dto/user-login.dto';
import { CreatedBy } from 'src/common/models/root/created-by-root';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async register(
        @Body() createUserDto: CreateUserDto
    ) {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @ApiBody({
        description: 'User credentials',
        type: UserLoginDto,
    })
    async login(
        @Req() req: any,
    ) {
        if (!req.user) {
            return undefined;
        }
        const result: CreatedBy = req.user;
        return await this.authService.login(result);
    }


}
