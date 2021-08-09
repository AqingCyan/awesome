import { Request, Response, NextFunction } from 'express';
import {
  createComment,
  deleteComment,
  getComments,
  isReplayComment,
  updateComment,
} from './comment.service';

/**
 * 发表评论
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { id: userId } = request.user;
  const { content, postId } = request.body;

  const comment = { content, postId, userId };

  try {
    const data = await createComment(comment);
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复评论
 */
export const replay = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;
  const parentId = parseInt(commentId, 10);
  const { id: userId } = request.user;
  const { content, postId } = request.body;

  const comment = { content, postId, userId, parentId };

  // 检查评论是否为回复评论
  try {
    const replay = await isReplayComment(parentId);
    if (replay) return next(new Error('UNABLE_TO_REPLAY_THIS_COMMENT'));
  } catch (error) {
    next(error);
  }

  try {
    const data = await createComment(comment);
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 修改评论
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;
  const { content } = request.body;

  const comment = { id: parseInt(commentId, 10), content };

  try {
    const data = await updateComment(comment);

    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除评论
 */
export const destroyComment = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { commentId } = request.params;

  try {
    const data = await deleteComment(parseInt(commentId, 10));
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 评论列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const comments = await getComments({ filter: request.filter });

    response.send(comments);
  } catch (error) {
    next(error);
  }
};
