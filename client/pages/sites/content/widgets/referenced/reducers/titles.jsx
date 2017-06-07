'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../../../helpers/parse-validation');


const initialState = {
    hydrated: false,
    loading: false,
    showSaveSuccess: false,
    error: undefined,
    proc: "edit",
    hasError: {},
    help: {},
    titles: []
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_CONTENT_TITLES) {
        return ObjectAssign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_CONTENT_TITLES_RESPONSE) {
        const validation = ParseValidation(action.response);

        action.response.unshift({"identifier":"none", title: "None"});

        return ObjectAssign({}, state, {
            loading: false,
            hydrated: true,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
            titles: action.response
        });
    }

    return state;
};


module.exports = reducer;
