// canvas to draw to
var canvas = document.getElementById("cvs");
var ctx = canvas.getContext("2d");
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;

// canvas to get image data from
var backCanvas = document.getElementById("cvsBack");
var backCtx = canvas.getContext("2d");
backCanvas.width = document.body.clientWidth;
backCanvas.height = window.innerHeight;
backCtx.fillStyle = "#000000";

// width and height of canvas
var cw = canvas.width;
var ch = canvas.height;

backCtx.fillRect(0,0,cw,ch);
var screen = backCtx.getImageData(0,0,cw,ch); // image data
var d; // data part of image data
var yMulti; // data width * 4, used for finding where to draw

    
function draw() {

    if(document.getElementById("clear").checked) {
        // resize canvases
        if(canvas.width !== document.body.clientWidth || canvas.height !== document.body.offsetHeight < window.innerHeight ? window.innerHeight : document.body.offsetHeight) {
            canvas.width = document.body.clientWidth;
            canvas.height = document.body.offsetHeight < window.innerHeight ? window.innerHeight : document.body.offsetHeight;
            backCanvas.width = document.body.clientWidth;
            backCanvas.height = document.body.offsetHeight < window.innerHeight ? window.innerHeight : document.body.offsetHeight;
            cw = canvas.width;
            ch = canvas.height;

            createChunks();
        }


        // get image data
        backCtx.fillRect(0,0,cw,ch);
        screen = backCtx.getImageData(0,0,cw,ch);
    }
    d = screen.data;

    // calculate yMulti
    yMulti = screen.width * 4;

    // draw all points

    for(var i=0,l=points.length;i<l;i++) {
        points[i].draw();
    }

    // put image data on canvas
    ctx.putImageData(screen,0,0);

    if(document.getElementById("showChunks").checked) {
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle="#ffff0099";
        for(var i=0,l=chunks.length;i<l;i++) {
            chunks[i].draw();
        }
    }

    // loop
    requestAnimationFrame(draw);
}
