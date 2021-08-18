import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../app';
import { connection } from '../app/database/mysql';
import { signToken } from '../auth/auth.service';
import { deleteUser, getUserById } from './user.service';
import { UserModel } from './user.model';

/**
 * 准备测试
 */
const testUser: UserModel = {
  name: 'awesome-server-user-name',
  password: 'cyanthing',
};

const testUserUpdated: UserModel = {
  name: 'awesome-server-user-new-name',
  password: 'cyanaqing',
};

let testUserCreated: UserModel;

/**
 * 所有测试结束后
 */
afterAll(async () => {
  if (testUserCreated) {
    await deleteUser(testUserCreated.id);
  }

  connection.end();
});

describe('测试用户模块接口', () => {
  /**
   * 创建用户
   */
  describe('测试创建用户接口', () => {
    test('创建用户时必须提供用户名', async () => {
      const response = await request(app).post('/users').send({ password: testUser.password });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: '请提供用户名' });
    });

    test('创建用户时必须提供密码', async () => {
      const response = await request(app).post('/users').send({ name: testUser.name });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: '请提供用户密码' });
    });

    test('成功创建用户以后，响应状态码应该是 201', async () => {
      const response = await request(app).post('/users').send(testUser);

      testUserCreated = await getUserById(response.body.insertId, {
        password: true,
      });

      expect(response.status).toBe(201);
    });
  });

  /**
   * 用户账户
   */
  describe('测试用户账户接口', () => {
    test('响应里应该包含指定的属性', async () => {
      const response = await request(app).get(`/users/${testUserCreated.id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testUser.name);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        avatar: null,
      });
    });

    test('当用户不存在时，响应的状态码 404', async () => {
      const response = await request(app).get('/users/-1');

      expect(response.status).toBe(404);
    });
  });

  /**
   * 更新用户
   */
  describe('测试更新用户接口', () => {
    test('更新用户时需要验证用户身份', async () => {
      const response = await request(app).patch('/users');

      expect(response.status).toBe(401);
    });

    test('更新用户数据', async () => {
      const token = signToken({
        payload: { id: testUserCreated.id, name: testUserCreated.name },
      });

      const response = await request(app)
        .patch('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          validate: {
            password: testUser.password,
          },
          update: {
            name: testUserUpdated.name,
            password: testUserUpdated.password,
          },
        });

      const user = await getUserById(testUserCreated.id, { password: true });

      const matched = await bcrypt.compare(testUserUpdated.password, user.password);

      expect(response.status).toBe(200);
      expect(matched).toBeTruthy();
      expect(user.name).toBe(testUserUpdated.name);
    });
  });
});
