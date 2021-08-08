import { connection } from '../app/database/mysql';
import { AvatarModel } from './avatar.model';

/**
 * 存储头像
 */
export const createAvatar = async (avatar: AvatarModel) => {
  const statement = `INSERT INTO avatar SET ?`;

  const [data] = await connection.promise().query(statement, avatar);

  return data;
};
