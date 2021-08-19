import express from 'express';
import * as searchController from './search.controller';

const router = express.Router();

/**
 * 搜索标签
 */
router.get('/search/tags', searchController.tags);

export default router;
