const { createContainer, asValue } = require("awilix");

module.exports = mediator => {
  mediator.on("connect.ready", ({ consts, db, drm, rabbit }) => {
    console.log("Init DI container!");
    const container = createContainer();
    container.register({
      db: asValue(db),
      drm: asValue(drm),
      rabbit: asValue(rabbit),
      consts: asValue(consts)
    });

    container.registerValue = object => {
      Object.keys(object).forEach(key => {
        container.register(key, asValue(object[key]));
      });
    };

    mediator.emit("di.ready", container);
  });
};
