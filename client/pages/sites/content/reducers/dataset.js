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
    name: "",
    slug: "",
    description: ""
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_DATASET) {
        return ObjectAssign({}, state, {
            loading: true,
            hydrated: false
        });
    }

    if (action.type === Constants.GET_DATASET_RESPONSE) {
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

    if (action.type === Constants.SAVE_DATASET) {
        return ObjectAssign({}, state, {
            loading: true,
            name: action.request.data.name,
            slug: action.request.data._id,
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
            name: action.request.data.name,
            slug: action.request.data._id,
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
