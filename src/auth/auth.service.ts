import * as jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../app/app.config';

interface SignTokenOptions {
  payload: any;
}

/**
 * 签发令牌
 * @param options
 */
export const signToken = (options: SignTokenOptions) => {
  const { payload } = options;

  return jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });
};
