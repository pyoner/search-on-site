
function injectSearchForm(tab) {
    var details = {
        file: "search.js"
    }
    chrome.tabs.executeScript(tab.id, details);
}

chrome.browserAction.onClicked.addListener(injectSearchForm);


var CSP_RULE = "https://pyoner.github.io/";
var filterUrls = {
    urls: ["http://*/*", "https://*/*"],
    types: ["main_frame"]
}
var spec = ["blocking", "responseHeaders"];
function changeCSPHeader(details){
    for (var i = 0; i < details.responseHeaders.length; i++) {
        var header = details.responseHeaders[i];
        if (header.name == "Content-Security-Policy") {
            header.value = header.value.replace(/(?:frame|child)\-src\s+(?:'none'|([^;]*));?/gi, "child-src " + CSP_RULE + " $1;");
            if (header.value.indexOf("child-src ") == -1){
                if(!header.value.test(/;\s*$/)) {
                    header.value += ";";
                }
                header.value += "child-src " + CSP_RULE + ";";
            }
            return {responseHeaders: details.responseHeaders}
        }
    }
}
chrome.webRequest.onHeadersReceived.addListener(changeCSPHeader, filterUrls, spec);
