import { connection } from '../app/database/mysql';
import { CommentModel } from './comment.model';

/**
 * 创建评论
 */
export const createComment = async (comment: CommentModel) => {
  const statement = `INSERT INTO comment SET ?`;

  const [data] = await connection.promise().query(statement, comment);

  return data;
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
