import { DynamicModule, Global, Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotApiService } from './api';
import { BotService } from './bot.service';
import { AuthModule } from '../auth/auth.module';
import { loadTelegramConfig } from '../config';
import {
  PageManager,
  StartPage,
  RegisterPage,
  DriverPage,
  FindPage,
  AdminPage,
} from './pages';
import { RedisModule } from '../database/redis';

@Global()
@Module({})
export class BotModule {
  static register(): DynamicModule {
    const telegramConfig = loadTelegramConfig();
    if (!telegramConfig.starting) {
      return { module: BotModule };
    }

    return {
      imports: [AuthModule, RedisModule],
      module: BotModule,
      controllers: [BotController],
      providers: [
        BotService,
        BotApiService,
        PageManager,
        StartPage,
        RegisterPage,
        DriverPage,
        FindPage,
        AdminPage,
      ],
      exports: [BotApiService],
    };
  }
}
