'use strict';
const Async = require('async');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');
const Schema = require('../models/schema');


const internals = {};


internals.applyRoutes = function (server, next) {


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
          const schema = new Schema();

          schema.list((err, list) => {

              if (err) {
                  return reply(err);
              }

              reply(list);
          });

        }
    });

    server.route({
        method: 'GET',
        path: '/schemas/{name}',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','account']
            }
        },
        handler: function (request, reply) {
          const schema = new Schema(request.params.name);

          schema.config((err, config) => {

              if (err) {
                  return reply(err);
              }

              reply(config);
          });

        }
    });

    server.route({
        method: 'GET',
        path: '/schemas/{name}/{collection}',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','account']
            }
        },
        handler: function (request, reply) {
          const schema = new Schema(request.params.name);

          schema.collectionAndSchema(request.params.collection, (err, list) => {

              if (err) {
                  return reply(Boom.notFound(err));
              }

              reply(list);
          });

        }
    });

    server.route({
        method: 'GET',
        path: '/schemas/{name}/uischema',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','account']
            }
        },
        handler: function (request, reply) {
          const schema = new Schema(request.params.name);

          schema.uischema(request.params.collection, (err, list) => {

              if (err) {
                  return reply(Boom.notFound(err));
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
