const { createContainer, asValue } = require("awilix");
const mongoRepository = require('../repository/mongo.repository')
const adSelectorService = require("../service/ad-selector.service");
const filtering = require('../service/filtering')
const targeting = require('../service/targeting')

module.exports = mediator => {
  mediator.on("connect.ready", ({ consts, db, msgQueue, redis }) => {
    console.log("Init DI container!");
    const container = createContainer();
    container.register({
      db: asValue(db),
      msgQueue: asValue(msgQueue),
      consts: asValue(consts),
      repository: asValue(mongoRepository(db)),
      filtering: asValue(filtering(container)),
      targeting: asValue(targeting(container)),
      redis: asValue(redis)
    });
    container.registerValue = object => {
      Object.keys(object).forEach(key => {
        container.register(key, asValue(object[key]));
      });
    };
    container.register({
      adSelectorService: asValue(adSelectorService(container))
    });
    mediator.emit("di.ready", container);
  });
};
