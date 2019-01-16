const Joi = require('joi');

const Model = () => {
    const idSchema = Joi.string()
    const zoneIdSchema = Joi.string()
    const nameSchema = Joi.string().alphanum().min(3).max(255)
    const typeSchema = Joi.number().integer().min(1).max(12)
    const statusSchema = Joi.number().integer().default(0)
    const prioritySchema = Joi.number().integer().min(2).max(4).default(2)
    const freqCapSchema = Joi.object()
    const addedBySchema = Joi.string()
    const descSchema = Joi.string()
    const startDateSchema = Joi.number()
    const weightSchema = Joi.number()
    const expireSchema = Joi.object()
    const throttlingSchema = Joi.object()
    const pricingModelSchema = Joi.object()
    const locationSchema = Joi.array()
    const browserSchema = Joi.array()
    const osSchema = Joi.array()
    const deviceSchema = Joi.array()
    const keyValueSchema = Joi.object()
    const keywordSchema = Joi.array()
    const domainSchema = Joi.array()
    const ipSchema = Joi.array()
    const langSchema = Joi.array()
    const urlSchema = Joi.object()
    const gpsSchema = Joi.object()
    const dayPartingSchema = Joi.object()

    const statsSchema = Joi.object().default({})
    const targetSchema = Joi.object().keys({
        location: locationSchema,
        browser: browserSchema,
        os: osSchema,
        device: deviceSchema,
        keyValue: keyValueSchema,
        keyword: keywordSchema,
        domain: domainSchema,
        ip: ipSchema,
        lang: langSchema,
        url: urlSchema,
        gps: gpsSchema,
        dayParting: dayPartingSchema
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