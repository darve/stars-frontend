
'use strict';

var
    express         = require('express'),
    url             = require('url'),
    router          = express.Router();


router.route('/save-data').post(function(req, res){

    res.status(200).send({
        url: 'https://www.google.com/'
    });

});

router.route('/send-message').post(function(req, res){

    res.status(200).send('OK');

});

module.exports = router;
