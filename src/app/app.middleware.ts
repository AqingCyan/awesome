import { Request, Response, NextFunction } from 'express';

/**
 * 输出请求地址
 */
export const requestUrl = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log('🚥 visit router is: ', request.url);
  next();
};

/**
 * 默认异常处理
 */
export const defaultErrorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error.message) {
    console.log('🚧', error.message);
  }

  let statusCode: number, message: string;

  // 分类处理异常
  switch (error.message) {
    case 'NAME_IS_REQUIRED':
      statusCode = 400;
      message = '请提供用户名';
      break;
    case 'PASSWORD_IS_REQUIRED':
      statusCode = 400;
      message = '请提供用户密码';
      break;
    case 'USER_ALREADY_EXIST':
      statusCode = 409;
      message = '用户名被占用了';
      break;
    case 'USER_DOSE_NOT_EXIST':
      statusCode = 400;
      message = '用户名不存在';
      break;
    case 'PASSWORD_DOES_NOT_MATCH':
      statusCode = 400;
      message = '密码不正确';
      break;
    default:
      statusCode = 500;
      message = '服务暂时出了一些问题～～ 🌴';
      break;
  }

  response.status(statusCode).send({ message });
};
