import { Request, Response, NextFunction } from 'express';
import {
  createComment,
  deleteComment,
  getCommentById,
  getCommentReplies,
  getComments,
  getCommentsTotalCount,
  isReplayComment,
  updateComment,
} from './comment.service';
import { socketIoServer } from '../app/app.server';

/**
 * 发表评论
 */
export const store = async (request: Request, response: Response, next: NextFunction) => {
  const { id: userId } = request.user;
  const { content, postId } = request.body;
  const socketId = request.header('X-Socket-Id');

  const comment = { content, postId, userId };

  try {
    const data = await createComment(comment);

    // 调取新创建的评论
    const createdComment = await getCommentById(data.insertId);

    // 触发事件
    socketIoServer.emit('commentCreated', { comment: createdComment, socketId });

    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 回复评论
 */
export const replay = async (request: Request, response: Response, next: NextFunction) => {
  const { commentId } = request.params;
  const parentId = parseInt(commentId, 10);
  const { id: userId } = request.user;
  const { content, postId } = request.body;
  const socketId = request.header('X-Socket-Id');

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

    // 回复数据
    const reply = await getCommentById(data.insertId, { resourceType: 'reply' });

    // 触发回复事件
    socketIoServer.emit('commentReplyCreated', { reply, socketId });

    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 修改评论
 */
export const update = async (request: Request, response: Response, next: NextFunction) => {
  const { commentId } = request.params;
  const { content } = request.body;
  const socketId = request.header('X-Socket-Id');

  const comment = { id: parseInt(commentId, 10), content };

  try {
    const data = await updateComment(comment);

    // 准备资源
    const isReply = await isReplayComment(parseInt(commentId, 10));
    const resourceType = isReply ? 'reply' : 'comment';
    const resource = await getCommentById(parseInt(commentId, 10), { resourceType });

    // 触发事件
    const eventName = isReply ? 'commentReplyUpdated' : 'commentUpdated';

    // 如果是回复更新，就触发回复更新事件，如果是评论更新亦然
    socketIoServer.emit(eventName, { [resourceType]: resource, socketId });

    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除评论
 */
export const destroyComment = async (request: Request, response: Response, next: NextFunction) => {
  const { commentId } = request.params;
  const socketId = request.header('X-Socket-Id');

  try {
    // 准备资源
    const isReply = await isReplayComment(parseInt(commentId, 10));
    const resourceType = isReply ? 'reply' : 'comment';
    const resource = await getCommentById(parseInt(commentId, 10), { resourceType });

    // 触发事件
    const eventName = isReply ? 'commentReplyDeleted' : 'commentDeleted';

    // 如果是回复删除，就触发回复删除事件，如果是评论更新亦然
    socketIoServer.emit(eventName, { [resourceType]: resource, socketId });

    const data = await deleteComment(parseInt(commentId, 10));
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 评论列表
 */
export const index = async (request: Request, response: Response, next: NextFunction) => {
  // 统计评论数量
  try {
    const totalCount = await getCommentsTotalCount({ filter: request.filter });

    response.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }

  try {
    const comments = await getComments({ filter: request.filter, pagination: request.pagination });

    response.send(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取评论回复
 */
export const indexReplies = async (request: Request, response: Response, next: NextFunction) => {
  const { commentId } = request.params;

  try {
    const replies = await getCommentReplies({ commentId: parseInt(commentId, 10) });

    response.send(replies);
  } catch (error) {
    next(error);
  }
};
