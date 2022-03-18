const validateAccessPermission = (userTypesToBeValidated) => async (request, response, next) => {
  const { userType } = request.user;

  try {
    if (userTypesToBeValidated.includes(userType)) {
      next();
    } else {
      return response.status(403).json({ message: 'Você não tem permissão para prosseguir.' });
    }
  } catch (error) {
    return response.status(400).json({ message: 'Erro de acesso' });
  }
};

module.exports = validateAccessPermission;
