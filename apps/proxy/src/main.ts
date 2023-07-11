import * as ngrok from 'ngrok';
import * as fs from 'fs';

async function bootstrap() {
  const url = await ngrok.connect({
    proto: 'http',
    addr: 4005,
    onStatusChange: (status) => {
      console.log('onStatusChange', status);
    },
    onLogEvent: (data) => {
      console.log('onLogEvent', data);
    },
  });
  const reg = /^WEB_URL=.+$/m;
  const env = fs
    .readFileSync('.local.env')
    .toString()
    .replace(reg, `WEB_URL=${url}`);

  fs.writeFileSync('.local.env', env);
  console.log('proxy url', url);
}
bootstrap();
