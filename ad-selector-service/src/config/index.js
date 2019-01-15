"use strict";
const consts = require("./consts");
const di = require("./di");
const db = require("./db");
const rabbit = require("./rabbit");
const drm = require("./drmToday");
const Promise = require("bluebird");
//const models = require('../models');
//const { connect } = database;

module.exports = mediator => {
  return Promise.all([drm(), db["mongo"](), rabbit()])
    .spread((drm, mongo, rabbit) => {
      console.log("Connect.Ready!");
      di(mediator);
      mediator.emit("connect.ready", { consts, drm, db: mongo, rabbit });
    })
    .catch(err => {
      mediator.emit("connect.fail", err);
    });
};
