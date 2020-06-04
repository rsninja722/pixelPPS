function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.contains = function (point) {
        if (point.x > this.x - this.w &&
            point.y > this.y - this.h &&
            point.x < this.x + this.w &&
            point.y < this.y + this.h) {
            return true;
        }
        return false;
    }

    this.intersects = function (rect) {
        if (this.x + this.w >= rect.x - rect.w &&
            this.x - this.w <= rect.x + rect.w &&
            this.y + this.h >= rect.y - rect.h &&
            this.y - this.h <= rect.y + rect.h) {
            return true;
        }
        return false;
    }
}

var capacity = 4;
// https://en.wikipedia.org/wiki/Quadtree
function QuadTree(x, y, w, h, parent) {
    // collider
    this.rect = new Rect(x, y, w, h);

    // points
    this.points = [];

    // quads within
    this.nw;
    this.ne;
    this.sw;
    this.se;

    // parent
    this.parent = parent;

    this.insert = function (point) {
        if (!this.rect.contains(point)) {
            return false
        }

        if (this.points.length < capacity && this.nw === undefined) {
            this.points.push(point);
            return true;
        }

        if (this.nw === undefined) {
            this.subdivide();
        }

        if (this.nw.insert(point)) { return true; }
        if (this.ne.insert(point)) { return true; }
        if (this.sw.insert(point)) { return true; }
        if (this.se.insert(point)) { return true; }

        return false;
    }

    this.subdivide = function () {
        var r = this.rect;
        this.nw = new QuadTree(r.x - r.w / 2, r.y - r.h / 2, r.w / 2, r.h / 2, this);
        this.ne = new QuadTree(r.x + r.w / 2, r.y - r.h / 2, r.w / 2, r.h / 2, this);
        this.sw = new QuadTree(r.x - r.w / 2, r.y + r.h / 2, r.w / 2, r.h / 2, this);
        this.se = new QuadTree(r.x + r.w / 2, r.y + r.h / 2, r.w / 2, r.h / 2, this);
    }

    this.queryRange = function (range) {
        var pointsInRange = [];

        if (!this.rect.intersects(range)) {
            return pointsInRange;
        }

        for(let i=0,l=this.points.length;i<l;i++) {
            if (range.contains(this.points[i])) {
                pointsInRange.push(this.points[i].index);
            }
        }

        if (this.nw === undefined) {
            return pointsInRange;
        }

        pointsInRange=[...pointsInRange, ...this.nw.queryRange(range)];
        pointsInRange=[...pointsInRange, ...this.ne.queryRange(range)];
        pointsInRange=[...pointsInRange, ...this.sw.queryRange(range)];
        pointsInRange=[...pointsInRange, ...this.se.queryRange(range)];

        return pointsInRange;
    }

    this.draw = function () {
        // ctx.moveTo(this.rect.x - this.rect.w, this.rect.y - this.rect.h);
        ctx.rect(this.rect.x - this.rect.w, this.rect.y - this.rect.h, this.rect.w * 2, this.rect.h * 2);
        ctx.stroke();
        if (this.nw !== undefined) {
            this.nw.draw();
            this.ne.draw();
            this.sw.draw();
            this.se.draw();
        }
    }

}