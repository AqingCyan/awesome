import { connection } from '../app/database/mysql';
import { CommentModel } from './comment.model';
import { sqlFragment } from './comment.provider';
import { GetPostsOptionsFilter, GetPostsOptionsPagination } from '../post/post.service';

/**
 * 创建评论
 */
export const createComment = async (comment: CommentModel) => {
  const statement = `INSERT INTO comment SET ?`;

  const [data] = await connection.promise().query(statement, comment);

  return data as any;
};

/**
 * 检查评论是否为回复评论
 */
export const isReplayComment = async (commentId: number) => {
  const statement = `SELECT parentId FROM comment WHERE id = ?`;

  const [data] = await connection.promise().query(statement, commentId);

  return !!data[0].parentId;
};

/**
 * 修改评论
 */
export const updateComment = async (comment: CommentModel) => {
  const { id, content } = comment;

  const statement = `UPDATE comment SET content = ? WHERE id = ?`;

  const [data] = await connection.promise().query(statement, [content, id]);

  return data;
};

/**
 * 删除评论
 */
export const deleteComment = async (commentId: number) => {
  const statement = `DELETE FROM comment WHERE id = ?`;

  const [data] = await connection.promise().query(statement, commentId);

  return data;
};

/**
 * 获取评论列表
 */
interface GetCommentsOptions {
  filter?: GetPostsOptionsFilter;
  pagination?: GetPostsOptionsPagination;
}
export const getComments = async (options: GetCommentsOptions) => {
  const {
    filter,
    pagination: { limit, offset },
  } = options;

  let params: Array<any> = [limit, offset];

  if (filter.param) {
    params = [filter.param, ...params];
  }

  const statement = `
    SELECT
      comment.id,
      comment.content,
      ${sqlFragment.user},
      ${sqlFragment.post}
      ${filter.name === 'userReplied' ? `, ${sqlFragment.repliedComment}` : ''}
      ${filter.name !== 'userReplied' ? `, ${sqlFragment.totalReplies}` : ''}
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE
      ${filter.sql}
    GROUP BY
      comment.id
    ORDER BY
      comment.id DESC
    LIMIT ?
    OFFSET ?
  `;

  const [data] = await connection.promise().query(statement, params);

  return data;
};

/**
 * 统计评论数量
 */
export const getCommentsTotalCount = async (options: GetCommentsOptions) => {
  const { filter } = options;

  let params: Array<any> = [];

  if (filter.param) {
    params = [filter.param, ...params];
  }

  const statement = `
    SELECT
      COUNT(
        DISTINCT comment.id
      ) as total
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE
      ${filter.sql}
  `;

  const [data] = await connection.promise().query(statement, params);

  return data[0].total;
};

/**
 * 评论回复列表
 */
interface GetCommentRepliesOptions {
  commentId: number;
}
export const getCommentReplies = async (options: GetCommentRepliesOptions) => {
  const { commentId } = options;

  const statement = `
    SELECT
      comment.id,
      comment.content,
      ${sqlFragment.user}
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    WHERE
      comment.parentId = ?
    GROUP BY
      comment.id
  `;

  const [data] = await connection.promise().query(statement, commentId);

  return data;
};

/**
 * 按ID调取评论或回复
 */
interface GetCommentsByIdOptions {
  resourceType?: string;
}
export const getCommentById = async (commentId: number, options: GetCommentsByIdOptions = {}) => {
  const { resourceType = 'comment' } = options;

  // SQL 参数
  const params: Array<any> = [commentId];

  const statement = `
    SELECT
      comment.id,
      comment.content,
      ${sqlFragment.user},
      ${sqlFragment.post}
      ${resourceType === 'replay' ? `, ${sqlFragment.repliedComment}` : ''}
      ${resourceType === 'comment' ? `, ${sqlFragment.totalReplies}` : ''}
    FROM
      comment
    ${sqlFragment.leftJoinUser}
    ${sqlFragment.leftJoinPost}
    WHERE
      comment.id = ?
  `;

  const [data] = await connection.promise().query(statement, params);

  return data[0] as any;
};
