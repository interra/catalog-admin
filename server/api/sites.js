'use strict';
const Async = require('async');
const AuthPlugin = require('../auth');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const Site = server.plugins['hapi-mongo-models'].Site;
    const User = server.plugins['hapi-mongo-models'].User;

    server.route({
        method: 'GET',
        path: '/sites',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
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

            Site.pagedFind(query, fields, sort, limit, page, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/sites/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            const query = { '_id': request.params.id };

            Site.findOne(query, (err, site) => {

                if (err) {
                    return reply(err);
                }

                if (!site) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(site);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/sites',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    _id: Joi.string().required(),
                    name: Joi.string().required(),
                    description: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const name = request.payload.name;
            const description = request.payload.description;

            const query = { '_id': request.payload._id };

            Site.findOne(query, (err, site) => {
              if (site) {
                return reply(Boom.conflict('_id already exists.'));
              }
              else {
                Site.create(request.payload._id, name, description, (err, site) => {

                    if (err) {
                        return reply(err);
                    }

                    reply(site);
                });

              }
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/sites/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                  name: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const update = {
                $set: {
                    name: request.payload.name,
                    description: request.payload.description
                }
            };

            const query = { '_id': id };

            Site.findOneAndUpdate(query, update, (err, site) => {

                if (err) {
                    return reply(err);
                }

                if (!site) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(site);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/sites/{id}/user',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    username: Joi.string().lowercase().required()
                }
            },
            pre: [{
                assign: 'site',
                method: function (request, reply) {

                    Site.findById(request.params.id, (err, site) => {

                        if (err) {
                            return reply(err);
                        }

                        if (!site) {
                            return reply(Boom.notFound('Document not found.'));
                        }

                        reply(site);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            Async.auto({
                site: function (done) {

                    const id = request.params.id;
                    const update = {
                        $set: {
                            user: {
                                id: request.pre.user._id.toString(),
                                name: request.pre.user.username
                            }
                        }
                    };

                    Site.findByIdAndUpdate(id, update, done);
                }
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results.site);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/sites/{id}/user',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [{
                assign: 'site',
                method: function (request, reply) {

                    Site.findById(request.params.id, (err, site) => {

                        if (err) {
                            return reply(err);
                        }

                        if (!site) {
                            return reply(Boom.notFound('Document not found.'));
                        }

                        reply(site);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            Async.auto({
                site: function (done) {

                    const id = request.params.id;
                    const update = {
                        $unset: {
                            user: undefined
                        }
                    };

                    Site.findByIdAndUpdate(id, update, done);
                }
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results.site);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/sites/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            const query = { '_id': request.params.id };

            Site.findByIdAndDelete(query, (err, site) => {

                if (err) {
                    return reply(err);
                }

                if (!site) {
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
    name: 'site'
};
