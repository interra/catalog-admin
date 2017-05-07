'use strict';
const Titles = require('./reducers/titles');
const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        titles: Titles
    })
);
