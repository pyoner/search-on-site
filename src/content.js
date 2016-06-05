var lastHeight, lastWidth;
function resize() {
    var height = Math.max(document.body.offsetHeight, 40);
    var width = document.body.offsetWidth;

    if (height != lastHeight || width != lastWidth) {
        lastHeight = height;
        lastWidth = width;
        var message = {
            height: height, 
            width: width
        }
        parent.postMessage(message, "*");
    }
    window.requestAnimationFrame(resize);
}

if (parent) {
    window.requestAnimationFrame(resize);
}
