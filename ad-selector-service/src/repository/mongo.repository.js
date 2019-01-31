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

  return Object.create({
    createZone
  })
}

module.exports = repository