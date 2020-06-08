function Chunk(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.left = this.x - this.w;
    this.right = this.x + this.w;
    this.top = this.y - this.h;
    this.bottom = this.y + this.h;

    this.points = [];
}

Chunk.prototype.contains = function (point) {
    if (point.x > this.left &&
        point.y > this.top &&
        point.x < this.right &&
        point.y < this.bottom) {
        return true;
    }
    return false;
}

Chunk.prototype.draw = function() {
    ctx.rect(this.x - this.w, this.y - this.h, this.w * 2, this.h * 2);
    ctx.stroke();
    ctx.fillRect(this.x,this.y,this.points.length,this.points.length)
}
function chunkIndexFromPos(x,y) {
    return Math.max(Math.min((Math.floor(x/chunkW) + Math.floor(y/chunkW) * chunksW),chunksLength),0);
}