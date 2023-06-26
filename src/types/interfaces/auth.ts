export enum TokenPayloadType {
  JWT = 'jwt',
  TELEGRAM = 'telegram',
}

export interface IPayloadToken {
  type?: TokenPayloadType;
}

export interface IJwtTokenPayload extends IPayloadToken {
  type?: TokenPayloadType.JWT;
  userId: string;
  ip: string;
}

export interface ITelegramTokenPayload extends IPayloadToken {
  type: TokenPayloadType.TELEGRAM;
  initData: string;
}
