import express from 'express';
import * as fileController from './file.controller';
import { authGuard } from '../auth/auth.middlerware';
import { fileInterceptor, fileProcessor } from './file.middleware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 上传文件
 */
router.post(
  '/files',
  authGuard,
  fileInterceptor,
  fileProcessor,
  accessLog({ action: 'createFile', resourceType: 'file' }),
  fileController.store,
);

/**
 * 文件查询服务
 */
router.get('/files/:fileId/serve', fileController.serve);

/**
 * 文件信息
 */
router.get(
  '/files/:fileId/metadata',
  accessLog({ action: 'getFileMetadata', resourceType: 'file', resourceParamName: 'fileId' }),
  fileController.matedata,
);

export default router;
