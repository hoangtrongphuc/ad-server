const _ = require("lodash");
const rp = require("request-promise");
const ObjectID = require('mongodb').ObjectID
const parser = require('ua-parser-js');

module.exports = container => {
  const redis = container.resolve("redis");
  const CONSTS = container.resolve("consts");
  const queue = container.resolve("msgQueue");
  const filtering = container.resolve("filtering")
  const targeting = container.resolve("targeting")

  const selectAd = (zoneId, reqData) => {
    let useragent = parserUA(reqData['user-agent'])
    return rp({ uri: `http://${process.env.ZONE_SERVICE_URL}/zones/${zoneId}/campaigns`, json: true })
      .then(res => {
        if (_.isEmpty(res.data)) return Promise.resolve({})
        let userKey = `${reqData.ip}:${useragent.device}:${useragent.os}`
        return redis.getAsync(userKey)
          .then(userData => {
            console.log(userKey, userData)
            userData = userData ? JSON.parse(userData) : {}
            let camp = filtering.process(res.data, reqData, userData)[0]
            if (!camp) return Promise.resolve({})
            //  let camp = res.data[Math.floor(Math.random() * res.data.length)];
            let creativeId = camp.creatives[Math.floor(Math.random() * camp.creatives.length)]
            return rp({ uri: `http://${process.env.CREATIVE_SERVICE_URL}/creatives/${creativeId}`, json: true })
              .then(response => {
                let data = filtering.finish({ campId: camp._id, creativeId }, userData)
                console.log(data)
                redis.setAsync(userKey, JSON.stringify(data));
                return Promise.resolve(response.data.vastResponse[reqData.version || 'v3'].replace(/{{}}/g, camp._id))
              })
          })
      })
  };
  const tracking = data => {
    data = { ...data, ...parserUA(data['user-agent']) }
    queue.log(data)
  }

  const parserUA = function (uastring) {
    let ua = parser(uastring.toLowerCase());
    return {
      browser: mapping(ua.browser, 'name', [['Edge', 'edge'], 'ie', 'chrome', 'chromium', 'konqueror', 'safari', 'opera', 'firefox', 'fennec', 'mozilla', 'midori', 'arora', 'camino', 'iceweasel', 'flock', 'avant', 'baidu', 'dolphin', 'epiphany', ['icab', 'icab-mobile'], 'iceape', 'icecat', ['lunascape', 'ilunascape-android'], 'maxthon', ['netscape', 'netscape_4-6'], 'netsurf', 'omniweb', ['qqbrowser', 'qq'], 'rockmelt', 'rekonq', 'seamonkey', ['silk', 'silk_1'], ['skyfire', 'skyfire-ios'], ['ucbrowser', 'uc'], ['uc browser', 'uc'], 'yandex']),
      os: mapping(ua.os, 'name', ['meego', 'symbian', 'android', 'blackberry', 'bada', ['windows phone os', 'winphone'], 'windows', 'chromium', 'mac', 'freebsd', 'bsd', 'kubuntu', 'xubuntu', 'lubuntu', 'ubuntu', 'gentoo', 'fedora', 'mandriva', 'redhat', 'suse', 'debian', 'slackware', 'arch', 'linux', 'solaris', 'webos', 'centos', 'pclinuxos', 'ios', ['rim', 'blackberry'], 'qnx', 'gnu', 'playstation', 'wii', 'xbox', 'unix']),
      device: mapping(ua.device, 'type', [['undefined', 'pc'], 'console', 'tablet', ['mobile', 'phone'], ['smarttv', 'tv']])
    };
  }
  const mapping = function (prop, key, arr) {
    for (var i in arr) {
      if (arr.hasOwnProperty(i)) {
        var isobj = typeof arr[i] === 'object';
        var r = isobj ? new RegExp(arr[i][0], 'i') : new RegExp(arr[i], 'i');
        if (r.test(prop[key])) {
          return isobj ? arr[i][1] : arr[i]
        } else if (prop[key] !== undefined) {
          continue;
        }
      }
    }
    return 'other';
  };



  return {
    selectAd,
    tracking
  };
};
