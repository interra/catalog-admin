'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');


const initialState = {
    hydrated: false,
    loading: false,
    requested: false,
    error: undefined,
    schema: {}
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_COLLECTION_SCHEMA) {
        return ObjectAssign({}, state, {
            hydrated: false,
            requested: true,
            loading: true
        });
    }

    if (action.type === Constants.GET_COLLECTION_SCHEMA_RESPONSE) {
        return ObjectAssign({}, state, {
            hydrated: true,
            requested: true,
            loading: false,
            schema: action.response
        });
    }

    return state;
};


module.exports = reducer;
