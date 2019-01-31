const express = require("express");

const API = (container, app) => {
  let router = express.Router();
  let campaignService = container.resolve("campaignService");

  router.route('/:id/creatives')
    .get((req, res, next) => {
      campaignService
        .getCreativesByCampaignId(req.params.id)
        .then(campaign => {
          res.locals = campaign;
          return next();
        })
        .catch(next);
    })
    .post((req, res, next) => {
      campaignService
        .linkCreativeToCampaignId(req.body.creativeId, req.params.id)
        .then(campaign => {
          res.locals = campaign;
          return next();
        })
        .catch(next);
    })
    .delete((req, res, next) => {
      campaignService
        .unlinkCreativeFromCampaignId(req.body.creativeId, req.params.id)
        .then(campaign => {
          res.locals = campaign;
          return next();
        })
        .catch(next);
    })

  router.route('/:id')
    .get((req, res, next) => {
      campaignService
        .getCampaignById(req.params.id)
        .then(campaign => {
          res.locals = campaign;
          return next();
        })
        .catch(next);
    })
    .put((req, res, next) => {
      campaignService
        .updateCampaignById(req.params.id, req.body)
        .then(campaign => {
          res.locals = campaign;
          return next();
        })
        .catch(next);
    })
    .delete((req, res, next) => {
      campaignService
        .removeCampaignById(req.params.id)
        .then(campaign => {
          res.locals = campaign;
          return next();
        })
        .catch(next);
    });

  router.route('/')
    .get((req, res, next) => {
      campaignService
        .getAllCampaign(req.query)
        .then(campaigns => {
          res.locals = campaigns;
          return next();
        })
        .catch(next);
    })
    .post((req, res, next) => {
      campaignService
        .createCampaign(req.body)
        .then(newCampaign => {
          res.locals = newCampaign;
          return next();
        })
        .catch(next);
    })


  app.use("/campaigns", router);
};

module.exports = API;
