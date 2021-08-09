import { Request, Response, NextFunction } from 'express';

/**
 * 评论过滤器
 */
export const filter = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { post, user, action } = request.query;

  // 默认获取不是回复类型的评论
  request.filter = {
    name: 'default',
    sql: 'comment.parentId IS NULL',
  };

  // 过滤：post对应的评论
  if (post && !user && !action) {
    request.filter = {
      name: 'postComments',
      sql: 'comment.parentId IS NULL AND comment.postId = ?',
      param: post as string,
    };
  }

  // 过滤：用户发布的评论
  if (user && action === 'published' && !post) {
    request.filter = {
      name: 'userPublished',
      sql: 'comment.parentId IS NULL AND comment.userId = ?',
      param: user as string,
    };
  }

  // 过滤：用户回复的评论
  if (user && action === 'replied' && !post) {
    request.filter = {
      name: 'userReplied',
      sql: 'comment.parentId IS NOT NULL AND comment.userId = ?',
      param: user as string,
    };
  }

  next();
};
