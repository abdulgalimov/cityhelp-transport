import { Inject, Injectable } from '@nestjs/common';
import { BasePage } from '../base.page';
import { Pages } from '../types';
import { Methods, ResultSendMessage, UpdateResult } from '../../types';
import { BotContext } from '../../context';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config';
import { RegisterPage } from '../driver/register.page';
import { AuthService } from '../../../auth/auth.service';
import { AdminPgService } from '../../../database/pg/services';

@Injectable()
export class AdminPage extends BasePage {
  constructor(
    private readonly driverPage: RegisterPage,
    @Inject(AuthService)
    private authService: AuthService,
    private adminPgService: AdminPgService,
  ) {
    super({
      name: Pages.ADMIN,
      command: '/admin',
    });
  }

  public async prepare(ctx: BotContext): Promise<void> {
    const { user } = ctx;
    const admin = await this.adminPgService.findById(user.id);
    ctx.req.db.data.admin = admin;
  }

  private main(ctx: BotContext) {
    return {
      method: Methods.sendMessage,
      body: {
        chat_id: ctx.user.id,
        text: 'Admin',
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: 'Get token',
              },
            ],
          ],
        },
      },
    };
  }

  public async open(ctx: BotContext): Promise<UpdateResult | void> {
    if (!ctx.req.db.data.admin) {
      return;
    }

    await super.open(ctx);

    return this.main(ctx);
  }

  public async execute(ctx: BotContext): Promise<UpdateResult | void> {
    if (!ctx.req.db.data.admin) {
      return;
    }

    switch (ctx.update.message?.text) {
      case 'Get token':
        return this.getToken(ctx);
    }

    return this.main(ctx);
  }

  private async getToken(ctx: BotContext): Promise<ResultSendMessage> {
    const { db, user } = ctx.req;
    const { access_token } = await this.authService.login(ctx.user);

    return {
      method: Methods.sendMessage,
      body: {
        chat_id: user.id,
        parse_mode: 'HTML',
        text: `<code>${access_token}</code>`,
      },
    };
  }
}
