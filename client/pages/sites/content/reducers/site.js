'use strict';
const Constants = require('./constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../helpers/parse-validation');


const initialState = {
    hydrated: false,
    loading: false,
    showSaveSuccess: false,
    error: undefined,
    proc: "edit",
    hasError: {},
    help: {},
    name: "",
    slug: "",
    description: ""
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_SITE) {
        return ObjectAssign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_SITE_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            hydrated: true,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
            name: action.response.name,
            slug: action.response._id,
            description: action.response.description
        });
    }

    return state;
};


module.exports = reducer;
