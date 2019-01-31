const ObjectID = require('mongodb').ObjectID
const createVast = require('vast-builder');
const moment = require('moment')

module.exports = container => {
  const repository = container.resolve("repository");
  const model = container.resolve("model")
  const CONSTS = container.resolve("consts");
  const queue = container.resolve("msgQueue");

  const getAllCreative = ({ filter = `{}`, projection = `{}`, sort = `{ "createdAt": -1 }`, limit, skip }) => {
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

    return repository.getAllCreative({
      filter, projection: JSON.parse(projection),
      sort: JSON.parse(sort), limit: Number(limit), skip: Number(skip)
    })
  };

  const createCreative = creative => {
    if (model.validate(creative, model.createCreative)) {
      let vastResponse = buildVastVersion(creative);
      return repository.createCreative({ ...creative, vastResponse })
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const updateCreativeById = (creativeId, update) => {
    if (model.validate(update, model.editCreative) && ObjectID.isValid(creativeId)) {
      let vastResponse = buildVastVersion({ ...update, _id: creativeId });
      return repository.updateCreativeById(new ObjectID(creativeId), { ...update, vastResponse })
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const removeCreativeById = creativeId => {
    if (ObjectID.isValid(creativeId)) {
      return repository.removeCreativeById(new ObjectID(creativeId))
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const getCreativeById = creativeId => {
    if (ObjectID.isValid(creativeId)) {
      return repository.getCreativeById(new ObjectID(creativeId))
    } else return Promise.reject(CONSTS.CODE.WRONG_PARAM)
  };

  const buidVastResponse = (vast, adData) => {
    let trackingUrl = process.env.TRACKING_URL
    let tmp = vast.attachAd()
      .attachInLine()
      .addAdSystem('SIGMA')
      .addAdTitle('OTT VAST')
      .addImpression(`${trackingUrl}?adId=${adData._id}&cId={{}}&event=impression`)
      .attachCreatives()
      .attachCreative()
      .attachLinear({ skipoffset: moment.utc(adData.skipOffset * 1000).format('HH:mm:ss') })
      .addDuration(moment.utc(adData.duration * 1000).format('HH:mm:ss'))
      .attachVideoClicks()
      .addClickThrough(adData.desUrl)
      .addClickTracking(`${trackingUrl}?adId=${adData._id}&cId={{}}&event=click`)

    tmp = tmp.parent.attachTrackingEvents()
    adData.trackingEvents.forEach(event => {
      tmp.attachTracking(`${trackingUrl}?adId=${adData._id}&cId={{}}&event=${event}`, { event })
    })
    tmp = tmp.parent.attachMediaFiles()
    adData.videos.forEach(video => {
      tmp.attachMediaFile(video.url, {
        delivery: video.delivery,
        type: video.type,
        width: video.width,
        bitrate: video.bitrate,
        height: video.height
      })
    })
    return vast;
  }
  const buildVastVersion = adData => {
    const vast2 = createVast.v2();
    const vast3 = createVast.v3();
    const vast4 = createVast.v4();
    return {
      v2: buidVastResponse(vast2, adData).toXml(),
      v3: buidVastResponse(vast3, adData).toXml(),
      v4: buidVastResponse(vast4, adData).toXml()
    }
  }
  return {
    getAllCreative,
    createCreative,
    updateCreativeById,
    getCreativeById,
    removeCreativeById
  };
};
