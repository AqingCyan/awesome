import express from 'express';
import cors from 'cors';
import { defaultErrorHandler } from './app.middleware';
import appRouter from './app.router';
import postRouter from '../post/post.router';
import userRouter from '../user/user.router';
import authRouter from '../auth/auth.router';
import fileRouter from '../file/file.router';
import tagRouter from '../tag/tag.router';
import commentRouter from '../comment/comment.router';
import avatarRouter from '../avatar/avatar.router';
import likeRouter from '../like/like.router';
import searchRouter from '../search/search.router';
import { ALLOW_ORIGIN } from './app.config';
import { currentUser } from '../auth/auth.middlerware';

/**
 * 创建应用
 */
const app = express();

/**
 * 跨域资源共享
 */
app.use(
  cors({
    origin: ALLOW_ORIGIN,
    exposedHeaders: 'X-Total-Count',
  }),
);

/**
 * 全局处理 JSON
 */
app.use(express.json());

/**
 * 识别当前用户
 */
app.use(currentUser);

/**
 * 路由
 */
app.use(
  appRouter,
  postRouter,
  userRouter,
  authRouter,
  fileRouter,
  tagRouter,
  commentRouter,
  avatarRouter,
  likeRouter,
  searchRouter,
);

/**
 * 默认异常处理器
 */
app.use(defaultErrorHandler);

/**
 * 导出应用
 */
export default app;
