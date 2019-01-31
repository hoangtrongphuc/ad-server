const express = require("express");

const API = (container, app) => {
  let router = express.Router();
  let creativeService = container.resolve("creativeService");
  router.route('/:id')
    .get((req, res, next) => {
      creativeService
        .getCreativeById(req.params.id)
        .then(creative => {
          res.locals = creative;
          return next();
        })
        .catch(next);
    })
    .put((req, res, next) => {
      creativeService
        .updateCreativeById(req.params.id, req.body)
        .then(creative => {
          res.locals = creative;
          return next();
        })
        .catch(next);
    })
    .delete((req, res, next) => {
      creativeService
        .removeCreativeById(req.params.id)
        .then(creative => {
          res.locals = creative;
          return next();
        })
        .catch(next);
    });

  router.route('/')
    .get((req, res, next) => {
      creativeService
        .getAllCreative(req.query)
        .then(creatives => {
          res.locals = creatives;
          return next();
        })
        .catch(next);
    })
    .post((req, res, next) => {
      creativeService
        .createCreative(req.body)
        .then(newcreative => {
          res.locals = newcreative;
          return next();
        })
        .catch(next);
    })


  app.use("/creatives", router);
};

module.exports = API;
