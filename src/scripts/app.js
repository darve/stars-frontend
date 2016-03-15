/* globals FB, jQuery, grecaptcha */

'use strict';

var
    // Vendor dependencies
    $           = require('jquery'),
    satnav      = require('satnav'),

    // Application modules
    Utils       = require('./modules/Utils'),
    Tree        = require('./Tree.js'),
    API         = require('./API.js'),
    View        = require('./View.js'),
    Tracking    = require('./Tracking.js');

    // Global imports
    require('./Social.js');
    require('./Views.js');
    require('es5-shim');

    window.Tree = Tree;
    window.jQuery = $;

    require('placeholder-shim');

(function(win, doc) {

    var _ = {
            first_name: '',
            last_name: '',
            email: ''
        },

        colors = ['white', 'red', 'grey'],
        treecolor = Utils.rand(colors),
        url = '',

        /**
         * This is used to track which parts of the site a user has seen
         */
        journey = {

            last: null,

            home: false,
            enter: false,
            decorate: false,
            share: false,
            thankyou: false,
            star: false,
            terms: false,

            connected_facebook: false,
            shared_facebook: false,
            shared_email: false
        },

        resizetimer;

    function init() {
        if ( 'hash' in window.wagaconfig.star ) {
            navigate('star/', function() { return true; });
        }

        satnav({
            force: true,
        }).change(function(hash, params, old) {
        }).navigate({
            path: '',
            directions: function(params) {
                Tracking.track('User Journey', '/');
                Tree.killtimers();
                journey.last = 'home/';
                Tree.reset();
                View.load('home', params, false, false).then(function(height){
                    if ( journey.home === false ) {
                        Tree.homepage(function() {
                            View.show();
                            journey.home = true;
                        });
                    } else {
                        Tree.addtimer(1, function() { Tree.reset(); });
                        Tree.addtimer(1, function() { View.show(); });
                        Tree.scrollToTop();
                    }
                });
            }
        }).navigate({
            path: 'enter/',
            directions: function(params) {
                Tracking.track('User Journey', 'enter/');
                Tree.killtimers();
                journey.last = 'enter/';
                Tree.reset();
                View.load('enter', { captcha_key: window.wagaconfig.captcha_key }, false, true).then(function(height) {
                    sync();
                    Tree.scrollToTop();
                    jQuery.placeholder.shim();
                    if ( journey.enter === true ) {
                        Tree.addtimer(1, function() { Tree.queue('home'); });
                        Tree.addtimer(1, function() { Tree.queue('zoomin'); });
                        Tree.addtimer(1, function() { Tree.queue('starposted'); });
                        Tree.addtimer(1, function() { Tree.queue('hidebucket'); });
                    } else {
                        View.show();
                    }
                });
            }
        }).navigate({
            path: 'decorate/',
            directions: function(params) {
                authorise(function() {
                    Tracking.track('User Journey', 'decorate/');
                    Tree.killtimers();
                    journey.last = 'decorate/';
                    Tree.scrollToTop();
                    View.load('decorate', window.wagaconfig, false, false).then(function(height) {
                        if ( journey.decorate === false ) {
                            Tree.decoratepage(function() {
                                recaptcha();
                                View.show();
                                jQuery.placeholder.shim();
                            });
                        } else {
                            navigate('share/', function() { return true; });
                        }
                    });
                });
            }
        }).navigate({
            path: 'share/',
            directions: function(params) {
                authorise(function() {
                    Tracking.track('User Journey', 'share/');
                    Tree.killtimers();
                    journey.last = 'share/';
                    View.load('share', params, false, false).then(function(height) {
                        if ( journey.share === false ) {
                            Tree.sharepage(function() {
                                View.show();
                                Tree.addtimer(1, function() { Tree.queue('hidebucket'); });
                                Tree.addtimer(1, function() { Tree.queue('explode'); });
                                journey.share = true;
                            });
                        } else {
                            View.show();
                        }
                    });
                });
            }
        }).navigate({
            path: 'share/facebook/',
            directions: function(params) {
                authorise(function() {
                    Tracking.track('User Journey', 'share/facebook/');
                    journey.shared_facebook = true;
                    journey.last = 'share/facebook/';
                    Tree.reset();
                    View.load('share-facebook', params, false, true);
                });
            }
        }).navigate({
            path: 'share/email/',
            directions: function(params) {
                authorise(function() {
                    Tracking.track('User Journey', 'share/email/');
                    journey.shared_email = true;
                    journey.last = 'share/email/';
                    Tree.reset();
                    View.load('share-email', params, false, true).then(function(height){
                        jQuery.placeholder.shim();
                    });
                });
            }
        }).navigate({
            path: 'thank-you/',
            directions: function(params) {
                authorise(function() {
                    if ( journey.star === true ) Tracking.track('Sharing', 'User Shared A Star After Receiving A Star');
                    Tracking.track('User Journey', 'thank-you/');
                    Tracking.track('Sharing', 'Star Successfully Shared');
                    journey.thankyou = true;
                    Tree.killtimers();
                    journey.last = 'thank-you/';
                    View.load('thank-you', window.wagaconfig, false, true).then(function(height) {
                        Tree.thankyoupage(function() {

                        });
                    });
                });
            }
        }).navigate({
            path: 'star/',
            directions: function(params){
                if ( 'hash' in  window.wagaconfig.star) {
                    if ( journey.last !== 'star/' ) {
                        Tracking.track();
                        Tracking.track('Star Viewed', window.wagaconfig.star.hash);
                        journey.star = true;
                        Tree.killtimers();
                        journey.last = 'star/';
                        View.load('star', window.wagaconfig, false, false).then(function(height) {
                            Tree.addtimer(1, function() { Tree.nudge(0); });
                            Tree.addtimer(30, function() { Tree.queue('home'); });
                            Tree.addtimer(100, function() { Tree.queue('showbucket'); });
                            Tree.addtimer(200, function() { Tree.queue('starshowing'); });
                            Tree.addtimer(201, function() { Tree.queue('zoomout'); });
                            Tree.addtimer(201, function() { Tree.queue('hidebucket'); });
                            Tree.addtimer(360, function() { View.show(); });
                        });
                    }
                } else {
                    navigate('', function() { return true; });
                }
            }
        }).navigate({
            path: 'terms/',
            directions: function(params) {
                Tree.scrollToTop();
                Tracking.track();
                journey.terms = true;
                View.load('terms', params, false, true);
            }
        }).navigate({
            path: 'restart/',
            directions: function(params) {
                View.hide();
                Tree.addtimer(1, Tree.starposted);
                Tree.addtimer(60, function() {
                    resetjourney();
                    Tree.reset();
                    navigate('', function() { return true; });
                });
            }
        }).go();
        listeners();
    }

    /**
     * Update the form fields with the contact details we have in memory
     */
    function sync() {
        $('.enter-form .text').each(function(i, v){
            var $this = $(this);
            $this.val(_[v.name]);
            $this.trigger('blur');
        });
    }

    /**
     * Update the contact details we have in memory with the contents of
     * the form fields.
     * 1. Iterate through all the text fields on the entry form
     * 2. Get the corresponding value from out _ object which contains user data
     */
    function save() {
        $('.enter-form .text').each(function(i, v){
            if ( 'name' in v ) {
                _[v.name] = $(this).val();
            }
        });
    }

    function recaptcha() {
        grecaptcha.render($('.g-recaptcha')[0], {
            'sitekey': window.wagaconfig.captcha_key,
            callback: function(res) {
                _['g-recaptcha-response'] = res;
            }
        });
    }

    /**
     * Attempt to connect the user to the Facebook app.
     */
    function facebookConnect(e) {
        e.preventDefault();

        $(e.target).parent().addClass('loading');

        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                getFacebookInfo();
                journey.connected_facebook = true;
            }
            else {
                FB.login(function(response){
                    getFacebookInfo();
                    journey.connected_facebook = true;
                }, { scope: 'public_profile,email,user_friends  ' });
            }
            if ( journey.connected_facebook === false ) {
                Tracking.track('Login', 'User Logged In Via Facebook');
            }
            $(e.target).parent().removeClass('loading');
        });
    }

    /**
     * Request the user's name and email address information from Facebook
     */
    function getFacebookInfo() {
        FB.api('/me?fields=id,name,email,first_name,last_name', function(response) {
            if ( response && !response.error ) {
                _.first_name = response.first_name;
                _.last_name = response.last_name;
                _.email = response.email;
                sync();
                validateForm($('.enter-form')[0]);
            }
        });
    }

    function shareStar(e) {
        e.preventDefault();

        navigate('share/facebook/', function() { return true; });

        FB.ui({
            method: 'share',
            href: url,
            name: '#wagamamastar',
            description: window.wagaconfig.fb_share_copy
        }, function(response){
            if ( response === undefined || 'error_code' in response ) {
                navigate('share/', function() { return true; });
            } else {
                Tracking.track('Sharing', 'Star Shared By Facebook');
                navigate('thank-you/', function() { return true; });
            }
        });
    }

    /**
     * Share wagamamastar.com to the user's facebook wall.
     */
    function shareSite(e) {
        FB.ui({
            method: 'share',
            href: 'http://wagamamastar.com'
        }, function(response) {
            if ( response !== undefined ) {
                Tracking.track('Sharing', 'Site Successfully Shared By Facebook');
            }
        });
    }

    /**
     * We only want the forms to be submitted by a click / tap on the submit buttons.
     */
    function preventFormSubmit(e) {
        e.preventDefault();
    }

    function enterFormSubmit(e) {
        e.preventDefault();
        $(e.target).parent().addClass('loading');
        if ( validateForm($('.enter-form')[0]) === true ) {
            save();
            journey.enter = true;
            navigate('decorate/', function() { return true; });
        } else {
            $(e.target).parent().removeClass('loading');
        }
    }

    function decorateFormSubmit(e) {
        e.preventDefault();

        var $this = $(e.target).parent();
        _.message = $('.decorate-message').val();

        if ( _.message.length < 1 ) {
            View.error({
                title: 'Error.',
                message: 'Please add your festive message to the star.',
                button: 'OK'
            });
        } else {
            $this.addClass('loading');
            API.save(_).then(function(response) {
                url = response.link;
                journey.decorate = true;
                navigate('share/', function() { return true; });
            }, function(response){
                grecaptcha.reset();
                View.error({
                    title: 'Oops.',
                    message: response,
                    button: 'OK'
                });
                $this.removeClass('loading');
            });
        }
    }

    function emailShare(e) {
        e.preventDefault();

        var $this = $(e.target).parent(),
            name = $('.email-share-name').val(),
            email = $('.email-share-address').val();

        if ( validateForm($('.share-email-form')) === true ) {
            API.email({ name: name, email: email}).then(function(response) {
                Tracking.track('Sharing', 'Successfully Shared By Email');
                navigate('thank-you/', function() { return true; });
            }, function(response) {
            });
        }
    }

    function validateForm(form) {
        var $inputs = $('input', form),
            $rows = $('.row', form),
            valid = true,
            test;

        $inputs.each(function(i, v) {
            test = Utils.validate(v);
            $rows.eq(i)[ test ? 'removeClass' : 'addClass']('error');
            valid = test ? valid : false;
        });

        return valid;
    }

    /**
     * Change the route if a condition is met.
     */
    function navigate(hash, condition, fail) {
        if ( condition() === true ) {
            window.location.hash = hash;
        } else {
            fail();
        }
    }

    /**
     * Used in the routing - if there are no valid contact details present
     * then we should not let them complete the journey and we should redirect them to
     * the start of the app. When the page loads we need to check for valid details
     */
    function authorise(callback) {

        var valid = true;

        for ( var i in _ ) {
            valid = _[i] !== '' ? valid : false;
        }

        if ( valid === false && _ !== undefined ) {
            navigate('/', function() { return true; });
        } else {
            callback();
        }
    }

    /**
     * Used to monitor how long a star messages is.
     */
    function checkMessageLength(e) {
        var $this = $(e.target),
            txt = $this.val();

        if ( txt.length > 80 ) {
            $this.val( txt.substring(0, 80) );
            $this.addClass('shake');
            Tree.addtimer(30, function() { $this.removeClass('shake'); });
        }

    }

    /**
     * Reset the status of our user journey
     * keeping certain parts as they were for tracking reasons.
     */
    function resetjourney() {
        journey.home = false;
        journey.enter = false;
        journey.decorate = false;
        journey.share = false;
        journey.thankyou = false;
        journey.terms = false;
    }

    function closeterms() {
        history.go(-1);
    }

    /**
     * The window has been resized - delegate tasks to the other modules
     */
    function resize(e) {
        window.clearTimeout(resizetimer);
        resizetimer = setTimeout(function() {
            Tree.sync(View.sync());
        }, 200);
    }

    function orientationchanged(e) {
        View.rotate(window.orientation || 0);
    }

    function tracklink(e) {
        Tracking.track('Outbound Link', e.target.href);
    }

    /**
     * Hook up some event listeners for user interaction
     */
    function listeners() {
        $(document)
            .on('click', '.enter-facebook-connect', facebookConnect)
            .on('click', '.decorate-form-submit', decorateFormSubmit)
            .on('click', '.enter-form-submit', enterFormSubmit)
            .on('click', '.facebook-share-button, .share-facebook-link', shareStar)
            .on('click', '.share-site-facebook', shareSite)
            .on('click', '.email-share-button', emailShare)
            .on('click', '.terms-close-button', closeterms)
            .on('click', '.outbound-link', tracklink)
            .on('click', '.branding', function(e) {
                e.preventDefault();
                window.location.reload();
            })

            .on('submit', 'form', preventFormSubmit)
            .on('keyup', 'textarea.decorate-message', checkMessageLength);

        if ( 'onorientationchange' in window ) {
            window.onorientationchange = orientationchanged;
        } else {
            $(window).on('resize', resize);
        }
    }

    $(init);

})(window,document,document.querySelectorAll('canvas')[0]);
