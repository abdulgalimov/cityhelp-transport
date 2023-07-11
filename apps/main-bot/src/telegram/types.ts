import { Deunionize } from 'telegraf/typings/deunionize';
import { Context, Scenes } from 'telegraf';
import tg from 'telegraf/typings/core/types/typegram';
import { IAdmin, IUser } from '../types';
import { AdminPgService, UserPgService } from '../database/pg/services';

export interface ISession {
  temp?: number;
}

export interface IState {
  temp?: number;
}

export interface IDbContext {
  users: UserPgService;
  admins: AdminPgService;
}

export interface TgAppContext {
  db: IDbContext;
  user: IUser;
  admin?: IAdmin;
  session: ISession;
  scene: { state: IState };
}

export type ITelegramContext<U extends Deunionize<tg.Update> = tg.Update> =
  Context<U> & Scenes.SceneContext & TgAppContext;

export type ContextWithTextMessage = ITelegramContext<
  tg.Update.MessageUpdate<tg.Message.TextMessage>
>;

export type ContextWithPhotoMessage = ITelegramContext<
  tg.Update.MessageUpdate<tg.Message.PhotoMessage>
>;

export type ContextWithDocumentMessage = ITelegramContext<
  tg.Update.MessageUpdate<tg.Message.DocumentMessage>
>;

export type ContextWithWebAppMessage = ITelegramContext<
  tg.Update.MessageUpdate<tg.Message.WebAppDataMessage>
>;
