/// <reference path='../_all.ts' />
'use strict';
/*chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});*/
var ports = [];
chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name == "madbid");
    ports.push(port);
    port.onMessage.addListener(function (msg) {
        for (var i in ports) {
            ports[i].postMessage(msg);
        }
    });
    port.onDisconnect.addListener(function (port) {
        var index = ports.indexOf(port);
        if (index > -1) {
            ports.splice(index, 1);
        }
    });
});
//# sourceMappingURL=background.js.map