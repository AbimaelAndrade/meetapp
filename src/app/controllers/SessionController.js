import jwt from 'jsonwebtoken';
import User from '../models/User';

import authConfig from '../../config/auth';

import normalizeErrorValidation from '../utils/normalizeErrorValidation';

import validateCreateSession from '../validations/session/create';

class SessionController {
  async store(req, res) {
    try {
      await validateCreateSession.validate(req.body, { abortEarly: false });

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      // Verificar se o usuário existe
      if (!user) {
        return res.status(401).json({ error: 'Usuário não existe' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      const { id, name } = user;

      return res.json({
        user: {
          id,
          name,
          email,
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      // Erro de validação
      if (err.name === 'ValidationError') {
        return res.status(400).json(normalizeErrorValidation(err));
      }

      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

export default new SessionController();
