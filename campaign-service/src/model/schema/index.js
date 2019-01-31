

const fs = require("fs");
const path = require("path");
const schemaObj = {}
const Joi = require('joi')
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function (file) {
    schemaObj[`${file.split('.')[0]}`] = require(path.join(__dirname, file));
  });

const SchemaValidator = () => {
  const validate = (data, schema) => {
    const result = Joi.validate(data, schema)
    console.log(result)
    if (result.error === null) {
      return result.value;
    }
    else return false;
  };
  return {
    ...schemaObj,
    validate
  }
}
module.exports = SchemaValidator();