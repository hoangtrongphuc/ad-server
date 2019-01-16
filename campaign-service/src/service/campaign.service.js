const crypto = require("crypto");
const moment = require("moment");
const rq = require("request-promise");
const ObjectID = require('mongodb').ObjectID

module.exports = container => {
  const repository = container.resolve("repository");
  const model = container.resolve("model")
  const CONSTS = container.resolve("consts");
  const queue = container.resolve("msgQueue");

  const getAllCampaign = ({ filter = `{}`, projection = `{}`, sort = `{ "createdAt": -1 }`, limit, skip }) => {
    return repository.getAllCampaign({
      filter: JSON.parse(filter), projection: JSON.parse(projection),
      sort: JSON.parse(sort), limit: Number(limit), skip: Number(skip)
    })
  };

  const createCampaign = campaign => {
    if (model.validateObj(campaign, 'create')) {
      return repository.createCampaign(campaign)
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const updateCampaignById = (campaignId, update) => {
    if (model.validateObj(update, 'edit') && ObjectID.isValid(campaignId)) {
      return repository.updateCampaignById(new ObjectID(campaignId), update)
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

  return {
    getAllCampaign,
    createCampaign,
    updateCampaignById,
    getCampaignById,
    removeCampaignById
  };
};
