import express from 'express';
import * as auditLogController from './audit-log.controller';
import { authGuard } from '../auth/auth.middlerware';
import { auditLogGuard } from './audit-log.middleware';

const router = express.Router();

/**
 * 创建审核日志
 */
router.post('/audit-logs', authGuard, auditLogGuard, auditLogController.store);

export default router;
