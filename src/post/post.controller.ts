import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import { createPost, deletePost, getPosts, updatePost } from './post.service';

/**
 * 内容列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const posts = await getPosts();
    response.send(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建内容
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { title, content } = request.body;
  const { id: userId } = request.user;

  try {
    const data = await createPost({ title, content, userId });
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新内容
 */
export const update = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;
  const post = _.pick(request.body, ['title', 'content']);

  try {
    const data = await updatePost(parseInt(postId), post);
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除内容
 */
export const destroy = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { postId } = request.params;

  try {
    const data = await deletePost(parseInt(postId));
    response.send(data);
  } catch (error) {
    next(error);
  }
};
