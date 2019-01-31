const Promise = require('bluebird')
const repository = db => {
  const createCreative = creative => {
    return new Promise((resolve, reject) => {
      creative.createdAt = creative.updatedAd = Date.now();
      db.collection('creative').insertOne(creative, (err, doc) => {
        if (err) {
          reject(new Error('An error ocurred create creative, err: ' + err))
        }
        resolve(doc)
      })
    })
  }

  const getCreativeById = _id => {
    return new Promise((resolve, reject) => {
      db.collection('creative').findOne({ _id },
        (err, doc) => {
          if (err) {
            reject(new Error('An error occurred get creative, err: ' + err))
          }
          resolve(doc)
        }
      )
    })
  }

  const getAllCreative = ({ filter, projection, sort, limit = 20, skip = 0 }) => {
    return new Promise((resolve, reject) => {
      db.collection('creative').find(filter).project(projection).sort(sort).limit(limit).skip(skip * limit)
        .toArray((err, docs) => {
          if (err) {
            reject(new Error('An error fetching creatives, err: ' + err))
          }
          resolve(docs)
        })
    })
  }

  const removeCreativeById = _id => {
    return new Promise((resolve, reject) => {
      db.collection('creative').remove({ _id },
        (err, doc) => {
          if (err) {
            reject(new Error('An error occurred remove creative, err: ' + err))
          }
          resolve(doc)
        }
      )
    })
  }

  const updateCreativeById = (_id, update) => {
    return new Promise((resolve, reject) => {
      update.updatedAd = Date.now();
      db.collection('creative').updateOne({ _id }, { $set: update },
        (err, doc) => {
          if (err) {
            reject(new Error('An error occurred update creative, err: ' + err))
          }
          resolve(doc)
        }
      )
    })
  }

  return Object.create({
    createCreative,
    getAllCreative,
    getCreativeById,
    updateCreativeById,
    removeCreativeById
  })
}

module.exports = repository