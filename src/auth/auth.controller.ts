import { Request, Response, NextFunction } from 'express';

/**
 * 用户登录
 */
export const login = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { name } = request.body;

  response.send({ message: `欢迎回来：${name}` });
};
