const express = require("express");
const certificateData = require("../db/certificateData");

const { mongoSetup, getObjectId, findQuery, insertOne, findByIdAndUpdate, deleteById } = require('../../backend/mongo-setup');

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
        findQuery(mongoResponse.collection, {})
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
            insertOne(mongoResponse.collection, certificate)
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
        findByIdAndUpdate(mongoResponse.collection, id, certificate)
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
        deleteById(mongoResponse.collection, id)
        .then(_ => res.status(204).send())
        .finally(_ => mongoResponse.client.close());
    })
    .catch(_ => response50X(res, 500, 500));
});

module.exports = certificateRoute;

/*
{
    "id": 2,
    "title": "Kotlin for Java Developers",
    "organization": {
        "name": "JetBrains | Coursera",
        "imageUrl": "https: //media-exp1.licdn.com/dms/image/C4D0BAQHIXTZd-0TR_A/company-logo_100_100/0/1576240838903?e=1650499200&v=beta&t=5MIIJWm4ORmWfPj_DdvBkxkwfhdoM-gWoXyov4s2BQ0"
    },
    "issueDate": "May 2020",
    "credential": {
        "id": "45E27LJ8TNPP",
        "url": "https: //www.coursera.org/account/accomplishments/certificate/45E27LJ8TNPP"
    }
}
*/