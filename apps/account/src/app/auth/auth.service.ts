import { ConfigService } from '@nestjs/config';
import { UserRepository } from './../user/repositories/user.repository';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserEntity } from "../user/entites/user.entity";
import { Roles } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { UserUpdateEntity } from "../user/entites/user-update.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async register({ email, password, name }: RegisterUserDto) {
    const existUser = await this.userRepository.findOneByEmail(email);

    if (existUser) {
      throw new HttpException('User exists', HttpStatus.BAD_REQUEST);
    }

    const newUserEntity = await new UserEntity({
      email,
      name,
      password: '',
      role: Roles.USER,
    }).setPassword(password);

    const newUser = await this.userRepository.create(newUserEntity);

    const tokens = await this.getTokens(newUser.id, newUser.email);

    await this.updateRefreshToken(newUser.id, tokens.refreshToken)

    await this.userRepository.update(newUser.id, {
      refreshToken: tokens.refreshToken
    });
    return tokens;
  }

  async signIn(email: string, password: string ) {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.userRepository.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const updateEntity = new UserUpdateEntity();
    updateEntity.setRefreshToken(refreshToken);

    await this.userRepository.update(userId, updateEntity);
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
