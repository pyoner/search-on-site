
function injectSearchForm(tab) {
    if (tab.url.indexOf("http") == -1){return}
    var details = {
        file: "search.js"
    }
    chrome.tabs.executeScript(tab.id, details);
}

chrome.browserAction.onClicked.addListener(injectSearchForm);


var CSP_RULE = "child-src https://pyoner.github.io/";
var filterUrls = {
    urls: ["http://*/*", "https://*/*"],
    types: ["main_frame"]
}
var spec = ["blocking", "responseHeaders"];
function changeCSPHeader(details){
    for (var i = 0; i < details.responseHeaders.length; i++) {
        var header = details.responseHeaders[i];
        if (header.name == "Content-Security-Policy") {
            header.value = header.value.replace(/(?:frame|child)\-src\s+(?:'none'|([^;]*));?/gi, CSP_RULE + " $1;");
            if (header.value.indexOf("child-src ") == -1){
                if(!header.value.test(/;\s*$/)) {
                    header.value += ";";
                }
                header.value += CSP_RULE + ";";
            }
            return {responseHeaders: details.responseHeaders}
        }
    }
}
chrome.webRequest.onHeadersReceived.addListener(changeCSPHeader, filterUrls, spec);
