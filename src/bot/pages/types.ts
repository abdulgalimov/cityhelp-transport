import { BotContext } from '../context';
import { UpdateResult } from '../types';

export enum Pages {
  ADMIN = 'admin',
  START = 'start',
  DRIVER_REGISTER = 'iAmDriver',
  DRIVER = 'driver',
  FIND = 'find',
}

export interface PageOptions {
  name: Pages;
  command?: `/${string}`;
}

export interface IPage {
  options: PageOptions;
  init(manager: IManager);
  prepare(ctx: BotContext): Promise<void>;
  open(ctx: BotContext): Promise<UpdateResult | void>;
  execute(ctx: BotContext): Promise<UpdateResult | void>;
}

export interface IManager {
  open(page: Pages, ctx: BotContext);
}
