const express = require("express");

const API = (container, app) => {
  let router = express.Router();
  let zoneService = container.resolve("zoneService");

  router.route('/:id/campaigns')
    .get((req, res, next) => {
      zoneService
        .getCampaignsByZoneId(req.params.id)
        .then(zone => {
          res.locals = zone;
          return next();
        })
        .catch(next);
    })
    .post((req, res, next) => {
      zoneService
        .linkCampaignToZoneId(req.body.campaignId, req.params.id)
        .then(zone => {
          res.locals = zone;
          return next();
        })
        .catch(next);
    })
    .delete((req, res, next) => {
      zoneService
        .unlinkCampaignFromZoneId(req.body.campaignId, req.params.id)
        .then(zone => {
          res.locals = zone;
          return next();
        })
        .catch(next);
    })

  router.route('/:id')
    .get((req, res, next) => {
      zoneService
        .getZoneById(req.params.id)
        .then(zone => {
          res.locals = zone;
          return next();
        })
        .catch(next);
    })
    .put((req, res, next) => {
      zoneService
        .updateZoneById(req.params.id, req.body)
        .then(zone => {
          res.locals = zone;
          return next();
        })
        .catch(next);
    })
    .delete((req, res, next) => {
      zoneService
        .removeZoneById(req.params.id)
        .then(zone => {
          res.locals = zone;
          return next();
        })
        .catch(next);
    });

  router.route('/')
    .get((req, res, next) => {
      zoneService
        .getAllZone(req.query)
        .then(zones => {
          res.locals = zones;
          return next();
        })
        .catch(next);
    })
    .post((req, res, next) => {
      zoneService
        .createZone(req.body)
        .then(newZone => {
          res.locals = newZone;
          return next();
        })
        .catch(next);
    })


  app.use("/zones", router);
};

module.exports = API;
