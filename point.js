function point(x, y, type) {
    this.x = x;
    this.y = y;
    this.v = { x: 0, y: 0 };
    this.t = type;
    this.color = 255;
    this.pointsNear = [];

    this.move = function (index) {
        // move
        this.x += this.v.x;
        this.y += this.v.y;

        // apply forces depending on nearby points
        for (var j = 0, jl = this.pointsNear.length; j < jl; j++) {
            // if not itself
            if (this.pointsNear[j] != index) {
                // get next nearest point
                var p = points[this.pointsNear[j]];
                // get distance to point
                var dist = length(this, p);
                if (dist < 20) {
                    // calculate force 
                    var angle = pointTo(this, p);
                    var force = types[this.t][2][p.t][Math.floor(dist * 4)];
                    this.v.x +=  (Math.sin(angle) * force);
                    this.v.y += (Math.cos(angle) * force);
                }
            }
        }

        // apply friction
        this.v.x *= friction;
        this.v.y *= friction;

        // don't go out of canvas
        if (this.x > cw) { this.x = cw; }
        if (this.y > ch) { this.y = ch; }
        if (this.x < 0) { this.x = 0; }
        if (this.y < 0) { this.y = 0; }
    };

    this.draw = function () {
        d[Math.floor(this.x) * 4 + Math.floor(this.y) * yMulti + types[this.t][0]] = this.color;
    }

    return this;
}