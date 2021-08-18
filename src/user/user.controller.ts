import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import * as userService from './user.service';

/**
 * 创建用户
 */
export const store = async (request: Request, response: Response, next: NextFunction) => {
  const { name, password } = request.body;

  try {
    const data = await userService.createUser({ name, password });
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 用户账户
 */
export const show = async (request: Request, response: Response, next: NextFunction) => {
  const { userId } = request.params;

  try {
    const user = await userService.getUserById(parseInt(userId, 10));

    if (!user) {
      return next(new Error('USER_NOT_FOUND'));
    }

    response.send(user);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新用户
 */
export const update = async (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.user;
  const userData = _.pick(request.body.update, ['name', 'password']);

  try {
    const data = await userService.updateUser(id, userData);

    response.send(data);
  } catch (error) {
    next(error);
  }
};
