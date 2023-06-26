import { Command, Ctx, Update } from 'nestjs-telegraf';
import { Inject, Logger } from '@nestjs/common';
import { RedisService } from '../database/redis';
import { AuthService } from '../auth/auth.service';
import { IsAdmin } from './decorators';
import { ContextWithTextMessage } from './types';

@Update()
export class UpdateTgService {
  public logger: Logger = new Logger('UpdateTgService');

  @Inject(RedisService)
  private redis: RedisService;

  constructor(
    @Inject(AuthService)
    private authService: AuthService,
  ) {}

  @Command('ping')
  async apiLogin(@Ctx() ctx: ContextWithTextMessage) {
    this.logger.log('ping');

    return `pong`;
  }

  @Command('auth')
  @IsAdmin()
  async getToken(@Ctx() ctx: ContextWithTextMessage) {
    if (!ctx.admin) {
      await ctx.reply('Команда доступна только администратору');
      return;
    }

    const { access_token } = await this.authService.login(ctx.user);

    await ctx.reply(`<pre>${access_token}</pre>`, {
      parse_mode: 'HTML',
    });
  }

  @Command('driver')
  async registerDriver(@Ctx() ctx: ContextWithTextMessage) {
    console.log('registerDriver');
    await ctx.reply('Регистрация нового водителя', {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Регистрация',
              web_app: {
                url: 'https://f709-195-19-121-91.ngrok-free.app/register-driver',
              },
            },
          ],
        ],
      },
    });
  }
}
