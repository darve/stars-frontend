
'use strict';

var $       = require('jquery'),
    q       = require('q'),
    Utils   = require('./modules/Utils.js');

module.exports = (function() {

    var
        $views = $('.view'),
        $viewtop = $('.view-top'),
        $viewbottom = $('.view-bottom'),
        $viewmodal = $('.view-modal'),
        $viewmodalbg = $('.view-modal-bg'),

        transition = 650,
        timer,

        // rotate_img = new Image('/static_assets/img/rotate-device.gif'),

        vw,vh,

        temptop,
        tempbottom,
        tempmodal;

    /**
     *
     */
    function load(t, params, modal, appear) {

        var deferred = new q.defer();

        // Modal content check
        if ( modal === true ) {
            tempmodal = t + '-modal.html';
            if ( tempmodal in window.WAG ) $viewmodal.html(window.WAG[tempmodal](params));
            showmodal();
        } else {
            hidemodal();
            out().then(function() {
                // console.log(t);
                if ( t === 'terms' ) {
                    $('.terms-close-button').removeClass('faded');
                } else {
                    $('.terms-close-button').addClass('faded');
                }
                // Regular content sections
                temptop = t + '-top.html';
                // tempbottom = t + '-bottom.html';
                var $content = $(window.WAG[temptop](params));
                if ( temptop in window.WAG ) $viewtop.append(window.WAG[temptop](params));
                // if ( tempbottom in window.WAG ) $viewbottom.append(window.WAG[tempbottom](params));
                // $('input.auto-select').focus();

                // sync();
                if (appear === true) show();
                deferred.resolve($('.section', $viewtop).innerHeight()-60);

            });
        }

        return deferred.promise;
    }

    function showmodal(content) {
        $viewmodalbg.addClass('show');
        $viewmodal.addClass('show');
    }

    function hidemodal() {
        $viewmodalbg.removeClass('show');
        $viewmodal.removeClass('show');
    }

    function error(data) {
        // console.log(data);
        $viewmodal.append(window.WAG['error-modal.html'](data));
        showmodal();
    }

    function out() {
        var deferred = new q.defer();
        hide();

        timer = setTimeout(function() {
            $views.html('');
            deferred.resolve();
        }, transition);
        return deferred.promise;
    }

    function hide() {
        $views.addClass('faded');
    }

    function show(v) {

        if ( !v ) {
            // $viewtop.css('height', $viewtop.find('.inner').outerHeight());
            $views.removeClass('faded');
        } else if ( v === 'top' ) {
            $viewtop.removeClass('faded');
        } else if ( v === 'bottom' ) {
            $viewbottom.removeClass('faded');
        }
    }

    function rotate(orientation) {
        // console.log(orientation);
        $('.view-orientation')[orientation === 0 ? 'removeClass' : 'addClass']('show');
    }

    /**
     * Must replace these timeouts with something more event-driven.
     */
    function init() {

        // setTimeout(function() {
            $('.view').removeClass('loading');
        // }, 2500);

        // setTimeout(function() {
        //     $('.loader').removeClass('loading');
        //     setTimeout(function(){
        //         $('.loader').hide();
        //     }, 550);
        // }, 500);
        //

        $(document).on('click', '.error-close', function(e) {
            hidemodal();
            $viewmodal.html('');
        });
    }


    /**
     * We need to keep the aspect ratio and size of the view div(s) and canvas the same
     * 1. Get window dimensions
     * 2. Calculate the aspect ratio
     * 3. Update the size and position of the canvas and view(s)
     */
    function sync() {

        var w = Utils.ww(),
            h = Utils.wh(),
            $content = $('.section', $viewtop),
            vw = Math.round(w),
            vh = Math.round(h);

        return $content.length !== 0 ? $content[0].getBoundingClientRect().height : 0;
    }

    $(init);

    return {
        load: load,
        error: error,
        show: show,
        hide: hide,
        hidemodal: hidemodal,
        sync: sync,
        rotate: rotate
    };

})();
