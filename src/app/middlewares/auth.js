import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const { autorization } = req.headers;

  if (!autorization) {
    return res.status(401).json({ error: 'Token não encontrado' });
  }

  const [, token] = autorization.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
