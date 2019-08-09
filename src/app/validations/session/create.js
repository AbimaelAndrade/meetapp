import * as Yup from 'yup';

export default Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .required('Senha obrigatória'),
});
