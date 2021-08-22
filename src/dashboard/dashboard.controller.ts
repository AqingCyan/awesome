import { Request, Response, NextFunction } from 'express';
import { getAccessCount } from './dashboard.service';

/**
 * 访问次数列表
 */
export const accessCountIndex = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { filter } = request;

  try {
    const accessCounts = await getAccessCount({ filter });

    response.send(accessCounts);
  } catch (error) {
    next(error);
  }
};
