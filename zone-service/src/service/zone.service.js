const ObjectID = require('mongodb').ObjectID
const rp = require('request-promise')
const _ = require('lodash')
module.exports = container => {
  const repository = container.resolve("repository");
  const model = container.resolve("model")
  const CONSTS = container.resolve("consts");
  const queue = container.resolve("msgQueue");

  const getAllZone = ({ filter = `{}`, projection = `{}`, sort = `{ "createdAt": -1 }`, limit, skip }) => {
    return repository.getAllZone({
      filter: JSON.parse(filter), projection: JSON.parse(projection),
      sort: JSON.parse(sort), limit: Number(limit), skip: Number(skip)
    })
  };

  const createZone = zone => {
    let validateData = model.validate(zone, model.createZone);
    if (validateData) {
      validateData.linkZone = `${process.env.AD_SELECTOR_SERVICE_URL}/${validateData._id}`
      return repository.createZone(validateData)
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const updateZoneById = (zoneId, update) => {
    let validateData = model.validate(update, model.editZone);
    if (validateData && ObjectID.isValid(zoneId)) {
      return repository.updateZoneById(new ObjectID(zoneId), update)
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const removeZoneById = zoneId => {
    if (ObjectID.isValid(zoneId)) {
      return repository.removeZoneById(new ObjectID(zoneId))
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const getZoneById = zoneId => {
    if (ObjectID.isValid(zoneId)) {
      return repository.getZoneById(new ObjectID(zoneId))
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const getCampaignsByZoneId = (zoneId) => {
    if (ObjectID.isValid(zoneId)) {
      return repository.getZoneById(new ObjectID(zoneId))
        .then(zone => {
          if (!zone) return Promise.reject(CONSTS.CODE.WRONG_PARAM)
          return rp({ uri: `http://${process.env.CAMPAIGN_SERVICE_URL}/campaigns?filter={"_id":{"$in":${JSON.stringify(zone.campaigns)}}}`, json: true })
            .then(res => {
              return Promise.resolve(res.data)
            })
        })
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  }
  const linkCampaignToZoneId = (campaignId, zoneId) => {
    if (ObjectID.isValid(campaignId) || ObjectID.isValid(zoneId)) {
      zoneId = new ObjectID(zoneId);
      return Promise.all([
        repository.getZoneById(zoneId),
        rp({ uri: `http://${process.env.CAMPAIGN_SERVICE_URL}/campaigns/${campaignId}`, json: true })
      ])
        .spread((zone, res) => {
          if (_.isEmpty(res.data) || _.isEmpty(zone)) {
            return Promise.reject(CONSTS.CODE.WRONG_PARAM)
          }
          zone.campaigns.push(new ObjectID(campaignId))
          return repository.updateZoneById(zoneId, { campaigns: zone.campaigns })
        })
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  }

  const unlinkCampaignFromZoneId = (campaignId, zoneId) => {
    if (ObjectID.isValid(creativeId) || ObjectID.isValid(zoneId)) {
      zoneId = new ObjectID(zoneId);
      return repository.getZoneById(zoneId)
        .then(zone => {
          zone.campaigns = zone.campaigns.filter(campaign => campaign.toString() != campaignId)
          return repository.updateZoneById(zoneId, { campaigns: zone.campaigns })
        })
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  }

  return {
    getAllZone,
    createZone,
    updateZoneById,
    getZoneById,
    removeZoneById,
    linkCampaignToZoneId,
    unlinkCampaignFromZoneId,
    getCampaignsByZoneId
  };
};
