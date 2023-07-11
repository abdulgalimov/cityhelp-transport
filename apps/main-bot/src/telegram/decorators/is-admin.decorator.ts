import { ITelegramContext } from '../types';

export const IsAdmin = () => {
  return (target, key?, descriptor?: TypedPropertyDescriptor<any>) => {
    if (!descriptor) return;

    const origin = descriptor.value;

    descriptor.value = async function (ctx: ITelegramContext, ...args) {
      const admin = await ctx.db.admins.findById(ctx.user.id);
      if (!admin) {
        throw new Error('Is admin only');
      }
      ctx.admin = admin;
      return origin.apply(this, [ctx, ...args]);
    };

    return descriptor;
  };
};
