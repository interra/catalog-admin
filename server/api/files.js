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

    // Possibly replace with "inert".
    server.route({
        method: 'GET',
        path: '/files/{siteId}/{id}',
        handler: function (request, reply) {
            const store = Config.get('/storage');

            var directory = __dirname.replace("server/api","") + store.FileStorageDir + '/' + request.params.siteId + '/files'
            var name = request.params.id;
            var path = directory + '/' + name;

            // Check if file specified by the filePath exists
            fs.exists(path, function(exists){
                if (exists) {
                    reply.file(path);
                } else {
                    return reply(Boom.notFound('Document not found.'));
                }
            });
        }
    });



    server.route({
        method: 'POST',
        path: '/files/{siteId}',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','site-{params.siteId}']
            },
            payload: {
                output: 'stream',
                parse: true,
                maxBytes: 1001001000,
                allow: 'multipart/form-data'
            }
        },
        handler: function (request, reply) {
            var data = request.payload;

            // TODO: Move this to a model.
            if (data.file) {
                const store = Config.get('/storage');
                const url = Config.get('/baseUrl');

                var directory = __dirname.replace("server/api","") + store.FileStorageDir + '/' + request.params.siteId + '/files'
                var name = data.file.hapi.filename;
                var path = directory + '/' + name;

                fs.ensureDir(directory, err => {
                    if (err) {
                        reply(Boom.badImplemenation("Unable to write file"));
                    }
                    fs.pathExists(path, (err, exists) => {
                        // TODO: This should increment by one and recursively
                        // look until there is a free name.
                        if (exists) {
                            name = name.split('.')[0] + '_' + Math.floor(Math.random() * (100000 - 1)) + 1 + '.' + name.split('.')[1];
                            path = directory + '/' + name;
                        }

                        var file = fs.createWriteStream(path);

                        file.on('error', function (err) {
                            console.error("this is an error", err)
                        });

                        data.file.pipe(file);

                        data.file.on('end', function (err) {
                            var ret = {
                                filename: name,
                                url: url + '/api/files/' + request.params.siteId + '/' + name,
                                headers: data.file.hapi.headers
                            }
                            reply(JSON.stringify(ret));
                        })

                    });

                })

            }
            else {
                reply(Boom.badRequest('file not included'));
            }
        }

    });

    server.route({
        method: 'DELETE',
        path: '/files/{siteId}/{id}',
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
    name: 'files'
};
