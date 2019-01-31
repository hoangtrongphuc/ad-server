const ObjectID = require('mongodb').ObjectID
const rp = require('request-promise');
const _ = require('lodash')

module.exports = container => {
  const repository = container.resolve("repository");
  const model = container.resolve("model")
  const CONSTS = container.resolve("consts");
  const queue = container.resolve("msgQueue");

  const getAllCampaign = ({ filter = `{}`, projection = `{}`, sort = `{ "createdAt": -1 }`, limit, skip }) => {
    filter = JSON.parse(filter);
    if (filter._id) {
      if (typeof filter._id === 'string') {
        filter._id = new ObjectID(filter._id);
      } else if (filter._id.$in) {
        filter._id.$in = filter._id.$in.map(id => new ObjectID(id));
      } else if (filter._id.$ne) {
        filter._id.$ne = new ObjectID(filter._id.$ne);
      } else if (filter._id.$nin) {
        filter._id.$nin = filter._id.$nin.map(id => new ObjectID(id));
      }
      console.log(filter);
      console.log(filter._id.$in)
    }
    projection = JSON.parse(projection)
    return repository.getAllCampaign({
      filter, projection,
      sort: JSON.parse(sort), limit: Number(limit), skip: Number(skip)
    })
  };

  const createCampaign = campaign => {
    let validateData = model.validate(campaign, model.createCampaign);
    if (validateData) {
      return repository.createCampaign(validateData)
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const updateCampaignById = (campaignId, update) => {
    let validateData = model.validate(update, model.editCampaign);
    if (validateData && ObjectID.isValid(campaignId)) {
      return repository.updateCampaignById(new ObjectID(campaignId), validateData)
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const removeCampaignById = campaignId => {
    if (ObjectID.isValid(campaignId)) {
      return repository.removeCampaignById(new ObjectID(campaignId))
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const getCampaignById = campaignId => {
    if (ObjectID.isValid(campaignId)) {
      return repository.getCampaignById(new ObjectID(campaignId))
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const getCreativesByCampaignId = (campaignId) => {
    if (ObjectID.isValid(campaignId)) {
      return repository.getCampaignById(new ObjectID(campaignId))
        .then(campaign => {
          if (!campaign) return Promise.reject(CONSTS.CODE.WRONG_PARAM)
          return rp({ uri: `http://${process.env.CREATIVE_SERVICE_URL}/creatives?filter={"_id":{"$in":${JSON.stringify(campaign.creatives)}}}`, json: true })
            .then(res => {
              console.log('res', res)
              return Promise.resolve(res.data)
            })
        })
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  }
  const linkCreativeToCampaignId = (creativeId, campaignId) => {
    if (ObjectID.isValid(creativeId) || ObjectID.isValid(campaignId)) {
      campaignId = new ObjectID(campaignId);
      return Promise.all([
        repository.getCampaignById(campaignId),
        rp({ uri: `http://${process.env.CREATIVE_SERVICE_URL}/creatives/${creativeId}`, json: true })
      ])
        .spread((camp, res) => {
          if (_.isEmpty(res.data) || _.isEmpty(camp)) {
            return Promise.reject(CONSTS.CODE.WRONG_PARAM)
          }
          camp.creatives.push(new ObjectID(creativeId))
          return repository.updateCampaignById(campaignId, { creatives: camp.creatives })
        })
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  }

  const unlinkCreativeFromCampaignId = (creativeId, campaignId) => {
    if (ObjectID.isValid(creativeId) || ObjectID.isValid(campaignId)) {
      campaignId = new ObjectID(campaignId);
      return repository.getCampaignById(campaignId)
        .then(camp => {
          camp.creatives = camp.creatives.filter(creative => creative.toString() != creativeId)
          return repository.updateCampaignById(campaignId, { creatives: camp.creatives })
        })
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  }

  return {
    getAllCampaign,
    createCampaign,
    updateCampaignById,
    getCampaignById,
    removeCampaignById,
    getCreativesByCampaignId,
    linkCreativeToCampaignId,
    unlinkCreativeFromCampaignId
  };
};
