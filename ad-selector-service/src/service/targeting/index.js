

const fs = require("fs");
const path = require("path");
const targetArr = []

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function (file) {
    targetArr.push(require(path.join(__dirname, file)));
  });

const Target = container => {
  const result = (data, query) => {
    return targetArr.reduce((target, current) => {
      return current.concat(target(container, data, query))
    }, [])
  };
  return {
    result
  }
}
module.exports = Target;