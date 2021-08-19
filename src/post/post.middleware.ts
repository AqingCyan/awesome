import { Request, Response, NextFunction } from 'express';

/**
 * 排序方式
 */
export const sort = async (request: Request, response: Response, next: NextFunction) => {
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
export const filter = async (request: Request, response: Response, next: NextFunction) => {
  const { tag, user, action, cameraMake, cameraModel, lensMake, lensModel } = request.query;

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

  // 过滤出用户赞过的内容
  if (user && action === 'liked' && !tag) {
    request.filter = {
      name: 'userLiked',
      sql: 'user_like_post.userId = ?',
      param: user as string,
    };
  }

  // 过滤出某种相机拍摄的内容
  if (cameraMake && cameraModel) {
    request.filter = {
      name: 'camera',
      sql: `file.metadata->'$.Make' = ? AND file.metadata->'$.Model' = ?`,
      params: [cameraMake as string, cameraModel as string],
    };
  }

  // 过滤出某种镜头拍摄的内容
  if (lensMake && lensModel) {
    request.filter = {
      name: 'lens',
      sql: `file.metadata->'$.LensMake' = ? AND file.metadata->'$.LensModel' = ?`,
      params: [lensMake as string, lensModel as string],
    };
  }

  next();
};

/**
 * 内容分页
 */
export const paginate = (itemsPerPage: number) => async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 当前页码
  const { page = '1' } = request.query;

  const limit = itemsPerPage || 30;

  // 计算偏移量
  const offset = limit * (parseInt(page as string, 10) - 1);

  request.pagination = { limit, offset };

  next();
};
