"use strict";
const mongodb = require("mongodb");
const dbSettings = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  repl: process.env.DB_REPLS,
  servers: process.env.DB_SERVERS,
  db: process.env.DB
};

const getMongoUrl = options => {
  const url = options.servers
  if(options.repl) {
    if (options.user && options.pass) {
      return `mongodb://${options.user}:${options.pass}@${url}?replicaSet=${options.repl}`;
    }
    return `mongodb://${url}?replicaSet=${options.repl}`;
  } else {
    if (options.user && options.pass) {
      return `mongodb://${options.user}:${options.pass}@${url}`
    }
    return `mongodb://${url}`;
  }
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
        console.log(err)
        if (err) {
          return reject(err);
        }
        if (!client) {
          return reject(new Error("Can not connect to database"));
        }
        console.log("Connect mongoDB!");
        return resolve(client.db(options.db));
      }
    );
  });
};
