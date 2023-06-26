import { Injectable } from '@nestjs/common';
import { StartPage } from './start/start.page';
import { IManager, IPage, Pages } from './types';
import { BotContext } from '../context';
import { UpdateResult } from '../types';
import { RegisterPage } from './driver/register.page';
import { DriverPage } from './driver/driver.page';
import { FindPage } from './find/find.page';
import { AdminPage } from './admin/admin.page';

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

@Injectable()
export class PageManager implements IManager {
  private readonly pages: PartialRecord<Pages, IPage> = {};
  private readonly pagesByCommand: Record<string, IPage> = {};

  constructor(
    private readonly startPage: StartPage,
    private readonly iAmDriverPage: RegisterPage,
    private readonly driverPage: DriverPage,
    private readonly findPage: FindPage,
    private readonly adminPage: AdminPage,
  ) {
    this.init(startPage);
    this.init(iAmDriverPage);
    this.init(driverPage);
    this.init(findPage);
    this.init(adminPage);
  }

  private init(page: IPage) {
    page.init(this);
    if (page.options.command) {
      this.pagesByCommand[page.options.command] = page;
    }
    this.pages[page.options.name] = page;
  }

  public findByCommand(command: string): Pages | null {
    return this.pagesByCommand[command]
      ? this.pagesByCommand[command].options.name
      : null;
  }

  public async open(
    pageName: Pages,
    ctx: BotContext,
  ): Promise<UpdateResult | void> {
    const page = this.pages[pageName];
    if (!page) {
      throw new Error(`Page with name ${pageName} not found`);
    }

    await page.prepare(ctx);

    return page.open(ctx);
  }

  public async execute(
    pageName: Pages,
    ctx: BotContext,
  ): Promise<UpdateResult | void> {
    const page = this.pages[pageName];
    if (!page) {
      throw new Error(`Page with name ${pageName} not found`);
    }

    await page.prepare(ctx);

    return page.execute(ctx);
  }

  public updateDriverLocation(ctx) {
    return this.driverPage.updateLocation(ctx);
  }
}
