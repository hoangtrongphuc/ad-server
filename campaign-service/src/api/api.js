const express = require("express");

const API = (container, app) => {
  let router = express.Router();
  let campaignService = container.resolve("campaignService");
  router.route('/:id')
    .get((req, res, next) => {
      campaignService
        .getCampaignById(req.params.id)
        .then(campaign => {
          res.locals = campaign;
          return next();
        })
        .catch(err => {
          return next(err);
        });
    })
    .put((req, res, next) => {
      campaignService
        .updateCampaignById(req.params.id, req.body)
        .then(campaign => {
          res.locals = campaign;
          return next();
        })
        .catch(err => {
          return next(err);
        });
    })
    .delete((req, res, next) => {
      campaignService
        .removeCampaignById(req.params.id)
        .then(campaign => {
          res.locals = campaign;
          return next();
        })
        .catch(err => {
          return next(err);
        });
    });

  router.route('/')
    .get((req, res, next) => {
      campaignService
        .getAllCampaign(req.query)
        .then(campaigns => {
          res.locals = campaigns;
          return next();
        })
        .catch(err => {
          return next(err);
        });
    })
    .post((req, res, next) => {
      campaignService
        .createCampaign(req.body)
        .then(newCampaign => {
          res.locals = newCampaign;
          return next();
        })
        .catch(err => {
          return next(err);
        });
    })


  app.use("/campaign", router);
};

module.exports = API;
