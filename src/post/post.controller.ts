import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import {
  createPost,
  createPostTag,
  deletePost,
  deletePostTag,
  getPostById,
  getPosts,
  getPostsTotalCount,
  postHasTag,
  PostStatus,
  updatePost,
} from './post.service';
import { createTag, getTagByName } from '../tag/tag.service';
import { TagModel } from '../tag/tag.model';
import { deletePostFiles, getPostFiles } from '../file/file.service';
import { PostModel } from './post.model';
import { getAuditLogByResource } from '../audit-log/audit-log.service';
import { AuditLogStatus } from '../audit-log/audit-log.model';

/**
 * 内容列表
 */
export const index = async (request: Request, response: Response, next: NextFunction) => {
  // 解构查询符
  const { status = '', auditStatus } = request.query;

  try {
    // 统计一下符合条件的内容数量
    const totalCount = await getPostsTotalCount({
      filter: request.filter,
      status: status as string,
      auditStatus: auditStatus as string,
    });

    response.header('X-Total-Count', totalCount);
  } catch (error) {
    next(error);
  }

  try {
    const posts = await getPosts({
      sort: request.sort,
      filter: request.filter,
      pagination: request.pagination,
      currentUser: request.user,
      status: status as string,
      auditStatus: auditStatus as string,
    });
    response.send(posts);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建内容
 */
export const store = async (request: Request, response: Response, next: NextFunction) => {
  const { title, content, status = PostStatus.draft } = request.body;
  const { id: userId } = request.user;

  const post: PostModel = { title, content, userId, status };

  try {
    const data = await createPost(post);
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新内容
 */
export const update = async (request: Request, response: Response, next: NextFunction) => {
  const { postId } = request.params;
  const post = _.pick(request.body, ['title', 'content', 'status']);

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
export const destroy = async (request: Request, response: Response, next: NextFunction) => {
  const { postId } = request.params;

  try {
    const files = await getPostFiles(parseInt(postId, 10));

    if (files.length) {
      await deletePostFiles(files);
    }

    const data = await deletePost(parseInt(postId));
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 添加内容标签
 */
export const storePostTag = async (request: Request, response: Response, next: NextFunction) => {
  const { postId } = request.params;
  const { name } = request.body;

  let tag: TagModel;

  // 查找标签
  try {
    tag = await getTagByName(name);
  } catch (error) {
    return next(error);
  }

  // 标签存在，验证内容标签
  if (tag) {
    try {
      const postTag = await postHasTag(parseInt(postId, 10), tag.id);
      if (postTag) return next(new Error('POST_ALREADY_HAS_THIS_TAG'));
    } catch (error) {
      return next(error);
    }
  }

  // 没找到标签，先创建
  if (!tag) {
    try {
      const data = await createTag({ name });
      tag = { id: data.insertId };
    } catch (error) {
      return next(error);
    }
  }

  try {
    await createPostTag(parseInt(postId, 10), tag.id);
    response.sendStatus(201);
  } catch (error) {
    return next(error);
  }
};

/**
 * 移除内容标签
 */
export const destroyPostTag = async (request: Request, response: Response, next: NextFunction) => {
  const { postId } = request.params;
  const { tagId } = request.body;

  try {
    await deletePostTag(parseInt(postId, 10), tagId);
    response.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

/**
 * 查询单个内容
 */
export const show = async (request: Request, response: Response, next: NextFunction) => {
  const { postId } = request.params;
  const { user: currentUser } = request;

  try {
    const post = await getPostById(parseInt(postId, 10), { currentUser: request.user });

    // 审核日志
    const [auditLog] = await getAuditLogByResource({
      resourceId: parseInt(postId, 10),
      resourceType: 'post',
    });

    // 检查权限，获取发布内容时，如果内容未发布，用户也不是管理员，也不是内容所有者，那就不允许访问
    const ownPost = post.user.id === currentUser.id;
    const isAdmin = currentUser.id === 1;
    const isPublished = post.status === PostStatus.published;
    const isApproved = auditLog && auditLog.status === AuditLogStatus.approved;
    const canAccess = isAdmin || ownPost || (isPublished && isApproved);

    if (!canAccess) {
      throw new Error('FORBIDDEN');
    }

    response.send(post);
  } catch (error) {
    next(error);
  }
};
