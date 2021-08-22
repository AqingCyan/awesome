import { Request, Response, NextFunction } from 'express';
import { getAccessCount, getAccessCountByAction } from './dashboard.service';

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

/**
 * 按动作分时段获取访问次数
 */
export const accessCountShow = async (request: Request, response: Response, next: NextFunction) => {
  const {
    params: { action },
    filter,
  } = request;

  try {
    const accessCount = await getAccessCountByAction({ action, filter });

    response.send(accessCount);
  } catch (error) {
    next(error);
  }
};
