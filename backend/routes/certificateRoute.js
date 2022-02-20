const express = require("express");
const { mongoSetup, MongoQuery } = require('../../backend/mongo-setup');

const certificateRoute = express.Router();
const collectionName = 'certificates';

function response50X(expressResponse, status, errorCode) {
    expressResponse.status(status).json({
        message: 'Internal Server Error',
        errorCode,
        timestamp: new Date().getTime()
    });
}

function response40X(expressResponse, status, errorCode, message) {
    expressResponse.status(status).json({
        message,
        errorCode,
        timestamp: new Date().getTime()
    });
}

certificateRoute.route('/')
.get((_, res, _2) => {
    mongoSetup(collectionName).then(mongoResponse => {
        MongoQuery.findQuery(mongoResponse.collection, {})
        .then(list => {
            res.status(200).json({
                certificates: list,
                elements: list.length
            });
        })
        .finally(_ => mongoResponse.client.close());
    })
    .catch(_ => response50X(res, 500, 500));
})
.put((req, res, _2) => {
    const certificate = req.body;
    if (certificate['id'] == undefined && certificate['_id'] == undefined) {
        mongoSetup(collectionName).then(mongoResponse => {
            MongoQuery.insertOne(mongoResponse.collection, certificate)
            .then(_ => {
                res.status(201).json({
                    certificate: certificate
                });
            })
            .finally(_ => mongoResponse.client.close());
        })
        .catch(_ => response50X(res, 500, 500));
    } else {
        response40X(res, 400, 400, 'Certificate already contains id');
    }
});

certificateRoute.route('/:id')
.post((req, res, _2) => {
    const certificate = req.body;
    const id = req.params.id;
    mongoSetup(collectionName).then(mongoResponse => {
        MongoQuery.findByIdAndUpdate(mongoResponse.collection, id, certificate)
        .then(_ => {
            res.status(201).json({
                certificate: certificate
            });
        })
        .catch(_ => response50X(res, 500, 500))
        .finally(_ => mongoResponse.client.close());
    })
    .catch(_ => response50X(res, 500, 500));
})
.delete((req, res, _2) => {
    const id = req.params.id;
    mongoSetup(collectionName).then(mongoResponse => {
        MongoQuery.deleteById(mongoResponse.collection, id)
        .then(_ => res.status(204).send())
        .finally(_ => mongoResponse.client.close());
    })
    .catch(_ => response50X(res, 500, 500));
});

module.exports = certificateRoute;