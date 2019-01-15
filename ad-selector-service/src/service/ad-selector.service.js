const crypto = require("crypto");
const moment = require("moment");
const rq = require("request-promise");

module.exports = container => {
  const drm = container.resolve("drm");
  const CONSTS = container.resolve("consts");
  const rabbit = container.resolve("rabbit");
  const genKeyInput = assetId => {
    return `${assetId}-${CONSTS.DRM_SECRET}`;
  };
  const genKeyDrm = data => {
    let keyData = {};
    let keyRequest = [];
    if (typeof data != "object" || data.length == 0)
      return Promise.resolve(keyData);
    data.forEach(assetId => {
      keyRequest.push({
        type: "",
        assetId,
        variantId: "",
        ingestKeys: [
          {
            streamType: "",
            algorithm: "",
            key: crypto
              .createHash("md5")
              .update(genKeyInput(assetId))
              .digest()
              .toString("base64"),
            iv: crypto
              .createHash("md5")
              .update(assetId)
              .digest()
              .toString("base64")
          }
        ]
      });
    });
    return drm.genKey({ assets: keyRequest }).then(response => {
      response.assets.forEach(asset => {
        if (asset.errors) return Promise.resolve(asset.errors);
        let keys = asset.keys;
        let assetId = asset.assetId;
        console.log(asset);
        if (!keyData[assetId]) keyData[assetId] = {};
        console.log("------------------------");
        keys.forEach(key => {
          console.log(key);
          if (key.errors) {
            keyData[assetId]["errors"] = key.errors;
            return;
          }
          let values = Object.values(key.cencResponse.systemId);
          values.forEach(value => {
            if (value.name == "Widevine" || value.name == "PlayReady") {
              keyData[assetId]["key"] = key.key;
              keyData[assetId]["keyId"] = key.keyId;
              keyData[assetId]["iv"] = key.iv;
              keyData[assetId][
                value.name == "Widevine" ? "widevine" : "playready"
              ] = value.psshBoxContent;
            }
          });
        });
      });
      return Promise.resolve(keyData);
    });
  };

  const authorizeUser = data => {
    return new Promise((resolve, reject) => {
      const {
        user,
        asset,
        variant,
        session,
        drmScheme,
        client,
        clientInfo,
        requestMetadata
      } = data;
      console.log(data);
      return rq({
        url: `${
          CONSTS.API_DOMAIN.USER
        }verify?userId=${user}&sessionId=${session}&movieId=${asset}`,
        method: "GET",
        json: true,
        resolveWithFullResponse: true
      })
        .then(userResponse => {
          console.log(userResponse.statusCode, userResponse.body);
          if (userResponse.statusCode == 200) {
            const { operatorId = 1, uId, limit = 2 } = userResponse.body;
            rabbit.log(Object.assign(data, response.body));
            return rq({
              url: `${
                CONSTS.API_DOMAIN.CSL
              }start?uId=${uId}&limit=${limit}&clientId=${client}`,
              method: "GET",
              json: true,
              resolveWithFullResponse: true
            });
          } else return reject(CONSTS.CODE.UNAUTHORIZED);
        })
        .then(cslResponse => {
          console.log(cslResponse.statusCode, cslResponse.body);
          if (cslResponse.statusCode == 200) {
            if (cslResponse.body.ec) return reject(CONSTS.CODE.UNAUTHORIZED);
            // let token = cslResponse.body.token;
            return resolve({
              ref: CONSTS.DRM_TEMPLATE_REF
              //  accountingId: `qn:${token}`
            });
          } else return reject(CONSTS.CODE.UNAUTHORIZED);
        })
        .catch(err => {
          console.error(err.message);
          rabbit.log(Object.assign(data, err));
          return reject(err);
        });
    });

    data = {
      operatorId: "1",
      asset: "5jcnacnacnac", // movieId or live assetId
      variant: "vod", // vod or live
      user: "[userId]",
      session: "[sessionId]",
      client: "[clientId]",
      drmScheme: "[drmScheme]",
      clientInfo: {
        manufacturer: "[manufacturer]",
        model: "[model]",
        version: "[version]",
        certType: "[certType]",
        drmVersion: "[drmVersion]",
        secLevel: "[secLevel]"
      },
      requestMetadata: {
        remoteAddr: "[remoteAddress]",
        userAgent: "[userAgent]"
      }
    };
    data = {
      operatorId: "1",
      asset: "5jcnacnacnac", // movieId or live assetId
      variant: "vod", // vod or live
      user: "[userId]",
      session: "[sessionId]",
      client: "[clientId]",
      drmScheme: "[drmScheme]",
      manufacturer: "[manufacturer]",
      model: "[model]",
      version: "[version]",
      certType: "[certType]",
      drmVersion: "[drmVersion]",
      secLevel: "[secLevel]",
      remoteAddr: "[remoteAddress]",
      userAgent: "[userAgent]"
    };
  };
  return {
    genKeyDrm,
    authorizeUser
  };
};
