const { createContainer, asValue } = require("awilix");
const mongoRepository = require('../repository/mongo.repository')
const camapaignService = require("../service/camapaign.service");
const camapaignModel = require('../model/camapaign')
module.exports = mediator => {
  mediator.on("connect.ready", ({ consts, db, msgQueue }) => {
    console.log("Init DI container!");
    const container = createContainer();
    container.register({
      db: asValue(db),
      msgQueue: asValue(msgQueue),
      consts: asValue(consts),
      model: asValue(camapaignModel),
      repository: asValue(mongoRepository(db))
    });
    container.registerValue = object => {
      Object.keys(object).forEach(key => {
        container.register(key, asValue(object[key]));
      });
    };
    container.register({
      camapaignService: asValue(camapaignService(container))
    });
    mediator.emit("di.ready", container);
  });
};
