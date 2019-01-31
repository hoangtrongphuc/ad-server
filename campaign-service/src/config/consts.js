"use strict";

module.exports = {
  CODE: {
    SUCCESS: {
      ec: 0,
      msg: "Success"
    },
    WRONG_PARAM: {
      ec: 422,
      msg: "Wrong params!"
    },
    UNAUTHORIZED: {
      ec: 401,
      msg: "Not allowed!"
    },
    SYSTEM_ERR: {
      ec: 500,
      msg: "System error"
    }
  },

  EVENT_TYPE: {
    IMPRESSION: 'impression',
    CLICK: 'click',
    START: 'start',
    CREATIVE_VIEW: 'creativeView',
    FIRST_QUARTILE: 'firstQuartile',
    MIDPOINT: 'midpoint',
    THIRD_QUATTILE: 'thirdQuartile',
    COMPLETE: 'complete',
    MUTE: 'mute',
    UNMUTE: 'unmute',
    PAUSE: 'pause',
    REWIND: 'rewind',
    RESUME: 'resume',
    SKIP: 'skip'
  }
};
