
/**
 * Animated Christmas Tree module
 */

'use strict';

var
    // 2D vector library
    Vec         = require('../modules/Vec'),

    // Maths helper functions
    M           = require('../modules/Math.js'),

    // Colour conversion helper functions
    Colour      = require('../modules/Colour.js'),

    // Various JS helper functions
    Utils       = require('../modules/Utils.js'),

    // WebGL rendering library with a canvas fallback
    PIXI        = require('pixi'),

    // Particle
    Lad         = require('../modules/Lad.js'),

    // Lightweight animation library
    TWEEN       = require('tween'),

    // jQuery, because you know, I'm a lad.
    $           = require('jquery'),

    // Promise library
    q           = require('q'),

    // Generated SVG data from the Illustrator file
    starData    = require('./generated/illustrator-output.js'),
    messages    = require('./generated/messages.js'),
    order       = require('./generated/lowest.js'),
    center      = require('./generated/closest-to-center.js');

module.exports = (function(c) {

    var
        // This will store the public methods for this module
        api = {},
        tree = {},

        // These are the groups of sprite(s)
        sprites = {
            tree: {},
            bigstar: {},
            floor: {},
            bucket: {},
            stars: []
        },

        // These are the PIXI containers
        layers = {
            stars: {},
            bigstar: {},
            floor: {}
        },

        ui = {
            scroller: undefined,
            scroll: undefined,

            mouse: new Vec(-99999, -99999),
            temp: new Vec(0, 0),

            mousedown: false,
            loaded: false,
            offset: 0
        },

        count = {
            frame: 0,
            click: 0,
            spawn: 0,
            message: 0
        },

        limit = {
            spawn: order.length
            // spawn: 1
        },

        gfx = {
            renderer: undefined,
            loader: undefined,
            stage: undefined,

            colours: [
                0x6D6E6C,
                0xf70000,
                0xFFFFFF
            ],

            assets: [
                { name: 'star-red-120', url: '/static_assets/img/star-red-120.png' },
                { name: 'star-grey-120', url: '/static_assets/img/star-grey-120.png' },
                { name: 'star-white-120', url: '/static_assets/img/star-white-120.png' },
                { name: 'star-red-1200', url: '/static_assets/img/star-red-1200.png' },
                { name: 'star-grey-1200', url: '/static_assets/img/star-grey-1200.png' },
                { name: 'star-white-1200', url: '/static_assets/img/star-white-1200.png' },
                { name: 'bucket', url: '/static_assets/img/bucket-120.png' }
            ]
        },

        view = {
            scale: window.devicePixelRatio || 1,
            mobile: Utils.mobile(),
            w: undefined,
            h: undefined,
            hw: undefined,
            hh: undefined,
            win: new Vec(0, 0)
        },

        elems = {
            $body: $('body')
        },

        defer = {
            queue: [],
            timers: [],
            callbacks: [],
            anim: {
                // Number of lads to spawn per iteration
                num: 3,
                count: 0,
                length: 0,
                fn: undefined
            }
        },

        loaded = {
            sprites: false
        },

        bigstar,
        lad;

        window.defer = defer;
        window.sprites = sprites;
        window.layers = layers;

    /**
     * The rendering loop that calls PIXI
     */
    function render(){
        window.requestAnimationFrame(render);

        if ( ui.loaded === true ) {
            count.frame++;

            // This does a variable number of things per frame
            if ( defer.anim.count <= defer.anim.length ) {
                for ( var i = defer.anim.count; i < defer.anim.count + defer.anim.num; i++ ) {
                    if ( i < defer.anim.length ) {
                        defer.anim.fn(i);
                    }
                }
                defer.anim.count += defer.anim.num;
            }

            // This does one thing per frame.
            if ( defer.queue.length ) {
                var fn = defer.queue.shift();
                fn.cx[fn.fn].apply(fn.cx, fn.args);
            }

            if ( defer.timers.length ) {
                defer.timers.forEach(function(t, i){
                    if ( t.time === count.frame ) {
                        if ( t.fn !== undefined ) t.fn();
                    }
                });
            }

            sprites.stars.forEach(function(l, i){
                l.tick(count.frame, ui.mouse);
            });
            sprites.floor.tick(count.frame, ui.mouse);
            sprites.bucket.tick(count.frame, ui.mouse);
            sprites.tree.tick(count.frame, ui.mouse);
            bigstar.tick(count.frame, ui.mouse);
        }

        TWEEN.update();
        gfx.renderer.render(gfx.stage);
    }

    /**
     * Generate a new sprite.
     */
    function generate(name, sprite, initial, original) {
        return new Lad({
            name: name,
            sprite: sprite,
            viewscale: tree.scale,
            offset: ui.offset,
            initial: initial,
            original: original
        });
    }

    /**
     * The image assets have finished loading - GO GO GO
     */
    function assetsLoaded() {

        var star, data, temp;

        for ( var i = count.spawn, l = limit.spawn; i < l; i++ ){
            data = starData.paths[order[i]];

            star = generate(
                'star',
                new PIXI.Sprite.fromImage('/static_assets/img/star-' + data.colour + '-120.png'),
                {
                    pos: new Vec(
                        M.rand(-tree.width, tree.width*2),
                        M.rand(-tree.width, tree.height*4)
                    ),
                    width: Number(data.width) * tree.scale,
                    height: Number(data.width) * tree.scale,
                    rotation: 0,
                    alpha: 0
                },
                {
                    pos: new Vec(
                        Number(data.x),
                        Number(data.y)
                    ),
                    width: Number(data.width),
                    height: Number(data.width),
                    rotation: 0,
                    alpha: 0
                }
            );
            sprites.stars.push(star);
            layers.stars.addChild(star.sprite);
        }

        bigstar = generate(
            'bigstar',
            new PIXI.Sprite.fromImage('/static_assets/img/star-' + window.wagaconfig.treecolour + '-1200.png'),
            {
                pos: new Vec(
                    Number(sprites.stars[200].original.pos.x * tree.scale),
                    Number(sprites.stars[200].original.pos.y * tree.scale)
                ),
                width: Number(sprites.stars[30].original.width),
                height: Number(sprites.stars[30].original.height),
                rotation: 0,
                alpha: 0
            },
            {
                pos: new Vec(
                    Number(sprites.stars[200].original.pos.x * tree.scale),
                    Number(sprites.stars[200].original.pos.y * tree.scale)
                ),
                width: Number(sprites.stars[30].original.width),
                height: Number(sprites.stars[30].original.height),
                rotation: 0,
                alpha: 0
            }
        );

        sprites.tree = generate(
            'tree',
            layers.stars,
            {
                pos: new Vec(
                    Number(layers.stars.position.x),
                    Number(layers.stars.position.y)
                ),
                width: Number(layers.stars.width),
                height: Number(layers.stars.height),
                rotation: 0,
                alpha: 1
            },
            {
                pos: new Vec(
                    Number(layers.stars.position.x),
                    Number(layers.stars.position.y)
                ),
                width: Number(layers.stars.width),
                height: Number(layers.stars.height),
                rotation: 0,
                alpha: 1
            }
        );

        sprites.bucket = generate(
            'bucket',
            new PIXI.Sprite.fromImage('/static_assets/img/bucket-120.png'),
            {
                pos: new Vec(view.hw, 3),
                width: 70 * tree.scale,
                height: 70 * tree.scale,
                rotation: 0,
                alpha: 0
            },
            {
                pos: new Vec(view.hw, 3),
                width: 70 * tree.scale,
                height: 70 * tree.scale,
                rotation: 0,
                alpha: 0
            }
        );

        temp = new PIXI.Graphics();
        temp.lineStyle(0, 0x6D6D6B, 1);
        temp.beginFill(0x6D6D6B, 1);
        temp.drawRect(0, 0, view.w, view.h);

        sprites.floor = generate(
            'floor',
            temp,
            {
                pos: new Vec(0, 200),
                width: view.w, height: view.h,
                rotation: 0,
                alpha: 0
            },
            {
                pos: new Vec(0, 36),
                width: view.w, height: view.h,
                rotation: 0,
                alpha: 0
            }
        );

        layers.floor.addChild(sprites.floor.sprite);

        sprites.bucket.sprite.anchor.x = 0.5;
        sprites.bucket.sprite.anchor.y = 0.5;
        layers.floor.addChild(sprites.bucket.sprite);
        sprites.bigstar = bigstar;
        layers.bigstar.addChild(bigstar.sprite);

        for ( var c in defer.callbacks ) {
            api[defer.callbacks[c]]();
        }

        ui.loaded = true;
        elems.$body.addClass('loaded');
        window.requestAnimationFrame(render);
    }

    /**
     * Hook up some event listeners for user interaction
     */
    function listeners() {

        $(document).on('mousemove', function(e) {
            ui.mouse.x = e.pageX;
            ui.mouse.y = e.pageY - ui.offset;
        });

        $(document).on('mousedown', function(e){
            // e.preventDefault();
            count.click++;
            ui.mousedown = true;
        });

        $(document).on('mouseup', 'canvas', function(e){
            e.preventDefault();
            ui.mousedown = false;
        });

        $(document).on('mousemove', 'canvas', function(e){
            ui.mouse.x = e.pageX;
            ui.mouse.y = e.pageY;
        });

        $(document).on('touchstart', function(e){
            // e.preventDefault();
            // var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        });

        $(document).on('touchend', 'canvas', function(e){
            e.preventDefault();
            ui.mousedown = false;
            ui.mouse.x = -500;
            ui.mouse.y = -500;
        });

        $(document).on('touchmove', 'canvas', function(e){
            e.preventDefault();
            ui.mouse.x = e.originalEvent.changedTouches[0].pageX;
            ui.mouse.y = e.originalEvent.changedTouches[0].pageY;
        });

        $(document).on('click', 'canvas', function(e){
            ui.mouse.x = e.pageX;
            ui.mouse.y = e.pageY;
        });

        $(document).on('scroll', function(e) {
            ui.scroll = document.body.scrollTop;
        });
    }

    /**
     * Scale the tree for different sized screens so all the stars
     * remain the correct scale and position.
     */
    function scaletree(offset) {

        if ( view.w <= 400 ) {
            tree.scale = 1;
        } else {
            tree.scale = 1.3;
        }

        tree.width = Number(starData.group.width) * tree.scale;
        tree.height = Number(starData.group.height) * tree.scale;
        tree.topleft = new Vec(view.hw-(tree.width/2), 124);

        ui.offset = offset !== undefined ? offset : 0;

        layers.stars.position.x = tree.topleft.x;
        layers.stars.position.y = tree.topleft.y;
        layers.bigstar.position.x = tree.topleft.x;
        layers.bigstar.position.y = 0;
        layers.floor.position.y = tree.topleft.y + tree.height;
    }

    /**
     * This is called when the jQuery DOMREADY event fires.
     */
    api.init = function() {

        // Initialise some logical sprite groups
        gfx.stage = new PIXI.Container();
        layers.stars = new PIXI.Container();
        layers.bigstar = new PIXI.Container();
        layers.floor = new PIXI.Container();

        // Get the tree dimensions from the JSON
        api.sync(0);
        scaletree();

        // Add our star containers to the stage
        gfx.stage.addChild(layers.floor);
        gfx.stage.addChild(layers.stars);
        gfx.stage.addChild(layers.bigstar);
        // console.log(view.w, view.scale);

        // Initialise the PIXI renderer
        gfx.renderer = new PIXI.autoDetectRenderer(view.w, 920, {
            view: c,
            backgroundColor: 0xD1D1C9,
            antialias: true,
            resolution: view.scale,
        });

        // Start loading the star assets
        gfx.loader = PIXI.loader;
        gfx.loader.once('complete', function() {
            setTimeout(assetsLoaded, 1000);
        });

        // Add our star image assets to the loader
        for ( var i in gfx.assets ) {
            gfx.loader.add(gfx.assets[i].name, gfx.assets[i].url);
        }

        gfx.loader.load();
        gfx.renderer.render(gfx.stage);
        listeners();
    };

    /**
     * Public API below this line
     * ====================================
     */

    api.scrollToTop = function() {
        ui.scroller = new TWEEN.Tween({ top: document.body.scrollTop })
        .to({ top: 0}, 500)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(function() {
            document.body.scrollTop = this.top;
        })
        .start();
    };

    /**
     * The window has been resized, we need to synchronise the View and
     * the Canvas so the content displays properly
     * (Note: This has been called from the main app.js within the window
     * resize listener)
     */
    api.sync = function(off) {

        // Update the known viewport size(s).
        view.w = view.mobile ? screen.availWidth : window.innerWidth;
        view.h = view.mobile ? screen.availHeight : window.innerHeight;
        view.hw = view.w/2;
        view.hh = view.h/2;
        view.win.x = view.w;
        view.win.y = view.h;

        ui.offset = off || 0;
        scaletree(ui.offset);

        // if ( sprites.bucket.sprite ) {
        //     sprites.bucket.queue('position', {
        //         speed: 5,
        //         easeing: 'easeOutBack',
        //         end: {
        //             pos: new Vec(view.hw, 70 * tree.scale)
        //         }
        //     });
        // }

        if ( gfx.renderer ) gfx.renderer.resize(view.w, 920);
    };

    api.nudge = function(offset) {
        api.scrollToTop();
        ui.offset = offset;
        api.queue('update');
    };

    api.update = function() {
        sprites.stars.forEach(function(l, i) {
            l.update(ui.offset);
        });
    };

    api.queue = function(fn) {
        if ( ui.loaded === true ) {
            api[fn]();
        } else {
            defer.callbacks.push(fn);
        }
    };

    api.killtimers = function() {
        defer.timers = [];
    };

    api.addtimer = function(num, f) {
        defer.timers.push({ time: count.frame+num, fn: f});
    };

    api.home = function() {
        defer.anim.length = limit.spawn;
        defer.anim.count = 0;
        defer.anim.fn = function(index) {
            var lad = sprites.stars[index];
            lad.home('easeOutBack', 60 + (Math.round(index / 10)));
            lad.queue('rotation', {
                speed: 60 + (Math.round(index / 20)),
                easing: 'easeOutBack',
                end: {
                    rotation: Math.PI*2
                }
            });
        };
    };

    api.move = function(vec) {
        sprites.stars.forEach(function(v, i) {
            v.move(vec, 40, 'easeOutBack');
        });
    };

    api.hidden = function(opts) {
        sprites.stars.forEach(function(l, i) {
            l.queue('position', {
                speed: 40,
                end: {
                    pos: {
                        x: tree.width/2,
                        y: tree.height * 3
                    }
                }
            });
        });
    };

    /**
     * Reader beware: these zoom functions are a right pair of bastards
     */
    api.zoomout = function(speed) {

        var p = new Vec( sprites.tree.sprite.position.x, sprites.tree.sprite.position.y ),
            s = new Vec( sprites.tree.sprite.width, sprites.tree.sprite.height );

        sprites.tree.queue('scale', {
            speed: speed || 100,
            end: {
                scale: 0.5
            }
        });

        sprites.tree.queue('position', {
            speed: speed || 100,
            end: {
                pos: {
                    x: tree.topleft.x + (s.x*0.25),
                    y: tree.topleft.y + (s.y*0.25)
                }
            }
        });

        sprites.tree.queue('alpha', {
            speed: speed || 100,
            end: {
                alpha: 0
            }
        });
    };

    api.zoomin = function(speed) {
        sprites.tree.queue('scale', {
            speed: 100,
            end: {
                scale: 1
            }
        });
        sprites.tree.queue('position', {
            speed: 100,
            end: {
                pos: {
                    x: sprites.tree.original.pos.x,
                    y: sprites.tree.original.pos.y
                }
            }
        });
        sprites.tree.queue('alpha', {
            speed: 100,
            end: {
                alpha: 1
            }
        });
    };

    api.showmessage = function() {
        count.message = count.message === messages.length ? 0 : count.message + 1;
        $('.star-message').text(messages[count.message]);
        api.addtimer(160, function() { $('.star-message').removeClass('faded'); });
        api.addtimer(1, function() { api.starshowing(380); });
        api.addtimer(380, function() { api.hidemessage(); });
    };

    api.hidemessage = function() {
        $('.star-message').addClass('faded');
        api.addtimer(15, function() { api.starposted(400); });
        api.addtimer(100, function() { api.showmessage(); });
    };

    api.starshowing = function(off) {

        var offset = off || 0,
            $heading = $('.view-star-heading');

        if ( $heading.length && offset === 0 ) {
            offset = $heading.innerHeight() + 30;
        }

        sprites.bigstar.queue('position', {
            speed: 30,
            easing: 'easeOutQuad',
            end: {
                pos: {
                    x: tree.width + tree.width/2,
                    y: 290 + offset
                }
            }
        });
        sprites.bigstar.queue('position', {
        speed: 30,
            easing: 'easeInOutQuad',
            end: {
                pos: {
                    x: tree.width/2,
                    y: 290 + offset
                }
            }
        });
        sprites.bigstar.queue('scale', {
            speed:  160,
            easing: 'easeOutQuad',
            end: {
                scale: 55
            }
        });
        sprites.bigstar.queue('alpha', {
            speed: 160,
            easing: 'easeOutQuad',
            end: {
                alpha: 1
            }
        });
        sprites.bigstar.queue('rotation', {
            speed: 120,
            easing: 'easeOutBack',
            end: {
                rotation: -Math.PI*4
            }
        });
    };

    api.starposted = function() {

        var offset = 0,
            $heading = $('.view-star-heading');

        if ( $heading.length ) {
            offset = $heading.innerHeight() + 30;
        }

        sprites.bigstar.queue('position', {
        speed: 30,
            easing: 'easeInOutQuad',
            end: {
                pos: {
                    x: tree.width,
                    y: 290 + offset
                }
            }
        });
        sprites.bigstar.queue('position', {
            speed: 30,
            easing: 'easeOutQuad',
            end: {
                pos: {
                    x: sprites.bigstar.original.pos.x,
                    y: sprites.bigstar.original.pos.y + 100
                }
            }
        });
        sprites.bigstar.queue('scale', {
            speed:  160,
            easing: 'easeOutQuad',
            end: {
                scale: 1
            }
        });
        sprites.bigstar.queue('alpha', {
            speed: 160,
            easing: 'easeOutQuad',
            end: {
                alpha: 0
            }
        });
        sprites.bigstar.queue('rotation', {
            speed: 160,
            easing: 'easeOutBack',
            end: {
                rotation: Math.PI*2
            }
        });
    };

    api.explode = function() {

        sprites.stars.forEach(function(l, i) {
            l.queue('position', {
                speed: 120,
                easing: 'easeOutBack',
                end: {
                    pos: new Vec( M.rand(-tree.width, tree.width*2), M.rand(-tree.width, tree.height*4))
                }
            });
            l.queue('alpha', {
                speed: 120,
                easing: 'easeOutBack',
                end: {
                    alpha: 0
                }
            });
        });
    };

    api.starhidden = function() {

        sprites.bigstar.queue('alpha', {
            speed: 40,
            easing: 'easeOutCubic',
            end: {
                alpha: 0
            }
        });
    };

    api.showbucket = function(off) {

        var offset = off || 0;

        sprites.bucket.queue('alpha', {
            speed: 40,
            easing: 'easeOutBack',
            end: {
                alpha: 1
            }
        });

        sprites.bucket.move(new Vec(0, offset), 40, 'easeOutBack');

        sprites.floor.queue('position', {
            speed: 40,
            easing: 'easeNone',
            end: {
                pos: {
                    x: sprites.floor.original.pos.x,
                    y: sprites.floor.original.pos.y + offset - ( view.w <= 400 ? 10 : 0 )
                }
            }
        });

        sprites.floor.queue('alpha', {
            speed: 40,
            easing: 'easeNone',
            end: {
                alpha: 1
            }
        });
    };

    api.hidebucket = function(off) {
        sprites.bucket.queue('alpha', {
            speed: 40,
            easing: 'easeOutBack',
            end: {
                alpha: 0
            }
        });

        sprites.floor.move(new Vec(0, 220), 40, 'easeNone');

        sprites.floor.queue('alpha', {
            speed: 40,
            easing: 'easeNone',
            end: {
                alpha: 1
            }
        });
    };

    api.hidecanvas = function() {
        gfx.renderer.view.style.display = 'none';
    };

    api.showcanvas = function() {
        gfx.renderer.view.style.display = 'block';
    };

    api.reset = function(callback) {

        if ( ui.loaded === true ) {
            defer = {
                queue: [],
                timers: [],
                callbacks: [],
                anim: {
                    num: 3,
                    count: 0,
                    length: 0,
                    fn: undefined
                }
            };

            sprites.stars.forEach(function(l, i){
                l.reset();
            });
            sprites.floor.reset();
            sprites.bucket.reset();
            sprites.tree.reset();
            // sprites.bigstar.killall();
            api.starposted();
        }
    };

    api.homepage = function(cb) {
        gfx.renderer.resize(view.w, 920);
        $('.view-top').attr('style', '');
        $('.canvas-bg').attr('style', '');
        // console.log('homepage animation started');
        api.addtimer(1, function() { api.nudge(0); });
        api.addtimer(30, function() { api.queue('home'); });
        api.addtimer(100, function() { api.queue('showbucket'); });
        api.addtimer(220, function() { api.queue('explode'); });
        api.addtimer(220, function() { api.queue('hidebucket'); });
        api.addtimer(220, cb);
    };

    api.decoratepage = function(cb) {
        // console.log('decorate page animation started');
        api.addtimer(30, function() { api.queue('home'); });
        api.addtimer(100, function() { api.queue('showbucket'); });
        api.addtimer(200, function() { api.queue('starshowing'); });
        api.addtimer(201, function() { api.queue('zoomout'); });
        api.addtimer(201, function() { api.queue('hidebucket'); });
        api.addtimer(320, cb);
    };

    api.sharepage = function(cb) {
        api.addtimer(1, function() { api.nudge(0); });
        api.addtimer(30, function() { api.queue('home'); });
        api.addtimer(30, function() { api.queue('starposted'); });
        api.addtimer(30, function() { api.queue('zoomin'); });
        api.addtimer(60, function() { api.queue('showbucket'); });
        api.addtimer(120, cb);
    };

    api.starpage = function(cb) {

    };

    /**
     * This needs to be dynamic.
     */
    api.thankyoupage = function(cb) {
        gfx.renderer.resize(view.w, 1060);
        $('.view-top').css('min-height', 1000 + 'px');
        $('.canvas-bg').css('min-height', 1060 + 'px');
        api.addtimer(10, function() { api.home(); });
        api.addtimer(60, function() { api.showbucket(270); });
        api.addtimer(120, function() { api.showmessage(); });
        api.nudge(270);
    };

    $(api.init);
    return api;

})(document.querySelectorAll('canvas')[0]);
