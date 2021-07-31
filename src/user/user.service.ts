import { UserModel } from './user.model';
import { connection } from '../app/database/mysql';

/**
 * 创建用户
 */
export const createUser = async (user: UserModel) => {
  const statement = `INSERT INTO user SET ?`;

  const [data] = await connection.promise().query(statement, user);

  return data;
};

/**
 * 按用户名查找用户
 */
export const getUserByName = async (name: string) => {
  const statement = `SELECT id, name FROM user WHERE name = ?`;

  const [data] = await connection.promise().query(statement, name);

  return data[0];
};
