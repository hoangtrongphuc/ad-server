const Joi = require('joi');
const Base = require('./base');

module.exports = Joi.object({
  name: Base.nameSchema,
  type: Base.typeSchema,
  status: Base.statusSchema,
  creatives: Joi.array().items(Joi.string()).default([]),
  desc: Base.descSchema
})
