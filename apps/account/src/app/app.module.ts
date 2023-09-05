import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { PrismaClientModule } from "@chat/prisma-client";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, envFilePath: './envs/.acount.env'
    }),
    PrismaClientModule,
    AuthModule,
    UserModule
    
  ],
})
export class AppModule {}
