import express from 'express';
import * as dashboardController from './dashboard.controller';
import { accessCountsFilter } from './dashboard.middleware';

const router = express.Router();

/**
 * 访问次数列表
 */
router.get('/dashboard/access-counts', accessCountsFilter, dashboardController.accessCountIndex);

export default router;
