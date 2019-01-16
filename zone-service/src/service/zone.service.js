const crypto = require("crypto");
const moment = require("moment");
const ObjectID = require('mongodb').ObjectID

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
    if (model.validateObj(zone, 'create')) {
      return repository.createZone(zone)
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const updateZoneById = (zoneId, update) => {
    if (model.validateObj(update, 'edit') && ObjectID.isValid(zoneId)) {
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

  return {
    getAllZone,
    createZone,
    updateZoneById,
    getZoneById,
    removeZoneById
  };
};
