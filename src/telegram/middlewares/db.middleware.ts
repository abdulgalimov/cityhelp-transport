import { IDbContext } from '../types';

export const dbMiddleware = (db: IDbContext) => {
  return async (ctx, next) => {
    ctx.db = db;
    return next();
  };
};
