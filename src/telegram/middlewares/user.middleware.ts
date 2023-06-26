export const userMiddleware = () => {
  return async (ctx, next) => {
    console.log('ctx', ctx.update);
    if (ctx.from) {
      ctx.user = await ctx.db.users.getFrom(ctx.from);
    }
    return next();
  };
};
