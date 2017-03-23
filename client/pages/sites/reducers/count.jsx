'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../helpers/parse-validation');


const initialState = {
    loading: false,
    error: undefined
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_COUNT) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.GET_COUNT_RESPONSE) {

        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            total: action.response,
            loading: false,
            error: validation.error
        });
    }

    return state;
};


module.exports = reducer;
