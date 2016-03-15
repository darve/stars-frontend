
'use strict';

/**
 * Sort the star indexes in order of which is closest to the center
 * of the group (tree).
 */

var
    data = require('../scripts/generated/illustrator-output.js'),
    jf = require('jsonfile'),
    Vec = require('../scripts/modules/Vec.js'),

    stars = data.paths,
    group = data.group,

    temp = [],
    sortable = [],
    res = [],

    center = new Vec(Number(group.x), Number(group.y));


stars.forEach( function(v, i) {
    temp.push({
        distance: center.minusNew( new Vec(Number(v.x), Number(v.y))).magnitude(),
        index: i
    });
});


for ( var i in temp ) {
    sortable.push([temp[i].index, temp[i].distance]);
}

sortable.sort(function(a,b) {
    return a[1] - b[1];
});

for ( var i in sortable ) {
    res.push(sortable[i][0]);
}

jf.writeFile('../generated/closest-to-center.js', res, function(err) {
    console.log(err);
});
