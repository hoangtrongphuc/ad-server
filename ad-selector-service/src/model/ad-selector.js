const Joi = require('joi');

const Model = () => {
    const idSchema = Joi.string()
    const nameSchema = Joi.string().alphanum().min(3).max(255)
    const typeSchema = Joi.number().integer().min(1).max(12)
    const statusSchema = Joi.number().integer().default(0)
    const freqCapSchema = Joi.object()
    const addedBySchema = Joi.string()
    const descSchema = Joi.string()
    const linkSchema = Joi.string()
    const statsSchema = Joi.object().key({
        impressions: Joi.number(),
        clicks: Joi.number()
    })
    const objSchema = {
        create: Joi.object().keys({
            name: nameSchema.required(),
            type: typeSchema.required(),
            status: statusSchema,
            desc: descSchema,
        }),
        edit: Joi.object().keys({
            name: nameSchema,
            status: statusSchema,
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