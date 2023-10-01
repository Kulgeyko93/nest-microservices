import {
  Controller,
  Get,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('sign-in')
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.signIn(email, password);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    // this.authService.logout(req.user['sub']);
  }

  // @Post('/refresh')
  // async refreshTokens(@Body() { email, password }: LoginDto) {
  // }
}
