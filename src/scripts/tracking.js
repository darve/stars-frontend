
'use strict';

module.exports = (function() {

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', window.wagaconfig.ga_code, 'auto');

    var api = {};

    api.track = function(label, val) {
        if ( label === undefined ) {
            ga('send', 'pageview');
        } else {
            ga('send', 'event', label, val);
        }
    };

    return api;

})();

