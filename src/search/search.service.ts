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
