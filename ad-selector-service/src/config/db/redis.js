"use strict";
const redis = require("redis");
const Promise = require("bluebird")
Promise.promisifyAll(redis.RedisClient.prototype);

const redisSettings = {
  password: process.env.REDIS_AUTH,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB
};
const getRedisUrl = options => {
  if (options.password)
    return `redis://${options.host}:${options.port}?db=${options.db}&password=${options.password}`
  else
    return `redis://${options.host}:${options.port}?db=${options.db}`

}
module.exports = (options = redisSettings) => {
  return new Promise((resolve, reject) => {
    let redisUrl = getRedisUrl(options)
    let client = redis.createClient(redisUrl);
    client.on('connect', function () {
      console.log('Redis client connected');
      return resolve(client)
    });
    client.on('error', function (err) {
      console.log('Something went wrong ' + err);
      return reject(err)
    });
  });
};
