"use strict";
global.Promise = require("bluebird");
const { EventEmitter } = require("events");
const { start } = require("./server");
const config = require("./config");
//const repository = require('./repository/repository')
const drmService = require("./service/drm.service");

const mediator = new EventEmitter();

console.log("----- micro service start-----------");

process.on("uncaughtException", err => {
  console.error("uncaughtException: ", err);
});

process.on("uncaughtRejection", err => {
  console.error("uncaughtRejection: ", err);
});

mediator.on("connect.fail", err => {
  console.error(err);
});

mediator.on("di.ready", container => {
  /*repository.connect(container)
    .then(repo => {
      container.registerValue({ repo })
      return start(container)
    })*/
  container.registerValue({ drmService: drmService(container) });
  return start(container).then(app => {
    console.log(
      `Server started successfully, running on port: ${app.address().port}`
    );
    app.on("close", () => {
      container.resolve("rabbit").close();
      container.resolve("db").close();
    });
  });
});

config(mediator);
