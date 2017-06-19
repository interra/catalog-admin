'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../../../helpers/parse-validation');


const initialState = {
    hydrated: false,
    loading: false,
    error: undefined,
    hasError: {},
    filename: "",
    url: "",
    type: ""
};

const reducer = function (state = initialState, action) {

    if (action.type === Constants.SAVE_FILE) {

        return ObjectAssign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.SAVE_FILE_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            hydrated: true,
            error: validation.error,
            hasError: validation.hasError,
            type: action.response.headers["content-type"],
            url: action.response.url,
            filename: action.response.filename
        });
    }

    return state;
};


module.exports = reducer;
