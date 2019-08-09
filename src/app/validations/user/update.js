import * as Yup from 'yup';

export default Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email('E-mail inválido'),
  old_password: Yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  password: Yup.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .when('old_password', (old_password, field) =>
      old_password ? field.required('Senha obrigatória') : field
    ),
  password_confirmation: Yup.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .when('password', (password, field) =>
      password
        ? field
            .required('Confirmação de senha obrigatória')
            .oneOf(
              [Yup.ref('password')],
              'Senha e confirmação de senha não são iguais'
            )
        : field
    ),
});
