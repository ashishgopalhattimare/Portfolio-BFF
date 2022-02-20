const express = require("express");
const certificateData = require("../db/certificateData");

const { mongoSetup, getObjectId, findQuery, insertOne, findOneAndReplace } = require('../../backend/mongo-setup');

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
            .then(response => {
                console.log('new certificate added : ', response, certificate);
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
        findOneAndReplace(mongoResponse.collection, { '_id': getObjectId(id) }, certificate)
        .then(response => {
            console.log('updated : ', response);
            res.status(201).json({
                certificate: certificate
            });
        })
        .catch(err => {
            console.log(err);
            response50X(res, 500, 500);
        })
        .finally(_ => mongoResponse.client.close());
    })
    .catch(err => {
        console.log(err);
        response50X(res, 500, 500);
    });
})
.delete((req, res, _2) => {
    const id = parseInt(req.params.id);
    const list = certificateData.certificateList;

    const index = list.findIndex(x => x.id === id);
    if (index == -1) {
        res.status(404).json({
            message: `Certificate invalid`,
            errorCode: 400,
            timestamp: new Date().getTime()
        });
    } else {
        list.splice(index, 1);
        res.status(204).send();
    }
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