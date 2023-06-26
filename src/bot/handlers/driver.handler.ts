import { Injectable } from '@nestjs/common';
import { InputRequest } from '../../types';
import { Methods, ResultSendMessage, UpdateResult } from '../types';
import { DriverPgService } from '../../database/pg/services';

@Injectable()
export class DriverHandler {
  constructor(private readonly driverPgService: DriverPgService) {}

  public async update(req: InputRequest): Promise<UpdateResult | void> {
    const { user } = req;
    if (!req.db.data.driver) {
      const driver = await this.driverPgService.findByUserId(user.id);
      if (!driver) {
        throw new Error('driver invalid');
      }

      req.db.data.driver = driver;
    }
    return this.main(req);
  }

  public main(req: InputRequest): ResultSendMessage {
    const { user } = req;
    const { driver } = req.db.data;
    return {
      method: Methods.sendMessage,
      body: {
        chat_id: user.id,
        text: `Приветствую ${driver.fullName}`,
      },
    };
  }
}
