const express = require("express");

const API = (container, app) => {
  let router = express.Router();
  let adSelectorService = container.resolve("adSelectorService");

  router.route('/vmap').get((req, res, next) => {
    res.set('Content-Type', 'text/xml')
    return res.send(`<vmap:VMAP xmlns:vmap="http://www.iab.net/videosuite/vmap" version="1.0"><vmap:AdBreak timeOffset="start" breakType="linear" breakId="preroll"><vmap:AdSource id="preroll-ad-1" allowMultipleAds="false" followRedirects="true"><vmap:AdTagURI templateType="vast3"><![CDATA[http://localhost:3004/adv/request/5c500a85f0ee2a00063fa28a?version=v3]]></vmap:AdTagURI></vmap:AdSource></vmap:AdBreak><vmap:AdBreak timeOffset="00:00:10.000" breakType="linear" breakId="midroll-1"><vmap:AdSource id="midroll-1-ad-1" allowMultipleAds="false" followRedirects="true"><vmap:AdTagURI templateType="vast3"><![CDATA[http://localhost:3004/adv/request/5c500a85f0ee2a00063fa28a?version=v3]]></vmap:AdTagURI></vmap:AdSource></vmap:AdBreak><vmap:AdBreak timeOffset="end" breakType="linear" breakId="postroll"><vmap:AdSource id="postroll-ad-1" allowMultipleAds="false" followRedirects="true"><vmap:AdTagURI templateType="vast3"><![CDATA[http://localhost:3004/adv/request/5c500a85f0ee2a00063fa28a?version=v3]]></vmap:AdTagURI></vmap:AdSource></vmap:AdBreak></vmap:VMAP>`)
  })


  router.route('/tracking')
    .get((req, res, next) => {
      adSelectorService.tracking({ ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, ...req.body, ...req.query, ...req.params, ...req.headers })
      return next()
    })

  router.route('/request/:id')
    .get((req, res, next) => {
      adSelectorService
        .selectAd(req.params.id, { ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, ...req.body, ...req.query, ...req.params, ...req.headers })
        .then(adTag => {
          res.set('Content-Type', 'text/xml')
          return res.send(adTag)
        })
        .catch(next);
    })



  app.use("/adv", router);
};

module.exports = API;
