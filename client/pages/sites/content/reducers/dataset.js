'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');


const initialState = {
    hydrated: false,
    loading: false,
    showSaveSuccess: false,
    error: undefined,
    proc: "edit",
    hasError: {},
    help: {},
    formData: ""
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_CONTENT) {
        return ObjectAssign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_CONTENT_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            hydrated: true,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
            formData: action.response
        });
    }

    if (action.type === Constants.SAVE_DATASET) {
        return ObjectAssign({}, state, {
            loading: true,
            title: action.request.data.title,
            identifier: action.request.data.identifier,
            description: action.request.data.description
        });
    }

    if (action.type === Constants.SAVE_DATASET_RESPONSE) {

        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            hydrated: true,
            redirect: true,
            help: validation.help
        };

        if (action.response.hasOwnProperty('name')) {
            stateUpdates.name = action.response.name;
        }

        return ObjectAssign({}, state, stateUpdates);
    }

    if (action.type === Constants.UPDATE_DATASET) {

        return ObjectAssign({}, state, {
            loading: true,
            title: action.request.data.name,
            identifier: action.request.data.identifier,
            description: action.request.data.description
        });
    }

    if (action.type === Constants.UPDATE_DATASET_RESPONSE) {

        const validation = ParseValidation(action.response);
        const stateUpdates = {
            loading: false,
            showSaveSuccess: !action.err,
            error: validation.error,
            hasError: validation.hasError,
            hydrated: true,
            help: validation.help
        };

        if (action.response.hasOwnProperty('name')) {
            stateUpdates.name = action.response.name;
        }

        return ObjectAssign({}, state, stateUpdates);
    }
    if (action.type === Constants.HIDE_DATASET_SAVE_SUCCESS) {
        return ObjectAssign({}, state, {
            showSaveSuccess: false
        });
    }

    return state;
};


module.exports = reducer;
