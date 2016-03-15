
'use strict';

/**
 * Sort the star indexes in order of which is highest
 */

var
    data = require('../scripts/generated/illustrator-output.js'),
    jf = require('jsonfile'),
    Vec = require('../scripts/modules/Vec.js'),

    stars = data.paths,
    group = data.group,

    temp = [],
    sortable = [],
    res = [];

stars.forEach( function(v, i) {
    temp.push({
        distance: v.x,
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
    console.log(sortable[i][1]);
    res.push(sortable[i][0]);
}

jf.writeFile('../scripts/generated/left.js', res, function(err) {
    console.log(err);
});
