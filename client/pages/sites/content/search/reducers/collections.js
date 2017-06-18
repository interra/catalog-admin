'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');


const initialState = {
    hydrated: false,
    loading: false,
    requested: false,
    error: undefined,
    collections: [],
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.CLEAR_DATA) {
        console.log("CLEARING STATE!", initialState);
        return initialState;
    }

    if (action.type === Constants.GET_COLLECTIONS) {
        return ObjectAssign({}, state, {
            hydrated: false,
            requested: true,
            loading: true
        });
    }

    if (action.type === Constants.GET_COLLECTIONS_RESPONSE) {
        return ObjectAssign({}, state, {
            hydrated: true,
            requested: true,
            loading: false,
            collections: action.response.collections
        });
    }

    return state;
};


module.exports = reducer;
