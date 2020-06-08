var friction = 0.7;


// type of point: rgb offset 1, rgb offset 2 
var types = [
    [0, 0],
    [1, 1],
    [2, 2]
];

var points = [];

var chunks = [];
var chunkW;
var chunkH;
var chunksW;
var chunksH;
var chunksLength;

var updates = 0;

// precalculate forces
function calculateForces() {
    for (var i = 0; i < types.length; i++) {
        var forces = [];
        for (var j = 0; j < types.length; j++) {
            var force = [-0.2];
            var start = randDec(parseFloat(document.getElementById("startLow").value), parseFloat(document.getElementById("startHigh").value)) / 10;
            var end = randDec(parseFloat(document.getElementById("rangeLow").value), parseFloat(document.getElementById("rangeHigh").value)) / 10;

            var amplitude = randDec(parseFloat(document.getElementById("forceLow").value), parseFloat(document.getElementById("forceHigh").value)) / 100;

            var mid = (end - start) / 3;

            for (var k = 1; k < 80; k++) {
                if (k / 4 < start) {
                    force[k] = -Math.log(k / 4 / start) / parseFloat(document.getElementById("repulse").value);
                } else if (k / 4 < mid) {
                    force[k] = ((amplitude / (mid - start)) * (k / 4 - mid)) + amplitude;
                } else if (k / 4 < end) {
                    force[k] = ((-amplitude / (end - mid)) * (k / 4 - end));
                } else {
                    force[k] = 0;
                }
            }
            forces.push(force);
        }
        types[i][2] = forces;
    }
}
calculateForces();


// create points and chunks
function generate() {
    points = [];
    for (var i = 0, l = parseInt(document.getElementById("count").value); i < l; i++) {
        points.push(new point(rand(0, cw), rand(0, ch), rand(0, 2)));
    }

    createChunks();
}
generate();

function createChunks() {
    chunks = [];
    chunkW = cw / Math.floor(cw / 40);
    chunkH = ch / Math.floor(ch / 40);


    // create chunks, and keep track of the 
    var csh = 0;
    var csw = 0;
    for (var y = chunkH / 2; y < ch; y += chunkH) {
        for (var x = chunkW / 2; x < cw; x += chunkW) {
            chunks.push(new Chunk(x, y, chunkW / 2, chunkH / 2));
            csw++;
        }
        if (y === chunkH / 2) {
            chunksW = csw;
        }
        csh++;
    }
    chunksH = csh;

    chunksLength = chunks.length - 1;
    for (var i = 0, l = points.length; i < l; i++) {
        var p = points[i];
        var ci = chunkIndexFromPos(p.x, p.y);
        chunks[ci].points.push(i);
        points[i].chunk = ci;
    }
}

function update() {
    friction = parseFloat(document.getElementById("fric").value) / 100;
    chunksLength = chunks.length - 1;
    for (var i = 0, l = points.length; i < l; i++) {
        var p = points[i];
        var ci = chunkIndexFromPos(p.x, p.y);
        chunks[ci].points.push(i);
        points[i].chunk = ci;
    }

    // move all points
    for (var i = 0, l = points.length; i < l; i++) {
        points[i].move(i);
    }

    // find close points and set color
    // for(var i=0,l=points.length;i<l;i++) {
    // points[i].pointsNear = qTree.queryRange(new Rect(points[i].x,points[i].y,20,20));
    // points[i].color = Math.min(points[i].pointsNear.length * 30,255);
    // }
    updates++;
}

// helpful functions 
function length(object1, object2) {
    var one = (object2.x - object1.x);
    var two = (object2.y - object1.y);
    return Math.sqrt((one * one) + (two * two));
}
var pointOffset = Math.PI / 2;
function pointTo(obj1, obj2) {
    var adjacent = (obj2.x - obj1.x);
    var opposite = (obj2.y - obj1.y);
    var h = Math.atan2(opposite, adjacent);
    return -h - pointOffset;
}
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randDir() {
    if (rand(0, 1) == 1) {
        return 1;
    } else {
        return -1;
    }
}
function randDec(min, max) {
    return (Math.floor(((Math.random() * (max - min + 1)) + min) * 100)) / 100;
}

document.getElementById("clear").checked = true;

// start loops
setInterval(() => {
    console.log(updates);
    updates = 0;
}, 1000);
setInterval(update, 7);
requestAnimationFrame(draw);