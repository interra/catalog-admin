'use strict';
const Contents = require('./reducers/datasets');
const Content = require('./reducers/dataset');
const User = require('../reducers/user');
const Delete = require('../reducers/delete');
const Site = require('../reducers/site-form');
const FormData = require('./reducers/form-data');
const CollectionSchema = require('./reducers/collection-schema');

const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        delete: Delete,
        contents: Contents,
        site: Site,
        content: Content,
        formData: FormData,
        collectionSchema: CollectionSchema,
        user: User
    })
);
