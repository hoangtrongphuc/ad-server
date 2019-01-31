const Joi = require('joi');
const Base = require('./base');

module.exports = Joi.object({
  name: Base.nameSchema,
  status: Base.statusSchema,
  desUrl: Base.desUrlSchema.required(),
  duration: Base.durationSchema.required(),
  trackingEvents: Base.trackingEventsSchema.required(),
  skipOffset: Base.skipOffsetSchema,
  videos: Base.videosSchema.required(),
  desc: Base.descSchema
})
