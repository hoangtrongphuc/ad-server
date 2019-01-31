const Joi = require('joi');
const ObjectID = require('mongodb').ObjectID
const createZone = Joi.object({
  _id: Joi.object().default(new ObjectID()),
  name: Joi.string().alphanum().min(3).max(255),
  type: Joi.number().integer().min(1).max(12),
  status: Joi.number().integer().default(0),
  campaigns: Joi.array().default([]),
  desc: Joi.string().max(500)
})

module.exports = createZone