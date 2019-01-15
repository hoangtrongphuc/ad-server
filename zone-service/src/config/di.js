const { createContainer, asValue } = require("awilix");
const mongoRepository = require('../repository/mongo.repository')
const zoneService = require("../service/zone.service");
const zoneModel = require('../model/zone')
module.exports = mediator => {
  mediator.on("connect.ready", ({ consts, db, msgQueue }) => {
    console.log("Init DI container!");
    const container = createContainer();
    container.register({
      db: asValue(db),
      msgQueue: asValue(msgQueue),
      consts: asValue(consts),
      model: asValue(zoneModel),
      repository: asValue(mongoRepository(db))
    });
    container.registerValue = object => {
      Object.keys(object).forEach(key => {
        container.register(key, asValue(object[key]));
      });
    };
    container.register({
      zoneService: asValue(zoneService(container))
    });
    mediator.emit("di.ready", container);
  });
};
