import { Request, Response, NextFunction } from 'express';
import { POSTS_PER_PAGE } from '../app/app.config';

/**
 * 排序方式
 */
export const sort = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { sort } = request.query;

  let sqlSort: string;

  switch (sort) {
    case 'earliest':
      sqlSort = 'post.id ASC';
      break;
    case 'latest':
      sqlSort = 'post.id DESC';
      break;
    case 'most_comments':
      sqlSort = 'totalComments DESC, post.id DESC';
      break;
    default:
      sqlSort = 'post.id DESC';
      break;
  }

  request.sort = sqlSort;

  next();
};

/**
 * 过滤列表
 */
export const filter = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { tag, user, action } = request.query;

  // 设置默认过滤
  request.filter = {
    name: 'default',
    sql: 'post.id IS NOT NULL',
  };

  // 按照标签名过滤
  if (tag && !user && !action) {
    request.filter = {
      name: 'tagName',
      sql: 'tag.name = ?',
      param: tag as string,
    };
  }

  // 过滤出用户发布的内容
  if (user && action === 'published' && !tag) {
    request.filter = {
      name: 'userPublished',
      sql: 'user.id = ?',
      param: user as string,
    };
  }

  next();
};

/**
 * 内容分页
 */
export const paginate = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 当前页码
  const { page = '1' } = request.query;

  const limit = parseInt(POSTS_PER_PAGE, 10) || 30;

  // 计算偏移量
  const offset = limit * (parseInt(page as string, 10) - 1);

  request.pagination = { limit, offset };

  next();
};
