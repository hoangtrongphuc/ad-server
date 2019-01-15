const rq = require("request-promise");

const settings = {
  host: "auth.staging.drmtoday.com",
  authUrl:
    process.env.DRM_TODAY_AUTH_HOST || "https://auth.staging.drmtoday.com",
  baseUrl: process.env.DRM_TODAY_BASE_HOST || "https://fe.staging.drmtoday.com",
  username: process.env.DRM_TODAY_USER || "qnet::test",
  password: process.env.DRM_TODAY_PASS || "jgw9Sh4gaomgY71M1h3BWe35buoN1mfY",
  loginPath: "/cas/v1/tickets",
  keyIngestPath: "/frontend/api/keys/v2/ingest/",
  merchantId: process.env.DRM_TODAY_MERCHANT || "qnet",
  queryPath: "/frontend/download-api/ingestion/query/v1/keys/"
};
const getServiceMerchant = (config = settings) => {
  return `${config["baseUrl"]}${config["keyIngestPath"]}${
    config["merchantId"]
  }`;
};

const login = (config = settings) => {
  let url = config.authUrl + config.loginPath;
  let x = Date.now();
  let options = {
    url,
    form: { username: config.username, password: config.password },
    timeout: 6000,
    method: "POST",
    resolveWithFullResponse: true
  };
  console.log("login: ", url);
  return rq(options).then(response => {
    console.warn("timer DRM login: " + (Date.now() - x), response.statusCode);
    if (response.statusCode == 201) {
      let location = response.headers["location"];
      return location ? Promise.resolve(location) : Promise.reject();
    } else return Promise.reject();
  });
};

const getTicket = url => {
  let x = Date.now();
  let options = {
    url,
    form: {
      service: getServiceMerchant()
    },
    timeout: 6000,
    method: "POST",
    resolveWithFullResponse: true
  };
  console.log("getTicket: ", url);
  return rq(options).then(response => {
    console.warn("timer DRM ticket:" + (Date.now() - x), response.body);
    if (response.statusCode == 200) {
      return Promise.resolve(response.body);
    } else return Promise.reject();
  });
};

const drmApi = ticket => {
  setInterval(() => {
    console.log('Refresh Ticket!')
    login()
      .then(location => {
        return getTicket(location);
      })
      .then(newTicket => {
        ticket = newTicket;
      })
      .catch(err => {
        console.log(err);
        console.log("Refresh Ticket error");
      });
  }, 24 * 60 * 60 * 1000);

  const genKey = body => {
    let x = Date.now();
    let options = {
      url: getServiceMerchant() + "?ticket=" + ticket,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      timeout: 6000,
      body,
      method: "POST",
      json: true,
      resolveWithFullResponse: true
    };
    console.log("genKey: ", options);
    return rq(options).then(response => {
      console.log("timer DRM genKey:" + (Date.now() - x));
      if (response.statusCode == 200) {
        return Promise.resolve(response.body);
      } else return Promise.reject();
    });
  };
  return {
    genKey
  };
};

module.exports = () => {
  return new Promise((resolve, reject) => {
    return login()
      .then(location => {
        return getTicket(location);
      })
      .then(ticket => {
        console.log("Connect DRM!");
        return resolve(drmApi(ticket));
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};
