const plCypressShared = require('pl-cypress-shared');

var envKey = (typeof(Cypress) !== 'undefined' && Cypress.env().ENVKEY) ? Cypress.env().ENVKEY : 'local';
// const envFile = `../../../config/env/${envKey}`;
// var envConfig = require(envFile);
// Import and export must be static so can not use variables here..
// Have to hard coded all possible environment configs.
let envConfigLive = require('../../../config/env/live');
let envConfigStag = require('../../../config/env/stag');
let envConfigTest = require('../../../config/env/test');
let envConfigLocal = require('../../../config/env/local');
var envConfig = envConfigLocal;
if (envKey === 'live') {
    envConfig = envConfigLive;
} else if (envKey === 'stag') {
    envConfig = envConfigStag;
} else if (envKey === 'test') {
    envConfig = envConfigTest;
}

const config = {};
config.set = () => {
    const keys = plCypressShared.plConfig.set(envConfig);
    for (let key in keys) {
        config[key] = keys[key];
    }
};
config.set();
module.exports = config;