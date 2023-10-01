import { ConfigService } from '@nestjs/config';
import { UserRepository } from './../user/repositories/user.repository';
import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from "./dto/register-user.dto";
import { UserEntity } from "../user/entites/user.entity";
import { Roles, User } from "@prisma/client";
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
      refreshToken: null,
    }).setPassword(password);

    const newUser = await this.userRepository.create(newUserEntity);

    const tokens = await this.getTokens({id: newUser.id, email: newUser.email });

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

    const tokens = await this.getTokens({id: user.id, email });
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

  async getTokens({id, email}: Pick<User, 'id' | 'email'>) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
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

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const userEntity = await new UserEntity(user);
    const refreshTokenMatches = userEntity.validateRefreshToken(refreshToken);

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens({id: user.id, email: user.email });
    
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
