import { connection } from '../app/database/mysql';
import { AccessLogModel } from './access-log.model';
import { socketIoServer } from '../app/app.server';

/**
 * 创建访问日志
 */
export const createAccessLog = async (accessLog: AccessLogModel) => {
  const statement = `INSERT INTO access_log SET ?`;

  const [data] = await connection.promise().query(statement, accessLog);

  // 触发日志已创建事件
  socketIoServer.emit('accessLogCreated', accessLog.action);

  return data;
};
