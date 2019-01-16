"use strict";
global.Promise = require("bluebird");
const { EventEmitter } = require("events");
const { start } = require("./server");
const config = require("./config");

const mediator = new EventEmitter();

console.log("----- micro service start-----------");

process.on("uncaughtException", err => {
  console.error("uncaughtException: ", err);
  process.exit(1)
});

process.on("uncaughtRejection", err => {
  console.error("uncaughtRejection: ", err);
  process.exit(1)
});

mediator.on("connect.fail", err => {
  console.error(err.message);
  process.exit(1)
});

mediator.on("di.ready", container => {
  return start(container).then(app => {
    console.log(
      `Server started successfully, running on port: ${app.address().port}`
    );
    app.on("close", () => {
      container.resolve("msqQueue").close();
      container.resolve("db").close();
    });
  });
});

config(mediator);
