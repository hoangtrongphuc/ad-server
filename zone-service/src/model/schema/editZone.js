const Joi = require('joi');
const editZone = Joi.object({
  name: Joi.string().alphanum().min(3).max(255),
  type: Joi.number().integer().min(1).max(12),
  status: Joi.number().integer().default(0),
  desc: Joi.string().max(500),
  freqCap: Joi.object()
})

module.exports = editZone