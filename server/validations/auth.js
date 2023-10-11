const joi = require("joi");

const createCakeValidation = (data) => {
  const rule = joi.object({
    name: joi.string().min(3).required(),
    group_id: joi.string().min(4).required(),
    type_id: joi.string().min(4).required(),
    price: joi.number().min(0).required(),
    description: joi.string().min(3),
    image: joi.string().min(3),
    unit: joi.string().min(3),
  });

  return rule.validate(data);
};

const createUserValidation = (data) => {
  const rule = joi.object({
    name: joi.string().min(3).required(),
    password: joi.string().min(3).max(30).required(),
    username: joi.string().min(3).max(30).required(),
  });

  return rule.validate(data);
};

module.exports = {
  createCakeValidation,
  createUserValidation,
};
