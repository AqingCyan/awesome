import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import { connection } from '../app/database/mysql';
import { FileModel } from './file.model';

/**
 * 存储文件信息
 */
export const createFile = async (file: FileModel) => {
  const statement = `INSERT INTO file SET ?`;

  const [data] = await connection.promise().query(statement, file);

  return data;
};

/**
 * 按 ID 查找文件
 */
export const findFileById = async (fileId: number) => {
  const statement = `SELECT * FROM file WHERE id = ?`;

  const [data] = await connection.promise().query(statement, fileId);

  return data[0];
};

/**
 * 处理图像尺寸
 */
export const imageResizer = (image: Jimp, file: Express.Multer.File) => {
  const { imageSize } = image['_exif'];

  const filePath = path.join(file.destination, 'resized', file.filename);

  // 大尺寸
  if (imageSize.width > 1280) {
    image.resize(1280, Jimp.AUTO).quality(85).write(`${filePath}-large`);
  }

  // 中尺寸
  if (imageSize.width > 640) {
    image.resize(640, Jimp.AUTO).quality(85).write(`${filePath}-medium`);
  }

  // 缩略图
  if (imageSize.width > 320) {
    image.resize(320, Jimp.AUTO).quality(85).write(`${filePath}-thumbnail`);
  }
};

/**
 * 找出文件相关内容
 */
export const getPostFiles = async (postId: number) => {
  const statement = `
    SELECT
      file.filename
    FROM
      file
    WHERE
      postId = ?
  `;

  const [data] = await connection.promise().query(statement, postId);

  return data as any;
};

/**
 * 删除内容文件
 */
export const deletePostFiles = async (files: Array<FileModel>) => {
  const uploads = 'uploads';
  const resized = [uploads, 'resized'];

  files.map((file) => {
    const filesToDelete = [
      [uploads, file.filename],
      [...resized, `${file.filename}-large`],
      [...resized, `${file.filename}-medium`],
      [...resized, `${file.filename}-thumbnail`],
    ];

    filesToDelete.map((item) => {
      const filePath = path.join(...item);

      fs.stat(filePath, (err, stats) => {
        if (stats) {
          fs.unlink(filePath, (error) => {
            if (error) throw error;
          });
        }
      });
    });
  });
};
