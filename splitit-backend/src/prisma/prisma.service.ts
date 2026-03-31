import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { PoolConfig } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Use a pool config to avoid mismatched Pool types between packages
    const poolConfig: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
    };
    const adapter = new PrismaPg(poolConfig);

    // Pass the adapter to the PrismaClient constructor
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}