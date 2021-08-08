import { Request, Response, NextFunction } from 'express';
import { createUserLikePost, deleteUserLikePost } from './like.service';

/**
 * 点赞内容
 */
export const storeUserLikePost = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const { id: userId } = request.user;

  try {
    const data = await createUserLikePost(userId, parseInt(postId, 10));

    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 取消点赞
 */
export const destroyUserLikePost = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const { id: userId } = request.user;

  try {
    const data = await deleteUserLikePost(userId, parseInt(postId, 10));

    response.send(data);
  } catch (error) {
    next(error);
  }
};
