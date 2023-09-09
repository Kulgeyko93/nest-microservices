import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

@Controller('user')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}
  @Get()
  async findOne(@Query('email') email: string) {
    try {
      if (!email?.trim()) throw new BadRequestException();

      const user = await this.userRepository.findOneByEmail(email);

      if (!user) throw new NotFoundException('User doesn\'t exist');
  
      return user;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }
}
