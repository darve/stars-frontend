﻿#target illustrator/** * Welcome traveller, please disregard this enormous JSON polyfill I have * included at the top of this file. Please scroll to the bottom for the * actual code you are looking for. */// Create a JSON object only if one does not already exist. We create the// methods in a closure to avoid creating global variables.var JSON;if (!JSON) {    JSON = {};}(function () {    'use strict';    function f(n) {        // Format integers to have at least two digits.        return n < 10 ? '0' + n : n;    }    if (typeof Date.prototype.toJSON !== 'function') {        Date.prototype.toJSON = function (key) {            return isFinite(this.valueOf())                ? this.getUTCFullYear()     + '-' +                    f(this.getUTCMonth() + 1) + '-' +                    f(this.getUTCDate())      + 'T' +                    f(this.getUTCHours())     + ':' +                    f(this.getUTCMinutes())   + ':' +                    f(this.getUTCSeconds())   + 'Z'                : null;        };        String.prototype.toJSON      =            Number.prototype.toJSON  =            Boolean.prototype.toJSON = function (key) {                return this.valueOf();            };    }    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,        gap,        indent,        meta = {    // table of character substitutions            '\b': '\\b',            '\t': '\\t',            '\n': '\\n',            '\f': '\\f',            '\r': '\\r',            '"' : '\\"',            '\\': '\\\\'        },        rep;    function quote(string) {// If the string contains no control characters, no quote characters, and no// backslash characters, then we can safely slap some quotes around it.// Otherwise we must also replace the offending characters with safe escape// sequences.        escapable.lastIndex = 0;        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {            var c = meta[a];            return typeof c === 'string'                ? c                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);        }) + '"' : '"' + string + '"';    }    function str(key, holder) {// Produce a string from holder[key].        var i,          // The loop counter.            k,          // The member key.            v,          // The member value.            length,            mind = gap,            partial,            value = holder[key];// If the value has a toJSON method, call it to obtain a replacement value.        if (value && typeof value === 'object' &&                typeof value.toJSON === 'function') {            value = value.toJSON(key);        }// If we were called with a replacer function, then call the replacer to// obtain a replacement value.        if (typeof rep === 'function') {            value = rep.call(holder, key, value);        }// What happens next depends on the value's type.        switch (typeof value) {        case 'string':            return quote(value);        case 'number':// JSON numbers must be finite. Encode non-finite numbers as null.            return isFinite(value) ? String(value) : 'null';        case 'boolean':        case 'null':// If the value is a boolean or null, convert it to a string. Note:// typeof null does not produce 'null'. The case is included here in// the remote chance that this gets fixed someday.            return String(value);// If the type is 'object', we might be dealing with an object or an array or// null.        case 'object':// Due to a specification blunder in ECMAScript, typeof null is 'object',// so watch out for that case.            if (!value) {                return 'null';            }// Make an array to hold the partial results of stringifying this object value.            gap += indent;            partial = [];// Is the value an array?            if (Object.prototype.toString.apply(value) === '[object Array]') {// The value is an array. Stringify every element. Use null as a placeholder// for non-JSON values.                length = value.length;                for (i = 0; i < length; i += 1) {                    partial[i] = str(i, value) || 'null';                }// Join all of the elements together, separated with commas, and wrap them in// brackets.                v = partial.length === 0                    ? '[]'                    : gap                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'                    : '[' + partial.join(',') + ']';                gap = mind;                return v;            }// If the replacer is an array, use it to select the members to be stringified.            if (rep && typeof rep === 'object') {                length = rep.length;                for (i = 0; i < length; i += 1) {                    if (typeof rep[i] === 'string') {                        k = rep[i];                        v = str(k, value);                        if (v) {                            partial.push(quote(k) + (gap ? ': ' : ':') + v);                        }                    }                }            } else {// Otherwise, iterate through all of the keys in the object.                for (k in value) {                    if (Object.prototype.hasOwnProperty.call(value, k)) {                        v = str(k, value);                        if (v) {                            partial.push(quote(k) + (gap ? ': ' : ':') + v);                        }                    }                }            }// Join all of the member texts together, separated with commas,// and wrap them in braces.            v = partial.length === 0                ? '{}'                : gap                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'                : '{' + partial.join(',') + '}';            gap = mind;            return v;        }    }// If the JSON object does not yet have a stringify method, give it one.    if (typeof JSON.stringify !== 'function') {        JSON.stringify = function (value, replacer, space) {// The stringify method takes a value and an optional replacer, and an optional// space parameter, and returns a JSON text. The replacer can be a function// that can replace values, or an array of strings that will select the keys.// A default replacer method can be provided. Use of the space parameter can// produce text that is more easily readable.            var i;            gap = '';            indent = '';// If the space parameter is a number, make an indent string containing that// many spaces.            if (typeof space === 'number') {                for (i = 0; i < space; i += 1) {                    indent += ' ';                }// If the space parameter is a string, it will be used as the indent string.            } else if (typeof space === 'string') {                indent = space;            }// If there is a replacer, it must be a function or an array.// Otherwise, throw an error.            rep = replacer;            if (replacer && typeof replacer !== 'function' &&                    (typeof replacer !== 'object' ||                    typeof replacer.length !== 'number')) {                throw new Error('JSON.stringify');            }// Make a fake root object containing our value under the key of ''.// Return the result of stringifying the value.            return str('', {'': value});        };    }// If the JSON object does not yet have a parse method, give it one.    if (typeof JSON.parse !== 'function') {        JSON.parse = function (text, reviver) {// The parse method takes a text and an optional reviver function, and returns// a JavaScript value if the text is a valid JSON text.            var j;            function walk(holder, key) {// The walk method is used to recursively walk the resulting structure so// that modifications can be made.                var k, v, value = holder[key];                if (value && typeof value === 'object') {                    for (k in value) {                        if (Object.prototype.hasOwnProperty.call(value, k)) {                            v = walk(value, k);                            if (v !== undefined) {                                value[k] = v;                            } else {                                delete value[k];                            }                        }                    }                }                return reviver.call(holder, key, value);            }// Parsing happens in four stages. In the first stage, we replace certain// Unicode characters with escape sequences. JavaScript handles many characters// incorrectly, either silently deleting them, or treating them as line endings.            text = String(text);            cx.lastIndex = 0;            if (cx.test(text)) {                text = text.replace(cx, function (a) {                    return '\\u' +                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);                });            }// In the second stage, we run the text against regular expressions that look// for non-JSON patterns. We are especially concerned with '()' and 'new'// because they can cause invocation, and '=' because it can cause mutation.// But just to be safe, we want to reject all unexpected forms.// We split the second stage into 4 regexp operations in order to work around// crippling inefficiencies in IE's and Safari's regexp engines. First we// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we// replace all simple value tokens with ']' characters. Third, we delete all// open brackets that follow a colon or comma or that begin the text. Finally,// we look to see that the remaining characters are only whitespace or ']' or// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.            if (/^[\],:{}\s]*$/                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {// In the third stage we use the eval function to compile the text into a// JavaScript structure. The '{' operator is subject to a syntactic ambiguity// in JavaScript: it can begin a block or an object literal. We wrap the text// in parens to eliminate the ambiguity.                j = eval('(' + text + ')');// In the optional fourth stage, we recursively walk the new structure, passing// each name/value pair to a reviver function for possible transformation.                return typeof reviver === 'function'                    ? walk({'': j}, '')                    : j;            }// If the text is not JSON parseable, then a SyntaxError is thrown.            throw new SyntaxError('JSON.parse');        };    }}());/** * ======================================== *  DAVE'S CODE BELOW THIS LINE * ======================================== */var Utils = {    extend: function (obj, ext) {        for (var prop in ext) {            obj[prop] = (obj.hasOwnProperty(prop)) ? obj[prop] : ext[prop];        }        return obj;    }};var Colour = (function() {    function HSV(h, s, v) {      if (h <= 0) { h = 0; }        if (s <= 0) { s = 0; }        if (v <= 0) { v = 0; }        if (h > 360) { h = 360; }        if (s > 100) { s = 100; }        if (v > 100) { v = 100; }        this.h = h;        this.s = s;        this.v = v;    }    function RGB(r, g, b) {        if (r <= 0) { r = 0; }        if (g <= 0) { g = 0; }        if (b <= 0) { b = 0; }        if (r > 255) { r = 255; }        if (g > 255) { g = 255; }        if (b > 255) { b = 255; }        this.r = r;        this.g = g;        this.b = b;    }    function CMYK(c, m, y, k) {        if (c <= 0) { c = 0; }        if (m <= 0) { m = 0; }        if (y <= 0) { y = 0; }        if (k <= 0) { k = 0; }        if (c > 100) { c = 100; }        if (m > 100) { m = 100; }        if (y > 100) { y = 100; }        if (k > 100) { k = 100; }        this.c = c;        this.m = m;        this.y = y;        this.k = k;    }    function RGBtoHSV(RGB) {        var result = new HSV(0, 0, 0);        r = RGB.r / 255;        g = RGB.g / 255;        b = RGB.b / 255;        var minVal = Math.min(r, g, b);        var maxVal = Math.max(r, g, b);        var delta = maxVal - minVal;        result.v = maxVal;        if (delta == 0) {            result.h = 0;            result.s = 0;        } else {            result.s = delta / maxVal;            var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;            var del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;            var del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;            if (r == maxVal) { result.h = del_B - del_G; }            else if (g == maxVal) { result.h = (1 / 3) + del_R - del_B; }            else if (b == maxVal) { result.h = (2 / 3) + del_G - del_R; }            if (result.h < 0) { result.h += 1; }            if (result.h > 1) { result.h -= 1; }        }        result.h = Math.round(result.h * 360);        result.s = Math.round(result.s * 100);        result.v = Math.round(result.v * 100);        return result;    }    function HSVtoRGB(HSV) {        var result = new RGB(0, 0, 0);        var h = HSV.h / 360;        var s = HSV.s / 100;        var v = HSV.v / 100;        if (s == 0) {            result.r = v * 255;            result.g = v * 255;            result.v = v * 255;        } else {            var_h = h * 6;            var_i = Math.floor(var_h);            var_1 = v * (1 - s);            var_2 = v * (1 - s * (var_h - var_i));            var_3 = v * (1 - s * (1 - (var_h - var_i)));            if (var_i == 0) {var_r = v; var_g = var_3; var_b = var_1}            else if (var_i == 1) {var_r = var_2; var_g = v; var_b = var_1}            else if (var_i == 2) {var_r = var_1; var_g = v; var_b = var_3}            else if (var_i == 3) {var_r = var_1; var_g = var_2; var_b = v}            else if (var_i == 4) {var_r = var_3; var_g = var_1; var_b = v}            else {var_r = v; var_g = var_1; var_b = var_2};            result.r = var_r * 255;            result.g = var_g * 255;            result.b = var_b * 255;            result.r = Math.round(result.r);            result.g = Math.round(result.g);            result.b = Math.round(result.b);        }        return result;    }    function CMYKtoRGB(CMYK) {        var result = new RGB(0, 0, 0);        c = CMYK.c / 100;        m = CMYK.m / 100;        y = CMYK.y / 100;        k = CMYK.k / 100;        result.r = 1 - Math.min( 1, c * ( 1 - k ) + k );        result.g = 1 - Math.min( 1, m * ( 1 - k ) + k );        result.b = 1 - Math.min( 1, y * ( 1 - k ) + k );        result.r = Math.round( result.r * 255 );        result.g = Math.round( result.g * 255 );        result.b = Math.round( result.b * 255 );        return result;    }    function RGBtoCMYK(RGB) {        var result = new CMYK(0, 0, 0, 0);        r = RGB.r / 255;        g = RGB.g / 255;        b = RGB.b / 255;        result.k = Math.min( 1 - r, 1 - g, 1 - b );        result.c = ( 1 - r - result.k ) / ( 1 - result.k );        result.m = ( 1 - g - result.k ) / ( 1 - result.k );        result.y = ( 1 - b - result.k ) / ( 1 - result.k );        result.c = Math.round( result.c * 100 );        result.m = Math.round( result.m * 100 );        result.y = Math.round( result.y * 100 );        result.k = Math.round( result.k * 100 );        return result;    }    function toRGB(o) {        if (o instanceof RGB) { return o; }        if (o instanceof HSV) { return HSVtoRGB(o); }        if (o instanceof CMYK) { return CMYKtoRGB(o); }    }    function toHSV(o) {        if (o instanceof HSV) { return o; }        if (o instanceof RGB) { return RGBtoHSV(o); }        if (o instanceof CMYK) { return RGBtoHSV(CMYKtoRGB(o)); }    }    function toCMYK(o) {        if (o instanceof CMYK) { return o; }        if (o instanceof RGB) { return RGBtoCMYK(o); }        if (o instanceof HSV) { return RGBtoCMYK(HSVtoRGB(o)); }    }    function componentToHex(c) {        $.writeln(c, typeof c);        var hex = c.toString(16);        return hex.length == 1 ? '0' + hex : hex;    }    function RGBtoHEX(c) {        return '#' + componentToHex(c.r) + componentToHex(c.gg) + componentToHex(c.b);    }    return {        HSV: HSV,        RGB: RGB,        CMYK: CMYK,        RGBtoHSV: RGBtoHSV,        HSVtoRGB: HSVtoRGB,        CMYKtoRGB: CMYKtoRGB,        RGBtoCMYK: RGBtoCMYK,        toRGB: toRGB,        toHSV: toHSV,        toCMYK: toCMYK,        RGBtoHEX: RGBtoHEX    };})();/** * Pass this function a String (e.g. colour) and it will do the necessary * work to query the specified object for a colour in a format that we  * can work with */function translate(item, key) {	switch (key) {				case 'position':			return {                 x: Math.round(item.position[0] + item.width/2.0).toFixed(2),                y: Math.abs(Math.round(item.position[1] - item.height/2.0)).toFixed(2)            };			break;				case 'colour':            if ( 'fillColor' in item) {                var c = Colour.CMYKtoRGB(new Colour.CMYK(item.fillColor.cyan, item.fillColor.magenta, item.fillColor.yellow, item.fillColor.black)),                    colour;                        switch (Math.round(item.fillColor.magenta)) {                    case 43:                        colour = "grey";                        break;                                        case 0:                         colour = "white"                        break;                    default:                        colour = "red"                        break;                }                // return { colour: Colour.RGBtoHEX(c) };                    return {                     rgb: c,                    colour: colour                };            } else {                return {};            }						break;		case 'size':			return {                 width: item.width.toFixed(2),                height: item.height.toFixed(2)            }			break;        case 'name':            return { name: item.name };            break;	}}/** * This function queries AI objects for various properties that we need * via the translate function */function extract(item) {    var obj = {};    Utils.extend(obj, translate(item, 'name'));    Utils.extend(obj, translate(item, 'size'));    Utils.extend(obj, translate(item, 'position'));    Utils.extend(obj, translate(item, 'colour'));    return obj;}/** * We are making the assumption that we are are given the current path * @type {File} */var file = new File(arguments[0] + arguments[1]),    data = {        group: undefined,        paths: []    };file.open('w');with (app.activeDocument) {    if (pathItems.length > 0) {        for (var g = 0 ; g < pathItems.length; g++) {            if ( pathItems[g].name !== 'bucket' ) {                data.paths.push(extract(pathItems[g]));            } else {                data.bucket = extract(pathItems[g]);            }        }    }    if (groupItems.length > 0) {        for (var g = 0 ; g < groupItems.length; g++) {            if ( data.group === undefined ) data.group = extract(groupItems[g]);        }    }}file.write('module.exports = ');file.write(JSON.stringify(data));file.write(';')file.close();