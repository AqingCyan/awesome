import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { createAvatar, findAvatarByUserId } from './avatar.service';

/**
 * 上传头像
 */
export const store = async (request: Request, response: Response, next: NextFunction) => {
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

/**
 * 头像查询服务
 */
export const serve = async (request: Request, response: Response, next: NextFunction) => {
  const { userId } = request.params;

  try {
    // 查找头像信息
    const avatar = await findAvatarByUserId(parseInt(userId, 10));

    if (!avatar) {
      throw new Error('FILE_NOT_FOUND');
    }

    const { size } = request.query;

    let filename = avatar.filename;
    let root = path.join('uploads', 'avatar');
    let resized = 'resized';

    if (size) {
      const imageSizes = ['large', 'medium', 'small'];

      if (!imageSizes.some((item) => item === size)) {
        throw new Error('FILE_NOT_FOUND');
      }

      const fileExist = fs.existsSync(path.join(root, resized, `${filename}-${size}`));

      if (!fileExist) {
        throw new Error('FILE_NOT_FOUND');
      }

      if (fileExist) {
        filename = `${filename}-${size}`;
        root = path.join(root, resized);
      }
    }

    response.status(201).sendFile(filename, {
      root,
      headers: {
        'Content-Type': avatar.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};
