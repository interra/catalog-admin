'use strict';
const Datasets = require('./reducers/datasets');
const Dataset = require('./reducers/dataset');
const User = require('../reducers/user');
const Delete = require('../reducers/delete');
const Site = require('../reducers/site-form');

const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        delete: Delete,
        datasets: Datasets,
        site: Site,
        dataset: Dataset,
        user: User
    })
);
