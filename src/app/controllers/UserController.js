import * as Yup from 'yup';
import User from '../models/User';

import normalizeErrorValidation from '../utils/normalizeErrorValidation';

class UserController {
  async store(req, res) {
    try {
      // Validação
      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        email: Yup.string()
          .email('E-mail inválido')
          .required('E-mail obrigatório'),
        password: Yup.string()
          .min(6, 'A senha deve ter no mínimo 6 caracteres')
          .required('Senha obrigatória'),
      });

      await schema.validate(req.body, { abortEarly: false });

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

      return res.status(500).json({ error: 'Server error.' });
    }
  }
}

export default new UserController();
