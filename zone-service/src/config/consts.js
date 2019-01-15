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
  }
};
