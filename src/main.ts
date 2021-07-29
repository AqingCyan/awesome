import app from './app';
import { APP_PORT } from './app/app.config';

/**
 * 启动 app 监听端口
 */
app.listen(APP_PORT, () => {
  console.log('🚀 服务已启动！');
});
