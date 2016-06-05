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

function onMessage(event) {
    switch (event.data) {
        case "showScrollbar":
            document.body.style.overflow = "auto";
        break;

        case "hideScrollbar":
            document.body.style.overflow = "hidden";
        break;
    }
}

if (parent) {
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(resize);
    window.addEventListener("message", onMessage);
}
