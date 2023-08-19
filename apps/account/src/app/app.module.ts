import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env'})],
})
export class AppModule {}
