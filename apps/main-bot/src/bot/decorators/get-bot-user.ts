import { CanActivate } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { Update, User } from '@grammyjs/types';
import { InputRequest } from '../../types';

export class GetBotUser implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<InputRequest>();

      const update: Update = req.body;

      const { db } = req;

      const from: User | undefined =
        update.message?.from ||
        update.edited_message?.from ||
        update.inline_query?.from ||
        update.chosen_inline_result?.from;
      if (!from) {
        console.dir(update);
        throw new Error('Invalid from user');
      }

      const [user, profile] = await Promise.all([
        db.managers.users.getFrom(from),
        db.managers.profiles.getByUserId(from.id),
      ]);

      req.user = user;

      req.db.data.profile = profile;

      return Promise.resolve(true);
    } catch (err) {
      console.log('err', err);
      return Promise.resolve(true);
    }
  }
}
