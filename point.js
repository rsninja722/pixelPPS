function point(x, y, type) {
    this.x = x;
    this.y = y;
    this.v = { x: 0, y: 0 };
    this.t = type;
    this.color = 255;
    this.chunk = 0;

    return this;
}

point.prototype.move = function (index) {
    this.chunk = Math.max(Math.min(chunksLength, this.chunk), 0);
    var chunksNear = [this.chunk, 0, 0, 0];

    var c = chunks[this.chunk];
    var left = this.x < c.x;
    var top = this.y < c.y;

    // find 3 nearest chunks
    if (left && top) {
        chunksNear[1] = this.chunk - 1;
        chunksNear[2] = this.chunk - 1 - chunksW;
        chunksNear[3] = this.chunk - chunksW;
    } else if (left && !top) {
        chunksNear[1] = this.chunk - 1;
        chunksNear[2] = this.chunk - 1 + chunksW;
        chunksNear[3] = this.chunk + chunksW;
    } else if (!left && top) {
        chunksNear[1] = this.chunk + 1;
        chunksNear[2] = this.chunk + 1 - chunksW;
        chunksNear[3] = this.chunk - chunksW;
    } else if (!left && !top) {
        chunksNear[1] = this.chunk + 1;
        chunksNear[2] = this.chunk + 1 + chunksW;
        chunksNear[3] = this.chunk + chunksW;
    }

    chunksNear[1] = Math.max(Math.min(chunksLength, chunksNear[1]), 0);
    chunksNear[2] = Math.max(Math.min(chunksLength, chunksNear[2]), 0);
    chunksNear[3] = Math.max(Math.min(chunksLength, chunksNear[3]), 0);


    // apply forces depending on nearby points

    var deltaX = 0;
    var deltaY = 0;
    var count = 0;
    for (var k = 0; k < 4; k++) {
        var pointsNear = chunks[chunksNear[k]].points;
        for (var j = 0, jl = pointsNear.length; j < jl; j++) {
            // if not itself
            if (pointsNear[j] != index) {
                // get next nearest point
                var p = points[pointsNear[j]];
                // get distance to point
                var dist = length(this, p);
                if (dist < 20) {
                    // calculate force 
                    var angle = pointTo(this, p);
                    var force = types[this.t][2][p.t][Math.floor(dist * 4)];
                    deltaX += (Math.sin(angle) * force);
                    deltaY += (Math.cos(angle) * force);
                    count++;
                }
            }
        }
    }

    if (count > 0) {
        this.v.x += deltaX / count;
        this.v.y += deltaY / count;
    }

    // apply friction
    this.v.x *= friction;
    this.v.y *= friction;

    // move
    this.x += this.v.x;
    this.y += this.v.y;

    // don't go out of canvas
    this.screenWarp();

    // if (this.x > c.right) {
    //     this.chunk++;
    //     c.points.splice(c.points.indexOf(index));
    //     chunks[this.chunk].points.push(index);
    // }
    // if (this.x < c.left) {
    //     this.chunk--;
    //     c.points.splice(c.points.indexOf(index));
    //     chunks[this.chunk].points.push(index);
    // }
    // if (this.y > c.bottom) {
    //     this.chunk += chunksW;
    //     c.points.splice(c.points.indexOf(index));
    //     chunks[this.chunk].points.push(index);
    // }
    // if (this.y < c.top) {
    //     this.chunk -= chunksW;
    //     c.points.splice(c.points.indexOf(index));
    //     chunks[this.chunk].points.push(index);
    // }
}

point.prototype.screenWarp = function() {
    if (this.x > cw-1) { this.x = 1; }
    if (this.y > ch-1) { this.y = 1; }
    if (this.x < 1) { this.x = cw-1; }
    if (this.y < 1) { this.y = ch-1; }
}

// set pixel at x,y to this points color
point.prototype.draw = function () {
    d[Math.floor(this.x) * 4 + Math.floor(this.y) * yMulti + types[this.t][0]] = this.color;
}