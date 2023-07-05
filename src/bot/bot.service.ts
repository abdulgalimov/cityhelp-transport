import { Inject, Injectable } from '@nestjs/common';
import { UpdateResult } from './types';
import { PageManager, Pages } from './pages';
import { BotContext } from './context';

@Injectable()
export class BotService {
  @Inject(PageManager)
  private pageManager: PageManager;

  public async update(ctx: BotContext): Promise<UpdateResult | void> {
    console.log(
      'ctx.session',
      ctx.session.pageName,
      JSON.stringify(ctx.update, null, 2),
    );
    const command = ctx.update.message?.text;
    const pageByCommand = this.pageManager.findByCommand(command!);
    if (pageByCommand) {
      return this.pageManager.open(pageByCommand, ctx);
    }

    const updateLocation = await this.pageManager.updateDriverLocation(ctx);
    if (updateLocation) {
      return;
    }

    const inlineFind = await this.pageManager.updateInlineFind(ctx);
    if (inlineFind) {
      return inlineFind;
    }

    if (!ctx.session.pageName) {
      return this.pageManager.open(Pages.START, ctx);
    }

    return this.pageManager.execute(ctx.session.pageName, ctx);
  }
}
