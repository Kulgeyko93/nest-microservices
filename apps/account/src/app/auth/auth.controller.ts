import { Body, Controller } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@microservices/contracts';
import { AuthService } from './auth.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RMQRoute(AccountRegister.topic)
  @RMQValidate()
  async register(@Body() dto: AccountRegister.Request): Promise<AccountRegister.Response> {
    return await this.authService.register(dto);
  }

  @RMQRoute(AccountLogin.topic)
  @RMQValidate()
  async login(@Body() { email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);
    return await this.authService.login(id);
  }
}
