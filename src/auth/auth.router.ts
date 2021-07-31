import express from 'express';

import * as authController from './auth.controller';
import { validateLoginData } from './auth.middlerware';

const router = express.Router();

/**
 * 用户登录
 */
router.post('/login', validateLoginData, authController.login);

export default router;
