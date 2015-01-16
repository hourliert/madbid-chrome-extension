/**
 * Created by thomashourlier on 12/01/15.
 */
/// <reference path='../_all.ts' />
var Madbid;
(function (Madbid) {
    var NetworkService = (function () {
        function NetworkService($q) {
            this.$q = $q;
            this.listeners = [];
            var This = this;
            chrome.devtools.network.onRequestFinished.addListener(function (res) {
                res.getContent(function (data) {
                    This.receiveData(data);
                });
            });
        }
        NetworkService.prototype.receiveData = function (data) {
            var json, i, ii;
            try {
                json = JSON.parse(data);
                for (i = 0, ii = this.listeners.length; i < ii; i++) {
                    this.listeners[i](json || {});
                }
            }
            catch (e) {
            }
        };
        NetworkService.prototype.addListener = function (f) {
            this.listeners.push(f);
        };
        NetworkService.$inject = ['$q'];
        return NetworkService;
    })();
    Madbid.NetworkService = NetworkService;
    angular.module('madbid.service').service('NetworkService', NetworkService);
})(Madbid || (Madbid = {}));
//# sourceMappingURL=NetworkService.js.map