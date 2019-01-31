

const fs = require("fs");
const path = require("path");
const filterArr = []

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function (file) {
    filterArr.push(require(path.join(__dirname, file)));
  });

const Filter = container => {
  const process = (data, query, userData) => {
    return filterArr.reduce((current, filter) => {
      return filter.process ? filter.process(container, current, query, userData) : current
    }, data)
  };
  const finish = (data, userData) => {
    return filterArr.reduce((current, filter) => {
      return filter.finish ? filter.finish(container, data, current) : current
    }, userData)
  };
  return {
    process,
    finish
  }
}
module.exports = Filter;