import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMondoConfig } from './configs/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env'}),
    UserModule,
    AuthModule,
    MongooseModule.forRootAsync(getMondoConfig()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
