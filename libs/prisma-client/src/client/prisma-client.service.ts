import {INestApplication, Logger, OnModuleInit} from '@nestjs/common';
import {PrismaClient, Prisma} from '@prisma/prisma-api-client';
// import {InjectPinoLogger, PinoLogger} from 'nestjs-pino';

export class PrismaClientService extends PrismaClient implements OnModuleInit {
    constructor(
        // @InjectPinoLogger(PrismaClientService.name) private readonly pinoLogger: PinoLogger,
    ) {
        super();
    }

    async onModuleInit() {
        // try {
        //     this.pinoLogger.debug('Starting database connection', 'PrismaClientService');
        //     await this.$connect();
        //     this.pinoLogger.info('Established database connection', 'PrismaClientService');
        // } catch (error) {
        //     if (error instanceof Prisma.PrismaClientInitializationError) {
        //         this.pinoLogger.error(
        //             `Database connection failed: ${error.message}`,
        //             'PrismaClientService'
        //         );
        //     }
        //     throw error;
        // }
    }

    async enableShutdownHooks(app: INestApplication) {
        // this.$on('beforeExit', async () => {
        //     this.pinoLogger.info('Closing database connection', 'PrismaClientService')
        //     await app.close();
        // });
    }
}
