'use strict';
const Constants = require('../constants');
const ObjectAssign = require('object-assign');


const initialState = {
    hydrated: false,
    loading: false,
    requested: false,
    error: undefined,
    schema: {},
    formData:{},
    uiSchema: {}
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.CLEAR_DATA) {
        return ObjectAssign({}, initialState);
    }

    if (action.type === Constants.UPDATE_FORM_DATA) {
        return ObjectAssign({}, state.formData, action.formData);
    }

    return state;
};


module.exports = reducer;
