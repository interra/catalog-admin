'use strict';
const Redux = require('redux');
const Results = require('./reducers/results');
const Site = require('../../reducers/site-form');

module.exports = Redux.createStore(
    Redux.combineReducers({
        results: Results,
        site: Site
    })
);
