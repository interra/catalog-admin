'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../helpers/parse-validation');


const initialState = {
    hydrated: false,
    loading: false,
    showSaveSuccess: false,
    showFetchFailure: false,
    error: undefined,
    proc: "edit",
    hasError: {},
    help: {},
    schema: "simple",
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

    if (action.type.name === Constants.GET_SITE_RESPONSE.name) {

        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            hydrated: true,
            error: validation.error,
            hasError: validation.hasError,
            showFetchFailure: validation.error ? true : false,
            help: validation.help,
            name: action.response.name,
            slug: action.response._id,
            schema: action.response.schema,
            description: action.response.description
        });
    }

    if (action.type === Constants.SAVE_SITE) {
        console.log("aaaaa". action);
        return ObjectAssign({}, state, {
            loading: true,
            name: action.request.data.name,
            slug: action.request.data._id,
            schema: action.request.data.schema,
            description: action.request.data.description
        });
    }

    if (action.type === Constants.SAVE_SITE_RESPONSE) {

        console.log(action.response);


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

    if (action.type === Constants.UPDATE_SITE) {

        return ObjectAssign({}, state, {
            loading: true,
            name: action.request.data.name,
            schema: action.request.data.schema,
            slug: action.request.data._id,
            description: action.request.data.description
        });
    }

    if (action.type === Constants.UPDATE_SITE_RESPONSE) {

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
    if (action.type === Constants.HIDE_SITE_SAVE_SUCCESS) {
        return ObjectAssign({}, state, {
            showSaveSuccess: false
        });
    }

    return state;
};


module.exports = reducer;
