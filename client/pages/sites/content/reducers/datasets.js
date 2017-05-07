'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');

const initialState = {
		loading: false,
		hydrated: false,
    error: undefined,
    hasError: {},
    help: {},
    sites: []
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_DATASETS) {
        return ObjectAssign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_DATASETS_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            hydrated: true,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
            sites: action.response.data
        });
    }

    return state;
};


module.exports = reducer;
