"use strict";
const rabbit = require("amqplib");
const rabbitSettings = {
  host: process.env.RABBIT_HOST,
  port: process.env.RABBIT_PORT,
  user: process.env.RABBIT_USER,
  pass: process.env.RABBIT_PASS,
  exchange: process.env.RABBIT_EXCHANGE
};

const getConnection = ({ host, port, user, pass }) =>
  (user ? "amqp://" + user + ":" + pass + "@" : "amqp://") +
  (port ? [host, port].join(":") : host);

const createChannel = ({ connection, ch }) => {
  console.log("Connect RabbitMQ successful!");
  const close = () => {
    connection.close();
    ch.close();
  };

  const log = (data, exchange = rabbitSettings.exchange) => {
    return new Promise((resolve, reject) => {
      try {
        ch.publish(exchange, "", Buffer.from(JSON.stringify(data)));
        resolve({ ec: 0 });
      } catch (err) {
        reject(new Error("An error publish to channel exchange"));
      }
    });
  };

  return Object.assign(
    {},
    {
      log,
      close
    }
  );
};

module.exports = (config = rabbitSettings) => {
  return new Promise((resolve, reject) => {
    const connectionString = getConnection(config);
    return rabbit
      .connect(connectionString)
      .then(connection => {
        return connection.createChannel().then(channel => {
          return resolve(createChannel({ connection, channel }));
        });
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });
};
