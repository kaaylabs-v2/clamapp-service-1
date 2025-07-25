const { validationResult } = require('express-validator');
const { sendBadRequest } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return sendBadRequest(res, 'Validation failed', formattedErrors);
  }
  
  next();
};

module.exports = { validate };