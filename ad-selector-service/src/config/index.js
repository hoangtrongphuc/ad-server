"use strict";
const consts = require("./consts");
const di = require("./di");
const db = require("./db");
const rabbit = require("./rabbit");
const Promise = require("bluebird");

module.exports = mediator => {
  return Promise.all([db["mongo"](), rabbit(), db["redis"]()])
    .spread((db, msgQueue, redis) => {
      console.log("Connect.Ready!");
      di(mediator);
      mediator.emit("connect.ready", { consts, db, msgQueue, redis });
    })
    .catch(err => {
      mediator.emit("connect.fail", err);
    });
};
