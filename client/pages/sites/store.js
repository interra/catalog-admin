'use strict';
const Sites = require('./reducers/sites-list');
const Site = require('./reducers/site-form');
const User = require('./reducers/user');
const Delete = require('./reducers/delete');

const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        delete: Delete,
        sites: Sites,
        site: Site,
        user: User
    })
);
