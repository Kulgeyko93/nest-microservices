import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config'

export const getMondoConfig = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => ({
      uri: getMongoString(configService),
    }),
    inject: [ConfigService],
    imports: [ConfigService],
  }
}

const getMongoString = (configService: ConfigService) => (
  `mongo://${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}}`
)
