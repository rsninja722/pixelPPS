var friction = 0.6;


// type of point: rgb offset 1, rgb offset 2 
var types = [
    [0,0],
    [1,1],
    [2,2]
];

var points = [];

var qTree;

// precalculate forces
function calculateForces() {
    for(var i=0;i<types.length;i++) {
        var forces = [];
        for(var j=0;j<types.length;j++) {
            var force = [-2];
            var start = randDec(parseInt(document.getElementById("startLow").value),parseInt(document.getElementById("startHigh").value))/10;
            var end = randDec(parseInt(document.getElementById("rangeLow").value),parseInt(document.getElementById("rangeHigh").value))/10;

            var amplitude = randDec(parseInt(document.getElementById("forceLow").value),parseInt(document.getElementById("forceHigh").value))/100;

            var mid = (end-start)/3;

            for(var k=1;k<80;k++) {
                if(k/4 < start) {
                    force[k] = Math.log(k/4/start)/40;
                } else if(k/4 < mid) {
                    force[k] = ((amplitude/(mid-start))*(k/4 - mid))+amplitude;
                } else if(k/4 < end) {
                    force[k] = ((-amplitude/(end-mid))*(k/4 - end));
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


// create points
function generate() {
    points = [];
    for(var i=0,l=parseInt(document.getElementById("count").value);i<l;i++) {
        points.push(new point(rand(0,cw),rand(0,ch),rand(0,2)));
    }
}
generate();

function update() {
    qTree = new QuadTree(cw/2,ch/2,cw/2,ch/2,null);
    for(var i=0,l=points.length;i<l;i++) {
        qTree.insert({x:points[i].x,y:points[i].y,index:i});
    }

    // move all points
    for(var i=0,l=points.length;i<l;i++) {
        points[i].move(i);
    }
    
    // find close points and set color
    for(var i=0,l=points.length;i<l;i++) {
        points[i].pointsNear = qTree.queryRange(new Rect(points[i].x,points[i].y,20,20));
        points[i].color = Math.min(points[i].pointsNear.length * 30,255);
    }
}


// helpful functions 
function length(object1, object2) {
    var one = (object2.x - object1.x);
    var two = (object2.y - object1.y);
    return Math.sqrt((one * one) + (two * two));
}
function pointTo(obj1, obj2) {
    var adjacent = (obj1.x - obj2.x);
    var opposite = (obj1.y - obj2.y);
    var h = Math.atan2(opposite, adjacent);
    return -h+Math.PI/2;
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

// start loops
setInterval(update, 16.66);
requestAnimationFrame(draw);