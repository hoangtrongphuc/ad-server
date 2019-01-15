const express = require("express");

const API = (container, app) => {
  let router = express.Router();
  let adSelectorService = container.resolve("adSelectorService");
  router.get("/getAds", (req, res, next) => {
    adSelectorService
      .getAds(req.query)
      .then(ads => {
        const createVast = require('vast-builder');

        // vast1 is deprecated and not supported
        const vast2 = createVast.v2(options);
        const vast3 = createVast.v3(options);
        const vast4 = createVast.v4(options);
        const vast3 = createVast.v3();
        vast3.attachAd()
          .attachInLine()
          .addImpression('imp_link')
          .addAdSystem('Society')
          .addAdTitle('Title')
          .attachCreatives()
          .attachCreative()
          .attachLinear()
          .attachTrackingEvents()
          .attachTracking('content', { event: 'start' }).back()
          .addDuration('00:30:00')
          .attachMediaFiles()
          .attachMediaFile('my_video', {
            delivery: 'streaming',
            type: 'video/mp4',
            width: '600',
            height: '400'
          })
          .back()
          .attachIcons()
          .attachIcon({
            program: 'my_program',
            width: '50',
            height: '50',
            xPosition: 'bottom',
            yPosition: 'left'
          })
          .attachStaticResource('ressource_link', { creativeType: 'image/jpeg' })

        const render = vast3.toXml();
        
        return res.json(ads);
      })
      .catch(err => {
        return next(err);
      });
  });

  app.use("/ad-selector", router);
};

module.exports = API;
