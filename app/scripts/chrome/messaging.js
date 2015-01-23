/**
 * Created by thomashourlier on 23/01/15.
 */
/// <reference path='../_all.ts' />
var Madbid;
(function (Madbid) {
    var Messaging = (function () {
        function Messaging() {
            var This = this;
            this.listeners = [];
            this.port = chrome.runtime.connect({ name: 'madbid' });
            this.port.onMessage.addListener(function (msg) {
                var i;
                for (i in This.listeners) {
                    This.listeners[i](msg);
                }
            });
        }
        Messaging.prototype.addListener = function (l) {
            this.listeners.push(l);
        };
        Messaging.prototype.sendMessage = function (msg) {
            this.port.postMessage(msg);
        };
        return Messaging;
    })();
    Madbid.Messaging = Messaging;
})(Madbid || (Madbid = {}));
//# sourceMappingURL=messaging.js.map