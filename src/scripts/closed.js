/* globals FB, grecaptcha */

'use strict';

var
    // Vendor dependencies
    $           = require('jquery'),

    // Application modules
    Utils       = require('./modules/Utils'),
    API         = require('./API.js'),
    Tracking    = require('./Tracking.js');

    require('es5-shim');

    window.jQuery = $;

(function(win, doc) {

    var _ = {
            first_name: '',
            last_name: '',
            email: ''
        },

        resizetimer;

    function init() {
        listeners();
    }

    /**
     * Update the form fields with the contact details we have in memory
     */
    function sync() {
        $('.competition-closed-form .text').each(function(i, v){
            var $this = $(this);
            $this.val(_[v.name]);
        });
    }

    function save() {

        $('.competition-closed-form .text').each(function(i, v){
            if ( 'name' in v ) {
                _[v.name] = $(this).val();
            }
        });
    }

    function formSubmit(e) {
        e.preventDefault();
    }

    function formSubmitClicked(e) {
        e.preventDefault();

        $(e.target).parent().addClass('loading');

        if ( validateForm($('.competition-closed-form')[0]) === true ) {
            save();
            API.closed(_).then(function(response) {
                Tracking.track('Newsletter Sign-up', 'Success');
                console.log('%cSuccess', 'color:green', response);
                success();
            }, function(response) {
                console.log('%cError:', 'color:red', response);
            });
        } else {
            $(e.target).parent().removeClass('loading');
        }
    }

    function success() {
        $('.view-top').addClass('faded');
        $('.thank-you').removeClass('faded');
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
     * The window has been resized - delegate tasks to the other modules
     */
    function resize(e) {
        window.clearTimeout(resizetimer);
        resizetimer = setTimeout(function() {
        }, 60);
    }

    function orientationchanged(e) {
        console.log('wahey!');
    }

    function tracklink(e) {
        Tracking.track('Outbound Link', e.target.href);
    }

    /**
     * Hook up some event listeners for user interaction
     */
    function listeners() {
        $(document).on('click', '.competition-closed-form-submit', formSubmitClicked)
            .on('submit', '.competition-closed-form', formSubmit)
            .on('click', '.outbound-link', tracklink);

        if ( 'onorientationchange' in window ) {
            $(window).on('onorientationchange', orientationchanged);
        } else {
            $(window).on('resize', resize);
        }
    }

    window.captchaloaded = function() {
        grecaptcha.render($('.g-recaptcha')[0], {
            'sitekey': window.wagaconfig.captcha_key,
            callback: function(res) {
                _['g-recaptcha-response'] = res;
            }
        });
    };

    $(init);

})(window,document,document.querySelectorAll('canvas')[0]);
