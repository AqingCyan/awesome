import request from 'supertest';
import app from '../app';
import { connection } from './database/mysql';
import { greet } from './playground/demo';

/**
 * 单元测试demo
 */
describe('演示单元测试', () => {
  test('测试 greet 函数', () => {
    const greeting = greet('Cyan');

    expect(greeting).toBe('你好，Cyan');
  });
});

/**
 * 测试接口
 */
describe('演示接口测试', () => {
  // 断开数据服务连接
  afterAll(async () => {
    connection.end();
  });

  test('测试 GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ title: 'Hello World' });
  });

  test('测试 POST /', async () => {
    const response = await request(app)
      .post('/echo')
      .send({ message: 'Hello～' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Hello～' });
  });
});
