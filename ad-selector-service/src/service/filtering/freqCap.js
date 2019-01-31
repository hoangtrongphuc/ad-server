const moment = require('moment')
module.exports = {
  process: (container, camps, query, userData) => {
    if (!userData || !userData['camps']) return camps
    let campFilter = []
    camps.forEach(camp => {
      let cap = camp.freqCap['impressions']
      if (cap && userData['camps'][camp._id]) {
        let count = userData['camps'][camp._id].filter(time => time >= moment().subtract(cap.time, cap.unit).valueOf()).length
        console.log('count', count, cap.count)

        if (cap.count > count) {
          campFilter.push(camp)
        }
      } else campFilter.push(camp)
    });
    return campFilter
    //return camps.filter(camp => camp.status == 0)
  },
  finish: (container, data, userData) => {
    if (!userData['camps']) userData['camps'] = {}
    console.log('finish', data)
    if (!userData['camps'][data.campId]) userData['camps'][data.campId] = []
    userData['camps'][data.campId].push(Date.now())
    return userData
  }
}