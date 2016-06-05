var site_url = "https://pyoner.github.io/search-on-site/";
var site_origin = "https://pyoner.github.io";
var id = "search-on-site";

function injectIframe(id, url) {
    var iframe = document.createElement("iframe");
    iframe.id = id;
    iframe.src = url + "?as_sitesearch=" + encodeURIComponent(document.domain);
    iframe.setAttribute("frameborder", "0");

    var style = {
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        width: "100%",
        zIndex: 9999999,
        boxShadow: "0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
    }

    for (var k in style) {
        iframe.style[k] = style[k];
    }

    document.body.appendChild(iframe);
}

function onMessage(event) {
    if (event.origin != site_origin) {
        return;
    }
    var f = document.getElementById(id);
    var message = "";
    if (event.data.height > window.innerHeight) {
        f.style.height = "100%";
        message = "showScrollbar";
        document.body.style.overflow = "hidden";
    } else {
        f.style.height = event.data.height + "px";
        message = "hideScrollbar";
        document.body.style.overflow = "auto";
    }
    event.source.postMessage(message, event.origin);
}

var f = document.getElementById(id);
if (f){
    if ("none" == f.style.display) {
        f.style.display = "block";
    } else {
        f.style.display = "none";
        document.body.style.overflow = "auto";
    }
} else {
    injectIframe(id, site_url);
    window.addEventListener("message", onMessage);
}
