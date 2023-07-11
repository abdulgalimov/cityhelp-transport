import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { TelegramConfig } from '../../config';

@Injectable()
export class BotSecretToken implements CanActivate {
  private readonly tgConfig: TelegramConfig;

  constructor(config: ConfigService) {
    this.tgConfig = config.getOrThrow<TelegramConfig>('telegram');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    //console.log('tg update', JSON.stringify(request.body, null, 2));
    const receivedSecret = request.headers['x-telegram-bot-api-secret-token'];
    return receivedSecret === this.tgConfig.secretToken;
  }
}
