import { connection } from '../app/database/mysql';

/**
 * 搜索标签
 */
interface SearchTagsOptions {
  name?: string;
}
export const searchTags = async (options: SearchTagsOptions) => {
  const { name } = options;

  const params: Array<any> = [`%${name}%`];

  const statement = `
    SELECT
      tag.id,
      tag.name,
      (
        SELECT COUNT(post_tag.tagId)
        FROM post_tag
        WHERE tag.id = post_tag.tagId
      ) as totalPosts
    FROM
      tag
    WHERE
      tag.name LIKE ?
    ORDER BY
      totalPosts
    LIMIT
      10     
  `;

  const [data] = await connection.promise().query(statement, params);

  return data as any;
};

/**
 * 搜索用户
 */
interface SearchUserOptions {
  name?: string;
}
export const searchUsers = async (options: SearchUserOptions) => {
  const { name } = options;

  const params: Array<any> = [`%${name}%`];

  const statement = `
    SELECT
      user.id,
      user.name,
      IF(
        COUNT(avatar.id), 1, NULL
      ) AS avatar,
      (
        SELECT COUNT(post.id)
        FROM post
        WHERE user.id = post.userId
      ) as totalPosts
    FROM
      user
    LEFT JOIN avatar
      ON avatar.userId = user.id
    WHERE
      user.name LIKE ?
    GROUP BY
      user.id
    LIMIT
      10
  `;

  const [data] = await connection.promise().query(statement, params);

  return data as any;
};
