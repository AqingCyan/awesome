import express from 'express';

/**
 * 测试用的接口
 */
const router = express.Router();

router.get('/', (req, res) => {
  res.send({ title: 'Hello World' });
});

router.post('/echo', (req, res) => {
  res.status(201).send(req.body);
});

export default router;
