const Joi = require('joi');
const Base = require('./base');
const ObjectID = require('mongodb').ObjectID;

module.exports = Joi.object({
  _id: Joi.object().default(new ObjectID()),
  name: Base.nameSchema.required(),
  status: Base.statusSchema,
  desUrl: Base.desUrlSchema.required(),
  duration: Base.durationSchema.required(),
  trackingEvents: Base.trackingEventsSchema.required(),
  skipOffset: Base.skipOffsetSchema,
  videos: Base.videosSchema.required(),
  desc: Base.descSchema
})
