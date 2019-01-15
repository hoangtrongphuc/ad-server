"use strict";

module.exports = {

  DRM_TEMPLATE_REF: ["212ddf29-0db4-40f1-9d18-23a1b53e32a9"],
  DRM_SECRET: "Qnet!123AC",
  API_DOMAIN: {
    USER: "http://localhost:8081/customer/",
    CSL: "http://localhost:8084/csl/" 
  },
  VOD_DOMAIN: "https://vodstvvnpt.gviet.vn/",
  TRANSCODE_VIDEO_URL: "",
  MOVIE_STATE: {
    NEW: 0,
    READY: 1,
    WAIT: 2,
    PROGRESS: 3,
    COMPLETE: 4
  },
  PROFILE_MAP: {
    1080: [1080, 3000000, 192000],
    720: [720, 2000000, 128000],
    480: [480, 1500000, 128000],
    240: [240, 500000, 64000]
  },
  CODE: {
    SUCCESS: {
      ec: 0,
      msg: "Success"
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
