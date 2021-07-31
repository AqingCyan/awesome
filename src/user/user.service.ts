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
interface GetUserOptions {
  password?: boolean;
}
export const getUserByName = async (
  name: string,
  options: GetUserOptions = {},
) => {
  const { password } = options;

  const statement = `SELECT id, name${
    password ? ', password' : ''
  } FROM user WHERE name = ?`;

  const [data] = await connection.promise().query(statement, name);

  return data[0];
};
