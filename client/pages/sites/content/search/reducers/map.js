'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../../helpers/parse-validation');

const initialState = {
    hydrated: false,
    loading: false,
    error: undefined,
    hasError: {},
    data: {}
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_MAP) {
        return ObjectAssign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_MAP_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            hydrated: true,
            error: validation.error,
            hasError: validation.hasError,
            data: action.response
        });
    }

    return state;
};


module.exports = reducer;
