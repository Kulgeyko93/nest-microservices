import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'

export const getMondoConfig = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => ({
      uri: getMongoString(configService),
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  }
}

const getMongoString = (configService: ConfigService) => (
  `mongodb://${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}/${configService.get('MONGO_DATABASE')}`
);
