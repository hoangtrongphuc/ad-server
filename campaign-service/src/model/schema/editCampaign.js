const Joi = require('joi');
const Base = require('./base');

module.exports = Joi.object({
  name: Base.nameSchema,
  type: Base.typeSchema,
  status: Base.statusSchema,
  desc: Base.descSchema,
  freqCap: Base.freqCapSchema,
  dayParting: Base.dayPartingSchema,
  priority: Base.prioritySchema,
  startDate: Base.startDateSchema,
  endDate: Base.endDateSchema,
  target: Joi.object({
    location: Base.locationSchema,
    browser: Base.browserSchema,
    os: Base.osSchema,
    deviceType: Base.deviceTypeSchema,
    keyValue: Base.keyValueSchema,
    domain: Base.domainSchema,
    ip: Base.ipSchema,
    url: Base.urlSchema,
    dayParting: Base.dayPartingSchema
  }),
  throttling: Base.throttlingSchema
})
