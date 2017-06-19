'use strict';
const Async = require('async');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');
const Config = require('../../config');
const Storage = require('../models/content');
const fs = require('fs-extra');

const internals = {};


internals.applyRoutes = function (server, next) {

    const Dataset = server.plugins['hapi-mongo-models'].Content;

    server.route({
        method: 'GET',
        // 'sites/{sideId}/contents/{collection}'
        path: '/sites/{siteId}/contents',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','site-{params.siteId}']
            },
            validate: {
                query: {
                    title: Joi.string().allow(''),
                    fields: Joi.string(),
                    sort: Joi.string().default('_id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            }
        },
        handler: function (request, reply) {

            const query = {};
            if (request.query.title) {
                query.title = new RegExp('^.*?' + EscapeRegExp(request.query.title) + '.*$', 'i');
            }

            const fields = request.query.fields;
            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;
            const store = Config.get('/storage');

            const storage = new Storage['Mongo'](request.params.siteId);

            storage.pagedFind(query, fields, sort, limit, page, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/sites/{siteId}/contents/titles',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','site-{params.siteId}']
            },
            validate: {
                query: {
                    type: Joi.string().default('')
                }
            }
        },
        handler: function (request, reply) {

            const store = Config.get('/storage');
            const storage = new Storage['Mongo'](request.params.siteId);
            let type = "";


            if (typeof(request.query.type) != 'undefined') {
                  type = request.query.type;
            }

            storage.titles(type, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/sites/{siteId}/contents/count',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','site-{params.siteId}']
            },
            validate: {
                query: {
                    type: Joi.string().default('')
                }
            }
        },
        handler: function (request, reply) {

            const store = Config.get('/storage');
            const storage = new Storage['Mongo'](request.params.siteId);
            const type = '';

//            if (typeof(request.payload.type) !== 'undefined') {
  //              const type = request.payload.type;
    //        }

            storage.count(type, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/sites/{siteId}/contents/{type}/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','site-{params.siteId}']
            }
        },
        handler: function (request, reply) {

            const query = { '_id': request.params.id, 'siteId': request.params.siteId };
            const store = Config.get('/storage');
            const identifier = request.params.id;
            const type = request.params.type;
            const storage = new Storage['Mongo'](request.params.siteId);
            storage.findByIdentifier(identifier, type, (err, dataset) => {

                if (err) {
                    return reply(err);
                }

                if (!dataset) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(dataset);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/sites/{siteId}/contents',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','account']
            },
            validate: {
                payload: {
                    collection: Joi.string().required(),
                    content: Joi.object().required()
                }
            }
        },
        handler: function (request, reply) {

            const siteId = request.params.siteId;
            const content = request.payload.content;
            const type = request.payload.collection;

            if (typeof(content.identifier) === undefined) {
                reply(Boom.badRequest('identifier is required'));
            }

            const store = Config.get('/storage');
            const storage = new Storage['Mongo'](siteId);

            storage.findByIdentifier(content.identifier, type, (err, item) => {

                if (item) {
                    return reply(Boom.conflict('identifier already exists.'));
                }

                if (err) {
                    return reply(err);
                }

                storage.insertOne(content.identifier, type, content, (err, result) => {

                    if (err) {
                        return reply(err);
                    }

                    reply(result);
                });
            });
        }
    });

    server.route({
        method: 'PUT',
        path: '/sites/{siteId}/contents/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','site-{params.siteId}']
            },
            validate: {
                payload: {
                  collection: Joi.string().required(),
                  content: Joi.object().required()
                }
            }
        },
        handler: function (request, reply) {

            const identifier = request.params.id;
            const update = request.payload.content;
            const type = request.payload.collection;

            const store = Config.get('/storage');
            const storage = new Storage['Mongo'](request.params.siteId);

            storage.findOneByIdentifierAndUpdate(identifier, type, update, (err, content) => {

                if (err) {
                    return reply(err);
                }

                if (!content) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(content);
            });
        }
    });

    server.route({
        method: 'PUT',
        path: '/sites/{siteId}/contents/{id}/users',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','site-{params.siteId}']
            },
            validate: {
                payload: {
                    users: Joi.array()
                }
            },
            pre: [{
                assign: 'dataset',
                method: function (request, reply) {

                    const query = { '_id': request.params.id };
                    const store = Config.get('/storage');
                    const storage = new Storage['Mongo'](store.FileStorageDir, request.params.siteId);

                    storage.findOne(query, (err, dataset) => {

                        if (err) {
                            return reply(err);
                        }

                        if (!dataset) {
                            return reply(Boom.notFound('Document not found.'));
                        }

                        reply(dataset);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            Async.auto({
                dataset: function (done) {

                    const id = request.params.id;
                    const users = request.payload.users;
                    const update = {
                        $set: {
                            users
                        }
                    };

                    const query = { '_id': id };
                    const store = Config.get('/storage');
                    const storage = new Storage['Mongo'](store.FileStorageDir, request.params.siteId);

                    storage.findOneAndUpdate(query, update, done);
                }
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results.dataset);
            });
        }
    });

    server.route({
        method: 'DELETE',
        path: '/sites/{siteId}/contents/{type}/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','site-{params.siteId}']
            }
        },
        handler: function (request, reply) {

            const identifier = request.params.id;
            const type = request.params.type;

            const store = Config.get('/storage');
            const storage = new Storage['Mongo'](request.params.siteId);

            storage.findOneByIdentifierAndDelete(identifier, type, (err, dataset) => {

                if (err) {
                    return reply(err);
                }

                if (!dataset) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'dataset'
};
