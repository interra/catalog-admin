'use strict';
const Contents = require('./reducers/datasets');
const Content = require('./reducers/dataset');
const User = require('../reducers/user');
const Delete = require('../reducers/delete');
const Site = require('../reducers/site-form');
const CollectionSchema = require('./reducers/collection-schema');

const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        delete: Delete,
        contents: Contents,
        site: Site,
        content: Content,
        collectionSchema: CollectionSchema,
        user: User
    })
);
