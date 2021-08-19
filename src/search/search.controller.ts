import { Request, Response, NextFunction } from 'express';
import { searchTags } from './search.service';

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
