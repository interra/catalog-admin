'use strict';
const Async = require('async');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');
const Schema = require('../models/schema');


const internals = {};


internals.applyRoutes = function (server, next) {

    const schema = new Schema();

    server.route({
        method: 'GET',
        path: '/schemas',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','account']
            }
        },
        handler: function (request, reply) {

          schema.list((err, list) => {

              if (err) {
                  return reply(err);
              }

              reply(list);
          });

        }
    });

    next();
};


exports.register = function (server, options, next) {

    server.dependency(['auth','schema'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'schemas'
};
