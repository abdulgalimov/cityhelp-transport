import { Global, Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { UpdateTgService } from './update-tg.service';
import { userMiddleware } from './middlewares';
import { RedisModule } from '../database/redis';
import { AdminPgService, UserPgService } from '../database/pg/services';
import { TelegramConfig } from '../config';
import { AuthModule } from '../auth/auth.module';
import { dbMiddleware } from './middlewares/db.middleware';
import { errorsMiddleware } from './middlewares/errors.middleware';

@Global()
@Module({
  imports: [
    AuthModule,
    RedisModule,
    TelegrafModule.forRootAsync({
      inject: [ConfigService, UserPgService, AdminPgService],
      useFactory: async (
        config: ConfigService,
        users: UserPgService,
        admins: AdminPgService,
      ) => {
        const telegramToken =
          config.getOrThrow<TelegramConfig>('telegram').apiToken;

        return {
          token: telegramToken,
          launchOptions: {
            allowedUpdates: [],
          },
          middlewares: [
            errorsMiddleware(),
            dbMiddleware({
              users,
              admins,
            }),
            userMiddleware(),
          ],
        };
      },
    }),
  ],
  providers: [UpdateTgService],
})
export class TelegramModule {}
