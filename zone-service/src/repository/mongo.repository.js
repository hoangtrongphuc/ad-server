const Promise = require('bluebird')

const repository = db => {
  const createZone = zone => {
    return new Promise((resolve, reject) => {
      zone.createdAt = zone.updatedAd = Date.now();
      db.collection('zone').insertOne(zone, (err, doc) => {
        if (err) {
          reject(new Error('An error ocurred create zone, err: ' + err))
        }
        resolve(doc)
      })
    })
  }

  const getZoneById = _id => {
    return new Promise((resolve, reject) => {
      db.collection('zone').findOne({ _id },
        (err, doc) => {
          if (err) {
            reject(new Error('An error occurred get zone, err: ' + err))
          }
          resolve(doc)
        }
      )
    })
  }

  const getAllZone = ({ filter, projection, sort, limit = 20, skip = 0 }) => {
    return new Promise((resolve, reject) => {
      db.collection('zone').find(filter).project(projection).sort(sort).limit(limit).skip(skip*limit)
        .toArray((err, docs) => {
          if (err) {
            reject(new Error('An error fetching zones, err: ' + err))
          }
          resolve(docs)
        })
    })
  }

  const removeZoneById = _id => {
    return new Promise((resolve, reject) => {
      db.collection('zone').remove({ _id },
        (err, doc) => {
          if (err) {
            reject(new Error('An error occurred remove zone, err: ' + err))
          }
          resolve(doc)
        }
      )
    })
  }

  const updateZoneById = (_id, update) => {
    return new Promise((resolve, reject) => {
      update.updatedAd = Date.now();
      db.collection('zone').updateOne({ _id }, { $set: update },
        (err, doc) => {
          if (err) {
            reject(new Error('An error occurred update zone, err: ' + err))
          }
          resolve(doc)
        }
      )
    })
  }

  return Object.create({
    createZone,
    getAllZone,
    getZoneById,
    updateZoneById,
    removeZoneById
  })
}

module.exports = repository