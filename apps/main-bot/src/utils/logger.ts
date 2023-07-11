import { Response } from 'express';

export function allRequestsLogger() {
  return function (req, res: Response, next) {
    const { ip, method, originalUrl, body, query, headers } = req;

    const userAgent = req.get('user-agent') || '';

    console.log(`${method} ${originalUrl} - ${userAgent} ${ip}`);
    console.log(' body', body);
    console.log(' query', query);
    console.log(' headers', headers);

    const oldSend = res.send;

    res.send = (body) => {
      console.log(' response', body);
      oldSend.apply(res, [body]);
      return res;
    };

    next();
  };
}
