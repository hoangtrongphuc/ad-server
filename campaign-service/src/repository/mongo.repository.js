const Promise = require('bluebird')

const repository = db => {
  const createCampaign = campaign => {
    return new Promise((resolve, reject) => {
      campaign.createdAt = campaign.updatedAd = Date.now();
      db.collection('campaign').insertOne(campaign, (err, doc) => {
        if (err) {
          reject(new Error('An error ocurred create campaign, err: ' + err))
        }
        resolve(doc)
      })
    })
  }

  const getCampaignById = _id => {
    return new Promise((resolve, reject) => {
      db.collection('campaign').findOne({ _id },
        (err, doc) => {
          if (err) {
            reject(new Error('An error occurred get campaign, err: ' + err))
          }
          resolve(doc)
        }
      )
    })
  }

  const getAllCampaign = ({ filter, projection, sort, limit = 20, skip = 0 }) => {
    return new Promise((resolve, reject) => {
      db.collection('campaign').find(filter).project(projection).sort(sort).limit(limit).skip(skip*limit)
        .toArray((err, docs) => {
          if (err) {
            reject(new Error('An error fetching campaigns, err: ' + err))
          }
          resolve(docs)
        })
    })
  }

  const removeCampaignById = _id => {
    return new Promise((resolve, reject) => {
      db.collection('campaign').remove({ _id },
        (err, doc) => {
          if (err) {
            reject(new Error('An error occurred remove campaign, err: ' + err))
          }
          resolve(doc)
        }
      )
    })
  }

  const updateCampaignById = (_id, update) => {
    return new Promise((resolve, reject) => {
      update.updatedAd = Date.now();
      db.collection('campaign').updateOne({ _id }, { $set: update },
        (err, doc) => {
          if (err) {
            reject(new Error('An error occurred update campaign, err: ' + err))
          }
          resolve(doc)
        }
      )
    })
  }

  return Object.create({
    createCampaign,
    getAllCampaign,
    getCampaignById,
    updateCampaignById,
    removeCampaignById
  })
}

module.exports = repository