const Joi = require('joi');

//mediaType: Joi.number().valid([1, 2]), // Linear vs Non-linear
exports.trackingEventsSchema = Joi.array().items(Joi.string().valid([
  'creativeView', 'start', 'firstQuartile', 'midpoint',
  'thirdQuartile', 'complete', 'mute', 'unmute',
  'pause', 'rewind', 'resume', 'skip']))
exports.videosSchema = Joi.array().items(Joi.object({
  delivery: Joi.string().valid(['progressive', 'streaming']),
  width: Joi.number(),
  url: Joi.string(),
  height: Joi.number(),
  type: Joi.string(),
  filesize: Joi.number(),
  bitrate: Joi.number(),
  uploadedAt: Joi.date()
}))
exports.desUrlSchema = Joi.string()
exports.durationSchema = Joi.number().integer().positive()
exports.skipOffsetSchema = Joi.number().integer().positive()
exports.nameSchema = Joi.string().min(3).max(255)
exports.typeSchema = Joi.number().integer().min(1).max(12)
exports.statusSchema = Joi.number().integer().default(0)
exports.addedBySchema = Joi.string()
exports.descSchema = Joi.string().max(500)