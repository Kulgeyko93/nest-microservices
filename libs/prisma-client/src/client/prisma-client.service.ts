import { Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from "@prisma/client";


export class PrismaClientService extends PrismaClient implements OnModuleInit {
    private logger: Logger;

    constructor() {
        super();
        this.logger = new Logger();
    }

    async onModuleInit() {
        try {
            this.logger.debug('Starting database connection', 'PrismaClientService');
            await this.$connect();
            this.logger.log('Established database connection', 'PrismaClientService');
        } catch (error) {
            if (error instanceof Prisma.PrismaClientInitializationError) {
                this.logger.error(
                    `Database connection failed: ${error.message}`,
                    'PrismaClientService'
                );
            }
            throw error;
        }
    }
}
