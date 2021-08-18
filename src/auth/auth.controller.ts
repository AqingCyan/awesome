import { Request, Response, NextFunction } from 'express';
import { signToken } from './auth.service';

/**
 * 用户登录
 */
export const login = async (request: Request, response: Response, next: NextFunction) => {
  const {
    user: { id, name },
  } = request.body;

  const payload = { id, name };

  try {
    const token = signToken({ payload });
    response.send({ id, name, token });
  } catch (error) {
    next(error);
  }
};

/**
 * 验证登录
 */
export const validate = (request: Request, response: Response, next: NextFunction) => {
  console.log(request.user);
  response.sendStatus(200);
};
