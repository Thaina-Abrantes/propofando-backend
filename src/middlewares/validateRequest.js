const validateBody = (schema) => async (request, response, next) => {
    try {
      await schema.validate(request.body);
      next();
    } catch (error) {
      return response.status(400).json(error.message);
    }
  };
  
  const validateQuery = (schema) => async (request, response, next) => {
    try {
      await schema.validate(request.query);
      next();
    } catch (error) {
      return response.status(400).json(error.message);
    }
  };
  
  const validateParams = (schema) => async (request, response, next) => {
    try {
      await schema.validate(request.params);
      next();
    } catch (error) {
      return response.status(400).json(error.message);
    }
  };
  
  module.exports = {
    validateBody,
    validateQuery,
    validateParams,
  };
  