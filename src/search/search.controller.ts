import { Request, Response, NextFunction } from 'express';
import { searchTags, searchUsers } from './search.service';

/**
 * 搜索标签
 */
export const tags = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { name } = request.query;

    const tags = await searchTags({ name: name as string });

    response.send(tags);
  } catch (error) {
    next(error);
  }
};

/**
 * 搜索用户
 */
export const users = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { name } = request.query;

    const users = await searchUsers({ name: name as string });

    response.send(users);
  } catch (error) {
    next(error);
  }
};
