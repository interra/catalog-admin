'use strict';
const File = require('./reducers/file');

const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        file: File
    })
);
