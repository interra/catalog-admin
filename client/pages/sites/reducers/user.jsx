'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../helpers/parse-validation');


const initialState = {
    hydrated: false,
    loading: false,
    showSaveSuccess: false,
    error: undefined,
    hasError: {},
    help: {},
    username: '',
    id: '',
    email: ''
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_USER) {
        return ObjectAssign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_USER_RESPONSE) {

        const validation = ParseValidation(action.response);
        return ObjectAssign({}, state, {
            loading: false,
            hydrated: true,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
            username: action.response.username,
            id: action.response._id,
            email: action.response.email
        });
    }

    if (action.type === Constants.SAVE_USER) {
        return ObjectAssign({}, state, {
            loading: true,
            username: action.request.data.username,
            email: action.request.data.email
        });
    }

    return state;
};


module.exports = reducer;
