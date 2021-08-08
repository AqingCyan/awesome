import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { createAvatar } from './avatar.service';

/**
 * 上传头像
 */
export const store = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { id: userId } = request.user;

  const fileInfo = _.pick(request.file, ['mimetype', 'filename', 'size']);

  const avatar = { ...fileInfo, userId };

  try {
    const data = await createAvatar(avatar);
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};
