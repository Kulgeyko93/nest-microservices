import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@Controller('user')
export class UserController {
  // constructor() {}

  @UseGuards(JwtAuthGuard)
  @Post('info')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async info(@UserId() userId: string) {
  }
}
