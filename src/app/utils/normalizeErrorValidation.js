export default error => {
  // Erro de validação
  const validateErrors = [];

  error.inner.map(e =>
    validateErrors.push({
      path: e.path,
      errors: e.errors,
    })
  );

  return {
    error: {
      name: error.name,
      validations: validateErrors,
    },
  };
};
