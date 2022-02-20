const express = require("express");
const { mongoSetup, MongoQuery, PrimaryKeyParser } = require('../../backend/mongo-setup');

const certificateRoute = express.Router();
const collectionName = 'certificates';

function response50X(error, expressResponse, status, errorCode) {
    expressResponse.status(status).json({
        message: 'Internal Server Error',
        errorCode,
        timestamp: new Date().getTime(),
        crashLog: JSON.stringify(error)
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
                certificates: list.map(x => PrimaryKeyParser.convertUnderscoreId2Id(x)),
                elements: list.length
            });
        })
        .finally(_ => mongoResponse.client.close());
    })
    .catch(error => response50X(error, res, 500, 5001));
})
.put((req, res, _2) => {
    const certificate = PrimaryKeyParser.convertId2UnderscoreId(req.body);
    if (certificate['_id'] == undefined) {
        mongoSetup(collectionName).then(mongoResponse => {
            MongoQuery.insertOne(mongoResponse.collection, certificate)
            .then(_ => {
                res.status(201).json({
                    certificate: PrimaryKeyParser.convertUnderscoreId2Id(certificate)
                });
            })
            .finally(_ => mongoResponse.client.close());
        })
        .catch(error => response50X(error, res, 500, 5001));
    } else {
        response40X(res, 400, 400, 'Certificate already contains id');
    }
});

certificateRoute.route('/:id')
.post((req, res, _2) => {
    const certificate = PrimaryKeyParser.convertId2UnderscoreId(req.body);
    const id = req.params.id;
    mongoSetup(collectionName).then(mongoResponse => {
        MongoQuery.findByIdAndUpdate(mongoResponse.collection, id, certificate)
        .then(_ => {
            res.status(201).json({
                certificate: PrimaryKeyParser.convertUnderscoreId2Id(certificate)
            });
        })
        .catch(error => response50X(error, res, 500, 500))
        .finally(_ => mongoResponse.client.close());
    })
    .catch(error => response50X(error, res, 500, 5001));
})
.delete((req, res, _2) => {
    const id = req.params.id;
    mongoSetup(collectionName).then(mongoResponse => {
        MongoQuery.deleteById(mongoResponse.collection, id)
        .then(_ => res.status(204).send())
        .finally(_ => mongoResponse.client.close());
    })
    .catch(error => response50X(error, res, 500, 5001));
});

module.exports = certificateRoute;