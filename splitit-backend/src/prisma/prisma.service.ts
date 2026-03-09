import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Kita buat koneksi pool manual karena Prisma 7 membutuhkannya jika 'url' di schema dihapus
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });
    const adapter = new PrismaPg(pool);
    
    // Kirim adapter ke constructor PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}