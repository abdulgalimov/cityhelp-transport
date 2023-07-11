import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loadConfig } from './config';
import { PgModule } from './database/pg';
import { RedisModule } from './database/redis';
import { EsModule } from './database/es';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { ViewModule } from './view/view.module';
import { BotModule } from './bot/bot.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfig],
      validate: undefined,
    }),
    EsModule,
    PgModule,
    DatabaseModule,
    RedisModule,
    ApiModule,
    BotModule.register(),
    AuthModule,
    ViewModule,
  ],
  controllers: [],
})
export class AppModule {}
