export const errorsMiddleware = () => {
  return async (ctx, next) => {
    try {
      const res = await next();
      return res;
    } catch (err) {
      console.log('err', err.message);
      return 'ok';
    }
  };
};
