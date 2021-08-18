import http from 'http';
import { Server } from 'socket.io';
import app from './index';
import { ALLOW_ORIGIN } from './app.config';

/**
 * HTTP 服务器
 */
const httpServer = http.createServer(app);

/**
 * IO 服务器
 */
export const socketIoServer = new Server(httpServer, {
  cors: {
    origin: ALLOW_ORIGIN,
    allowedHeaders: ['X-Total-Count'],
  },
});

export default httpServer;
