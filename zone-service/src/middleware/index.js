/**
 * Created by hoang on 12/22/2017.
 */
const fs = require('fs')

fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'index.js') {
    let moduleName = file.split('.')[0];
    exports[moduleName] = require('./' + moduleName);
  }
});