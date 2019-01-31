const Joi = require('joi');

exports.idSchema = Joi.string()
exports.zoneIdSchema = Joi.string()
exports.nameSchema = Joi.string().alphanum().min(3).max(255)
exports.typeSchema = Joi.number().integer().min(1).max(12)
exports.statusSchema = Joi.number().integer().default(0)
exports.prioritySchema = Joi.number().integer().min(2).max(4).default(2)
exports.addedBySchema = Joi.string()
exports.descSchema = Joi.string().max(500)
exports.startDateSchema = Joi.number()
exports.endDateSchema = Joi.number()
exports.weightSchema = Joi.number()
exports.locationSchema = Joi.object({
  accept: Joi.array(),
  deny: Joi.array()
})
exports.browserSchema = Joi.array().items(Joi.number().valid([1, 2, 3])) // Chrome, Firefox, Egde
exports.osSchema = Joi.array().items(Joi.number().valid([1, 2, 3, 4, 5]))
exports.deviceTypeSchema = Joi.array().items(Joi.number().valid([1, 2, 3]))
exports.keyValueSchema = Joi.object()
exports.domainSchema = Joi.array()
exports.ipSchema = Joi.array()
exports.urlSchema = Joi.object()

exports.throttlingSchema = Joi.object({
  impressions: Joi.object({
    time: Joi.number(),
    count: Joi.number()
  }),
  clicks: Joi.object({
    time: Joi.number(),
    count: Joi.number()
  })
}).default({})
exports.freqCapSchema = Joi.object({
  impressions: Joi.object({
    time: Joi.number(),
    count: Joi.number(),
    unit: Joi.string().valid(['hour', 'minute', 'day'])
  })
}).default({})

exports.dayPartingSchema = Joi.object({
}).default({})

exports.statsSchema = Joi.object({
  impressions: Joi.number(),
  clicks: Joi.number()
}).default({})

