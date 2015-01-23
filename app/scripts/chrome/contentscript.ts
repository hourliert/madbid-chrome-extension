/**
 *
 * Created by thomashourlier on 22/01/15.
 */

/// <reference path='../_all.ts' />

var port = chrome.runtime.connect({name: "madbid"});

port.onMessage.addListener(function(msg) {
    if (msg.action){
        var s = document.createElement('script');

        s.src = chrome.extension.getURL('scripts/injected/autobidder.js');
        s.onload = function() {
            window.postMessage(JSON.stringify(msg), '*');
            this.parentNode.removeChild(this);
        };
        (document.head||document.documentElement).appendChild(s);
    }
});

