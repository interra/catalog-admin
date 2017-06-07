'use strict';
const Redux = require('redux');
const Results = require('./reducers/results');
const Map = require('./reducers/map');
const Collections = require('./reducers/collections');
const Site = require('../../reducers/site-form');

module.exports = Redux.createStore(
    Redux.combineReducers({
        results: Results,
        map: Map,
        collections: Collections,
        site: Site
    })
);
