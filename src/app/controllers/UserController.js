import User from '../models/User';

import normalizeErrorValidation from '../utils/normalizeErrorValidation';

import validateCreateUser from '../validations/user/create';
import validateUpdateUser from '../validations/user/update';

class UserController {
  async store(req, res) {
    try {
      // Validação
      await validateCreateUser.validate(req.body, { abortEarly: false });

      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res
          .status(400)
          .json({ error: 'Já existe um usuário cadastrado com esse e-mail' });
      }

      const { id, name, email } = await User.create(req.body);

      return res.json({
        id,
        name,
        email,
      });
    } catch (err) {
      // Erro de validação
      if (err.name === 'ValidationError') {
        return res.status(400).json(normalizeErrorValidation(err));
      }

      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async update(req, res) {
    try {
      // Validação
      await validateUpdateUser.validate(req.body, { abortEarly: false });

      const { email, old_password } = req.body;
      const user = await User.findByPk(req.userId);

      if (email !== user.email) {
        const emailExists = User.findOne({ where: { email } });

        if (emailExists) {
          return res
            .status(400)
            .json({ error: 'Já existe um usuário cadastrado com esse e-mail' });
        }
      }

      if (old_password && !(await user.checkPassword(old_password))) {
        return res.status(401).json({ error: 'Senha antiga inválida' });
      }

      const { id, name } = await user.update(req.body);

      return res.json({
        id,
        name,
        email,
      });
    } catch (err) {
      // Erro de validação
      if (err.name === 'ValidationError') {
        return res.status(400).json(normalizeErrorValidation(err));
      }

      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId);
    try {
      await user.destroy();

      return res.status(200).json();
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao excluir o usuário' });
    }
  }
}

export default new UserController();
