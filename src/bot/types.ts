import { MessageEntity, ParseMode } from '@grammyjs/types/message';
import {
  ForceReply,
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
} from '@grammyjs/types/markup';
import {
  InlineQueryResult,
  InlineQueryResultsButton,
} from '@grammyjs/types/inline';
import { BotCommand } from '@grammyjs/types/manage';
import { BotCommandScope } from '@grammyjs/types/settings';

export enum HiddenActionTypes {
  OPEN_SERVICE = 'open_service',
}

export interface IHiddenAction {
  type: HiddenActionTypes;
  serviceId?: string;
}

export enum Methods {
  answerInlineQuery = 'answerInlineQuery',
  sendMessage = 'sendMessage',
}

export interface UpdateResult {
  method: Methods;
  body: Record<string, any>;
  debug?: true;
}

export interface SendMessageArgs {
  chat_id: number | string;
  message_thread_id?: number;
  text: string;
  parse_mode?: ParseMode;
  entities?: MessageEntity[];
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  protect_content?: boolean;
  reply_to_message_id?: number;
  allow_sending_without_reply?: boolean;
  reply_markup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
}

export interface SetMyCommandsArgs {
  commands: readonly BotCommand[];
  scope?: BotCommandScope;
  language_code?: string;
}

export interface ResultSendMessage extends UpdateResult {
  method: Methods.sendMessage;
  body: SendMessageArgs;
}

export interface AnswerInlineArgs {
  inline_query_id: string;
  results: readonly InlineQueryResult[];
  cache_time?: number;
  is_personal?: boolean;
  next_offset?: string;
  button?: InlineQueryResultsButton;
}

export interface ResultAnswerInline extends UpdateResult {
  method: Methods.answerInlineQuery;
  body: AnswerInlineArgs;
}
