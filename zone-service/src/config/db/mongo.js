"use strict";
const mongodb = require("mongodb");
const dbSettings = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  repl: process.env.DB_REPLS,
  servers: process.env.DB_SERVERS
    ? process.env.DB_SERVERS.substr(1, process.env.DB_SERVERS.length - 2).split(
        " "
      )
    : ["172.16.30.25"],
  db: process.env.DB || "zone"
};

const getMongoUrl = options => {
  const url = options.servers.reduce((prev, cur) => prev + cur + ",", "");
  if (options.user && options.pass) {
    return `mongodb://${options.user}:${options.pass}@${url.substr(
      0,
      url.length - 1
    )}`//?replicaSet=${options.repl}`;
  }
  return `mongodb://${url.substr(0, url.length - 1)}`;
};

module.exports = (options = dbSettings) => {
  return new Promise((resolve, reject) => {
    const mongoUrl = getMongoUrl(options);
    return mongodb.connect(
      mongoUrl,
      {
        useNewUrlParser: true
      },
      (err, client) => {
        if (err) {
          reject(err);
        }
        if (!client) {
          reject(new Error("Can not connect to database"));
        }
        console.log("Connect mongoDB!");
        return resolve(client.db(options.db));
      }
    );
  });
};
