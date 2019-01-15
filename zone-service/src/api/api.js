const express = require("express");

const API = (container, app) => {
  let router = express.Router();
  let zoneService = container.resolve("zoneService");
  router.route('/:id')
    .get((req, res, next) => {
      zoneService
        .getZoneById(req.params.id)
        .then(zone => {
          res.locals = zone;
          return next();
        })
        .catch(err => {
          return next(err);
        });
    })
    .put((req, res, next) => {
      zoneService
        .updateZoneById(req.params.id, req.body)
        .then(zone => {
          res.locals = zone;
          return next();
        })
        .catch(err => {
          return next(err);
        });
    })
    .delete((req, res, next) => {
      zoneService
        .removeZoneById(req.params.id)
        .then(zone => {
          res.locals = zone;
          return next();
        })
        .catch(err => {
          return next(err);
        });
    });

  router.route('/')
    .get((req, res, next) => {
      zoneService
        .getAllZone(req.query)
        .then(zones => {
          res.locals = zones;
          return next();
        })
        .catch(err => {
          return next(err);
        });
    })
    .post((req, res, next) => {
      zoneService
        .createZone(req.body)
        .then(newZone => {
          res.locals = newZone;
          return next();
        })
        .catch(err => {
          return next(err);
        });
    })


  app.use("/zone", router);
};

module.exports = API;
