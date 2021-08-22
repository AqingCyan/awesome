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

/**
 * 按动作分时段访问次数
 */
interface GetAccessCountByActionResult {
  action: string;
  datetime: string;
  value: number;
}
interface AccessCount {
  title: string;
  action: string;
  dataset: [Array<string>, Array<number>];
}
interface GetAccessCountByActionOptions {
  action: string;
  filter: {
    name: string;
    sql?: string;
    param?: string;
  };
}
export const getAccessCountByAction = async (options: GetAccessCountByActionOptions) => {
  const {
    filter: { sql: whereDateTimeRange, param: dateTimeFormat },
    action,
  } = options;

  const andWhereAction = 'AND action = ?';

  const params = [action];

  const statement = `
    SELECT
      access_log.action,
      DATE_FORMAT(access_log.created, '${dateTimeFormat}') AS datetime,
      COUNT(access_log.id) AS value
    FROM
      access_log
    WHERE
      ${whereDateTimeRange} ${andWhereAction}
    GROUP BY
      access_log.action,
      DATE_FORMAT(access_log.created, '${dateTimeFormat}')
    ORDER BY
      DATE_FORMAT(access_log.created, '${dateTimeFormat}')
  `;

  console.log(statement);

  const [data] = await connection.promise().query(statement, params);
  const results = data as Array<GetAccessCountByActionResult>;

  const dataset = results.reduce(
    (accumulator, result) => {
      const [dateTimeArray, valueArray] = accumulator;
      dateTimeArray.push(result.datetime);
      valueArray.push(result.value);
      return accumulator;
    },
    [[], []],
  );

  // 动作标题
  const title = allowedAccessCounts.find((accessCount) => accessCount.action === action).title;

  return { title, action, dataset } as AccessCount;
};
