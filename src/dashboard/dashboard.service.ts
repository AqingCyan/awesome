import { connection } from '../app/database/mysql';
import { AccessCountListItem, allowedAccessCounts } from './dashboard.provider';

/**
 * 访问次数列表
 */
interface GetAccessCountOptions {
  filter: {
    name: string;
    sql?: string;
    param?: string;
  };
}
export const getAccessCount = async (options: GetAccessCountOptions) => {
  const {
    filter: { sql: whereDateTimeRange },
  } = options;

  // 允许的动作
  const allowedActions = allowedAccessCounts
    .map((accessCount) => accessCount.action)
    .map((action) => `${action}`)
    .join(`','`);

  // 允许的动作条件
  const andWhereActionIn = `AND action IN ('${allowedActions}')`;

  const statement = `
    SELECT
      access_log.action,
      COUNT(access_log.id) AS value
    FROM
      access_log
    WHERE
      ${whereDateTimeRange} ${andWhereActionIn}
    GROUP BY
      access_log.action
  `;

  const [data] = await connection.promise().query(statement);

  const results = data as Array<AccessCountListItem>;

  return allowedAccessCounts.map((accessCount) => {
    const result = results.find((result) => result.action === accessCount.action);
    accessCount.value = result && result.value ? result.value : 0;
    return accessCount;
  });
};
