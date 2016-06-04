function resize() {
    window.requestAnimationFrame(resize);
    var height = document.body.offsetHeight;
    var width = document.body.offsetWidth;

    if (height <= 0) {return}
    var message = {
        height: height + "px",
        width: width + "px"
    }
    parent.postMessage(message, "*");
}

if (parent) {
    window.requestAnimationFrame(resize);
}
