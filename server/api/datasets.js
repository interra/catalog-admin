'use strict';
const Async = require('async');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const Dataset = server.plugins['hapi-mongo-models'].Dataset;

    server.route({
        method: 'GET',
        path: '/datasets',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','account']
            },
            validate: {
                query: {
                    name: Joi.string().allow(''),
                    fields: Joi.string(),
                    sort: Joi.string().default('_id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            }
        },
        handler: function (request, reply) {

            const query = {};
            if (request.query.name) {
                query.name = new RegExp('^.*?' + EscapeRegExp(request.query.name) + '.*$', 'i');
            }
            const fields = request.query.fields;
            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;

            // Admins can see everything.
            if (!request.auth.credentials.roles && !request.auth.create.roles.admin && !request.auth.credentials.roles.admin.isMemberOf('admin')) {
                const userId = request.auth.credentials.session.userId;
                query.users = { $in: [userId] };
            }

            Dataset.pagedFind(query, fields, sort, limit, page, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/datasets/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','dataset-{params.id}']
            }
        },
        handler: function (request, reply) {

            const query = { '_id': request.params.id };

            Dataset.findOne(query, (err, dataset) => {

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
        path: '/datasets',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','account']
            },
            validate: {
                payload: {
                    _id: Joi.string().required(),
                    siteId: Joi.string(),
                    name: Joi.string().required(),
                    description: Joi.string().required(),
                    users: Joi.array()
                }
            }
        },
        handler: function (request, reply) {

            const name = request.payload.name;
            const description = request.payload.description;
            const users = request.payload.users;
            const siteId = request.payload.siteId;

            const query = { '_id': request.payload._id };

            Dataset.findOne(query, (err, dataset) => {

                if (dataset) {
                    return reply(Boom.conflict('_id already exists.'));
                }

                if (err) {
                    return reply(err);
                }

                Dataset.create(request.payload._id, name, siteId, description, users, (err, result) => {

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
        path: '/datasets/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','dataset-{params.id}']
            },
            validate: {
                payload: {
                    name: Joi.string().required(),
                    description: Joi.string().required(),
                    users: Joi.array().items()
                }
            }
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const update = {
                $set: {
                    name: request.payload.name,
                    description: request.payload.description,
                    users: request.payload.users
                }
            };

            const query = { '_id': id };

            Dataset.findOneAndUpdate(query, update, (err, dataset) => {

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
        method: 'PUT',
        path: '/datasets/{id}/users',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','dataset-{params.id}']
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

                    Dataset.findOne(query, (err, dataset) => {

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

                    Dataset.findOneAndUpdate(query, update, done);
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
        path: '/datasets/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','dataset-{params.id}']
            }
        },
        handler: function (request, reply) {

            const query = { '_id': request.params.id };

            Dataset.findOneAndDelete(query, (err, dataset) => {

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
