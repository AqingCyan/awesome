import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { createFile, fileAccessControl, findFileById } from './file.service';

/**
 * 上传文件
 */
export const store = async (request: Request, response: Response, next: NextFunction) => {
  const { id: userId } = request.user;
  const { post: postId } = request.query;

  const fileInfo = _.pick(request.file, ['originalname', 'mimetype', 'filename', 'size']);

  try {
    const data = await createFile({
      ...fileInfo,
      userId,
      postId: parseInt(postId as string, 10),
      ...request.fileMetaData,
    });

    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 文件查询服务
 */
export const serve = async (request: Request, response: Response, next: NextFunction) => {
  const { fileId } = request.params;

  // 当前用户
  const { user: currentUser } = request;

  try {
    // 查找文件信息
    const file = await findFileById(parseInt(fileId, 10));

    // 检查权限
    await fileAccessControl({ file, currentUser });

    // 要提供的图像尺寸
    const { size } = await request.query;

    // 文件名与目录
    let filename = file.filename;
    let root = 'uploads';
    let resized = 'resized';

    if (size) {
      // 提供可用尺寸类型
      const imageSizes = ['large', 'medium', 'thumbnail'];

      // 检查文件尺寸是否可用
      if (!imageSizes.some((item) => item === size)) {
        throw new Error('FILE_NOT_FOUND');
      }

      // 检查文件是否存在
      const fileExist = fs.existsSync(path.join(root, resized, `${filename}-${size}`));

      if (fileExist) {
        filename = `${filename}-${size}`;
        root = path.join(root, resized);
      }
    }

    response.sendFile(filename, {
      root,
      headers: {
        'Content-Type': file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 文件信息
 */
export const matedata = async (request: Request, response: Response, next: NextFunction) => {
  const { fileId } = request.params;

  // 当前用户
  const { user: currentUser } = request;

  try {
    // 查找文件信息
    const file = await findFileById(parseInt(fileId, 10));

    // 检查权限
    await fileAccessControl({ file, currentUser });

    const data = _.pick(file, ['id', 'size', 'width', 'height', 'metadata']);

    response.send(data);
  } catch (error) {
    next(error);
  }
};
