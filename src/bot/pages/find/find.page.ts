import { Injectable } from '@nestjs/common';
import { BasePage } from '../base.page';
import { Pages } from '../types';
import { BotContext } from '../../context';
import {
  Methods,
  ResultAnswerInline,
  ResultSendMessage,
  UpdateResult,
} from '../../types';
import { InlineQuery, InlineQueryResult } from '@grammyjs/types/inline';
import { DriversDbService } from '../../../database/services';

@Injectable()
export class FindPage extends BasePage {
  constructor(private readonly driverDbService: DriversDbService) {
    super({
      name: Pages.FIND,
      command: '/find',
    });
  }

  private main(ctx: BotContext): ResultSendMessage {
    return {
      method: Methods.sendMessage,
      body: {
        chat_id: ctx.user.id,
        text: 'Поиск транспорта',
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: 'Оставить заявку',
              },
            ],
            [
              {
                text: 'Поиск транспорта',
              },
            ],
          ],
        },
      },
    };
  }

  public async open(ctx: BotContext): Promise<ResultSendMessage | void> {
    await super.open(ctx);

    return this.main(ctx);
  }

  public async execute(ctx: BotContext): Promise<UpdateResult | void> {
    if (ctx.update.inline_query) {
      return this.inlineQuery(ctx);
    }

    if (ctx.update.message?.text === 'Поиск транспорта') {
      return this.findMenu(ctx);
    }
  }

  public async tryForceUpdate(
    ctx: BotContext,
  ): Promise<UpdateResult | boolean | void> {
    const inlineResult = await this.inlineQuery(ctx);
    if (inlineResult) {
      return inlineResult;
    }
  }

  private findMenu(ctx: BotContext) {
    return {
      method: Methods.sendMessage,
      body: {
        chat_id: ctx.user.id,
        text: `Для поиска необходимого транспорта, нажмите кнопку Поиск и начните писать свой запрос,
например: Ломовоз 15 тон`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Поиск',
                switch_inline_query_current_chat: '',
              },
            ],
          ],
        },
      },
    };
  }

  private async inlineQuery(
    ctx: BotContext,
  ): Promise<ResultAnswerInline | undefined> {
    if (!ctx.update.inline_query) return;

    const inlineQuery: InlineQuery = ctx.update.inline_query!;

    const foundDrivers = await this.driverDbService.find({
      query: inlineQuery.query,
      location: inlineQuery.location,
    });

    const results: InlineQueryResult[] = foundDrivers.map((found) => {
      const { driver, distance } = found;
      const description = `${found.driver.fullName} | ${found.driver.phone}
${distance?.toFixed(3)}`;
      return {
        type: 'article',
        id: `${driver.id}`,
        title: driver.transportType.title,
        description,
        input_message_content: {
          message_text: `${driver.transportType.title}
${driver.fullName}
${driver.phone}`,
        },
      };
    });

    return {
      method: Methods.answerInlineQuery,
      body: {
        inline_query_id: inlineQuery.id,
        results,
        cache_time: 1,
        is_personal: true,
      },
    };
  }
}
