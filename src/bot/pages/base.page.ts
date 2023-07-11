import { IManager, IPage, PageOptions } from './types';
import { BotContext } from '../context';
import { UpdateResult } from '../types';

export class BasePage implements IPage {
  protected manager: IManager;

  constructor(public readonly options: PageOptions) {}

  public init(manager: IManager) {
    this.manager = manager;
  }

  public async prepare(ctx: BotContext): Promise<void> {
    // override this
  }

  public async open(ctx: BotContext): Promise<UpdateResult | void> {
    ctx.session.pageName = this.options.name;
  }

  public async execute(ctx: BotContext): Promise<UpdateResult | void> {
    return;
  }

  public async tryForceUpdate(
    ctx: BotContext,
  ): Promise<UpdateResult | boolean | void> {
    return;
  }
}
