const Joi = require('joi');

const Model = () => {
  const idSchema = Joi.string()
  const titleSchema = Joi.string().alphanum().min(3).max(255)
  const mediaTypeSchema = Joi.number().integer().min(1).max(3) // Linear vs Non-linear
  const desUrlSchema = Joi.string()
  const statusSchema = Joi.number().integer().default(0)
  const vastVersionSchema = Joi.number().integer().min(2).max(4).default(2)
  const addedBySchema = Joi.string()
  const descSchema = Joi.string()
  const weightSchema = Joi.number()
  const trackingEventSchema = Joi.array()
  const statsSchema = Joi.object().key({
    impressions: Joi.number(),
    clicks: Joi.number()
  })
  const linearVideoSchema = Joi.object().key({
    videoFile: Joi.object().key({
      dimension: Joi.string(),
      type: Joi.string(),
      filesize: Joi.number(),
      duration: Joi.number(),
      bitrate: Joi.number(),
      framerate: Joi.number(),
      uploadedAt: Joi.date()
    }),
    skippable: Joi.number().valid([0, 1])
  })
  const objSchema = {
    create: Joi.object().keys({
      name: nameSchema.required(),
      type: typeSchema.required(),
      vastVersion: vastVersionSchema,
      status: statusSchema,
      desc: descSchema,
    }),
    edit: Joi.object().keys({
      name: nameSchema,
      status: statusSchema,
      vastVersion: vastVersionSchema,
      freqCap: freqCapSchema,
      desc: descSchema,
    })
  }
  const validateProp = prop => {
    try {
      const result = Joi.validate(prop, eval(`${prop}Schema`))
      if (result.error === null) return true;
      else return false;
    } catch (e) {
      console.error(e.message)
      return false
    }
  }
  const validateObj = (data, action) => {
    if (objSchema[action]) {
      const result = Joi.validate(data, objSchema[action])
      if (result.error === null) return true;
      else return false;
    }
    return false
  };
  return {
    validateObj,
    validateProp
  }
}

module.exports = Model()