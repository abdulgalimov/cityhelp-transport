import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { BotApiService } from './api';
import { BotSecretToken } from './guards/secret';
import { BotService } from './bot.service';
import { GetBotUser, ErrorsInterceptor } from './decorators';
import { InputRequest } from '../types';
import { DbServices } from '../decorators';
import { BotContext } from './context';
import { RedisService } from '../database/redis';

@Controller('bot')
export class BotController {
  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(BotService)
  private botService: BotService;

  @Inject(BotApiService)
  private botApiService: BotApiService;

  @Post('update')
  @UseInterceptors(ErrorsInterceptor)
  @UseGuards(BotSecretToken, DbServices, GetBotUser)
  async update(@Request() req: InputRequest, @Body() update) {
    if (!req.user) {
      return 'ok';
    }

    const ctx = new BotContext(req, update, this.redisService);
    await ctx.init();

    const updateResult = await this.botService.update(ctx);
    if (!updateResult) {
      return {
        ok: true,
      };
    }

    const { debug, method, body } = updateResult;
    if (debug) {
      console.log('# debug #################################');
      console.log('send:', method, body);
      const sendResult = await this.botApiService.callApi(method, body);
      console.log('result:', sendResult);
      console.log('#########################################');
      return;
    }

    return {
      method,
      ...body,
    };
  }
}
