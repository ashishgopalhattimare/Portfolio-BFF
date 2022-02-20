const express = require("express");
const certificateData = require("../db/certificateData");

const certificateRoute = express.Router();

certificateRoute.route('/')
.get((_, res, _2) => {
    const list = certificateData.certificateList;
    res.status(200).json({
        certificates: list,
        elements: list.length
    });
})
.put((req, res, _2) => {
    const certificate = req.body;
    
    if (certificate['id'] == undefined) {
        const list = certificateData.certificateList;
        certificate['id'] = list.length;
        list.push(certificate);

        res.status(201).json({
            certificate: certificate
        });
    } else {
        res.status(400).json({
            message: 'Certificate already contains id',
            errorCode: 400,
            timestamp: new Date().getTime()
        });
    }
});

certificateRoute.route('/:id')
.post((req, res, _2) => {
    const certificate = req.body;
    const id = parseInt(req.params.id);
    const list = certificateData.certificateList;

    const index = list.findIndex(x => x.id === id);
    if (index == -1 || certificate['id'] != index) {
        res.status(404).json({
            message: `Certificate invalid`,
            errorCode: 400,
            timestamp: new Date().getTime()
        });
    } else {
        list[index] = certificate;
        res.status(201).json({
            message: 'Certificate has been updated successfully',
            timestamp: new Date().getTime()
        });
    }
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