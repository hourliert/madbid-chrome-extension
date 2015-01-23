/**
 *
 * Created by thomashourlier on 22/01/15.
 */
/// <reference path='../_all.ts' />
var port = chrome.runtime.connect({ name: "madbid" });
var listener = function (msg) {
    var data = JSON.parse(msg.data);
    if (data.action !== 'bid' && data.action !== 'compute')
        return;
    port.postMessage(data);
};
port.onMessage.addListener(function (msg) {
    if (msg.action && msg.action !== 'bid' && msg.action !== 'compute') {
        var s = document.createElement('script');
        s.src = chrome.extension.getURL('scripts/injected/autobidder.js');
        s.onload = function () {
            window.postMessage(JSON.stringify(msg), '*');
            this.parentNode.removeChild(this);
            window.addEventListener('message', listener);
        };
        (document.head || document.documentElement).appendChild(s);
    }
});
//# sourceMappingURL=contentscript.js.map