import path from 'path';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import { fileFilter } from '../file/file.middleware';

/**
 * 文件过滤器
 */
const avatarUploadFilter = fileFilter(['image/png', 'image/jpg', 'image/jpeg']);

/**
 * 创建一个 Multer
 */
const avatarUpload = multer({
  dest: 'uploads/avatar',
  fileFilter: avatarUploadFilter,
});

/**
 * 头像文件拦截器
 */
export const avatarInterceptor = avatarUpload.single('avatar');

/**
 * 处理头像尺寸
 */
export const avatarProcessor = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { file } = request;

  const filePath = path.join(file.destination, 'resized', file.filename);

  try {
    const image = await Jimp.read(file.path);

    image.cover(256, 256).quality(85).write(`${filePath}-large`);
    image.cover(128, 128).quality(85).write(`${filePath}-medium`);
    image.cover(64, 64).quality(85).write(`${filePath}-small`);
  } catch (error) {
    next(error);
  }

  next();
};
