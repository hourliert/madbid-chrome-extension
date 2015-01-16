/**
 * Created by thomashourlier on 12/01/15.
 */
/// <reference path='../_all.ts' />
var Madbid;
(function (Madbid) {
    var AuctionController = (function () {
        function AuctionController($scope, $timeout, $interval, networkService, auctionModel) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.$interval = $interval;
            this.networkService = networkService;
            this.auctionModel = auctionModel;
            networkService.addListener(function (res) {
                $scope.$apply(function () {
                    auctionModel.handleUpdate(res);
                });
            });
            $interval(angular.bind(this, function () {
                this.time = new Date();
            }), 1000);
        }
        AuctionController.prototype.resetCache = function () {
            this.auctionModel.clearCache();
        };
        AuctionController.$inject = ['$scope', '$timeout', '$interval', 'NetworkService', 'AuctionModel'];
        return AuctionController;
    })();
    Madbid.AuctionController = AuctionController;
    angular.module('madbid.controller').controller('AuctionController', AuctionController);
})(Madbid || (Madbid = {}));
//# sourceMappingURL=AuctionController.js.map