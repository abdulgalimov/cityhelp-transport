import { Injectable } from '@nestjs/common';
import { BasePage } from '../base.page';
import { Pages } from '../types';
import { Methods, UpdateResult } from '../../types';
import { BotContext } from '../../context';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config';
import { RegisterPage } from '../driver/register.page';
import { BotApiService } from '../../api';
import { DriversDbService } from '../../../database/services';

@Injectable()
export class StartPage extends BasePage {
  private readonly appConfig: AppConfig;
  constructor(
    private readonly driverPage: RegisterPage,
    configService: ConfigService,
    private readonly botApiService: BotApiService,
    private readonly driversDbService: DriversDbService,
  ) {
    super({
      name: Pages.START,
      command: '/start',
    });

    this.appConfig = configService.getOrThrow<AppConfig>('app');
  }

  private async main(ctx: BotContext) {
    const { user } = ctx;
    await this.botApiService.setCommands({
      scope: {
        type: 'chat',
        chat_id: user.id,
      },
      commands: [
        {
          command: '/driver',
          description: 'Я водитель',
        },
        {
          command: '/find',
          description: 'Найти транспорт',
        },
      ],
    });
    return {
      method: Methods.sendMessage,
      body: {
        chat_id: user.id,
        text: 'Укажите пожалуйста как вы хотите пользоваться ботом?',
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: 'Я водитель',
              },
            ],
            [
              {
                text: 'Мне нужен транспорт',
              },
            ],
          ],
        },
      },
    };
  }

  public async open(ctx: BotContext): Promise<UpdateResult | void> {
    await super.open(ctx);

    return this.main(ctx);
  }

  public async execute(ctx: BotContext): Promise<UpdateResult | void> {
    switch (ctx.update.message?.text) {
      case 'Я водитель':
        return this.iAmDriver(ctx);
      case 'Мне нужен транспорт':
        return this.iNeedTransport(ctx);
    }

    return this.main(ctx);
  }

  private async iAmDriver(ctx: BotContext) {
    const { db, user } = ctx.req;
    const driver = await this.driversDbService.findByUserId(user.id);
    if (!driver) {
      return this.manager.open(Pages.DRIVER_REGISTER, ctx);
    } else {
      db.data.driver = driver;
      return this.manager.open(Pages.DRIVER, ctx);
    }
  }

  private async iNeedTransport(ctx: BotContext) {
    return this.manager.open(Pages.FIND, ctx);
  }
}
