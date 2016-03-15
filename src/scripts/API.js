
'use strict';

var $       = require('jquery'),
    Utils   = require('./modules/Utils.js'),
    q       = require('q');

module.exports = (function() {

    var api = {},
        cfg = window.wagaconfig;

    api.save = function(data) {
        var deferred = new q.defer();

        delete cfg.star;

        $.post('/api/save', {
            'first_name': data.first_name,
            'last_name': data.last_name,
            'email': data.email,
            'xid': cfg.xid,
            'message': data.message,
            'g-recaptcha-response': data['g-recaptcha-response']
        }).then(function(res){
                switch ( Number(res.e) ) {
                    case 0:
                        cfg.xid = res.d.xid;
                        cfg.hash = res.d.hash;
                        deferred.resolve(res.d);
                        break;
                    case -4:
                        deferred.reject('Your message has lost the true spirit of christmas! please remove anything that could be deemed offensive + try again');
                        break;
                    default:
                        deferred.reject('Please ensure you have filled in all of the fields.');
                        break;
                }
            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };

    api.email = function(data) {
        var deferred = new q.defer();

        $.post('/api/send', {
            hash: cfg.hash,
            xid: cfg.xid,
            name: data.name,
            email: data.email
        }).then(function(res){
            deferred.resolve(res);
            if ( Number(res.e) === 0 ) {
                cfg.xid = res.d.xid;
                deferred.resolve(res);
            } else {
                deferred.reject('Please enter a valid email address');
            }
        }, function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    api.closed = function(data) {
        var deferred = new q.defer();

        $.post('/api/add', {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            xid: cfg.xid,
            'g-recaptcha-response': data['g-recaptcha-response']
        }).then(function(res){
                // console.log(res);
                switch ( Number(res.e) ) {
                    case 0:
                        cfg.xid = res.d.xid;
                        cfg.hash = res.d.hash;
                        deferred.resolve(res.d);
                        break;
                    default:
                        deferred.reject('Please ensure you have filled in all of your contact details and message');
                        break;
                }
            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };

    return api;

})();
