import { Inject, Injectable } from '@nestjs/common';
import { BasePage } from '../base.page';
import { Pages } from '../types';
import { Methods, ResultSendMessage, UpdateResult } from '../../types';
import { BotContext } from '../../context';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config';
import { WebDataActionTypes } from '../../../types';
import { htmlEncode } from '../../utils';
import { DriversDbService } from '../../../database/services';
import { TransportTypePgService } from '../../../database/pg/services';

@Injectable()
export class DriverPage extends BasePage {
  @Inject(DriversDbService)
  private driversDbService: DriversDbService;
  @Inject(TransportTypePgService)
  private transportTypePgService: TransportTypePgService;

  private readonly appConfig: AppConfig;
  constructor(configService: ConfigService) {
    super({
      name: Pages.DRIVER,
      command: '/driver',
    });

    this.appConfig = configService.getOrThrow<AppConfig>('app');
  }

  private main(ctx: BotContext): ResultSendMessage {
    const { driver } = ctx.req.db.data;
    return {
      method: Methods.sendMessage,
      body: {
        chat_id: ctx.user.id,
        text: `Привет, ${driver.fullName}. Чтобы начать получать заказы, пришлите живое гео`,
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: 'Редактировать',
                web_app: {
                  url: `${this.appConfig.webUrl}/update-driver?driverId=${driver.id}`,
                },
              },
            ],
            [
              {
                text: 'Отправить гео',
                request_location: true,
              },
            ],
          ],
        },
      },
    };
  }

  public async prepare(ctx: BotContext): Promise<void> {
    const { db, user } = ctx.req;
    const [driver] = await Promise.all([
      this.driversDbService.findByUserId(user.id),
    ]);
    if (!driver) {
      return this.manager.open(Pages.START, ctx);
    }

    db.data.driver = driver;
  }

  public async open(ctx: BotContext): Promise<UpdateResult | void> {
    await super.open(ctx);

    return this.main(ctx);
  }

  public async execute(ctx: BotContext): Promise<UpdateResult | void> {
    if (ctx.update.edited_message?.location) {
      await this.updateLocation(ctx);
      return;
    }
    if (ctx.webApp?.action == WebDataActionTypes.UPDATE_DRIVER) {
      return await this.updateDriver(ctx);
    }
    //return this.main(ctx);
  }

  private async updateDriver(
    ctx: BotContext,
  ): Promise<ResultSendMessage | undefined> {
    const { db } = ctx.req;
    const { driver } = db.data;
    const transportType = await this.transportTypePgService.getById(
      ctx.webApp?.data.transportType,
    );
    if (!transportType) {
      return {
        method: Methods.sendMessage,
        body: {
          chat_id: ctx.user.id,
          text: 'Не верный тип транспорта, попробуйте еще раз',
        },
      };
    }
    await this.driversDbService.update(driver, {
      fullName: ctx.webApp?.data.fullName,
      phone: ctx.webApp?.data.phone,
      carNumber: ctx.webApp?.data.carNumber,
      transportType,
    });

    return {
      method: Methods.sendMessage,
      body: {
        chat_id: ctx.user.id,
        parse_mode: 'HTML',
        text: `Информация о вашем транспорте обновлена:
Имя водителя: <code>${htmlEncode(driver.fullName)}</code>
Номер машины: <code>${htmlEncode(driver.carNumber)}</code>
Номер телефона: <code>${htmlEncode(driver.phone)}</code>
Тип транспорта: <code>${htmlEncode(driver.transportType.title)}</code>.

Чтобы начать получать заказы, пришлите живое гео.`,
      },
    };
  }

  public async updateLocation(ctx: BotContext): Promise<boolean> {
    const location =
      ctx.update.edited_message?.location || ctx.update.message?.location;

    if (!location) return false;

    const { db } = ctx.req;

    if (!db.data.driver) {
      await this.prepare(ctx);
    }

    const { driver } = db.data;

    await this.driversDbService.update(driver, {
      latitude: `${location.latitude}`,
      longitude: `${location.longitude}`,
      lastOnline: new Date(),
    });

    return true;
  }
}
