/**
 * Created by thomashourlier on 12/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var controllers;
    (function (controllers) {
        var AuctionController = (function () {
            function AuctionController($scope, $timeout, $interval, networkService, auctionModel) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.$interval = $interval;
                this.networkService = networkService;
                this.auctionModel = auctionModel;
                this.selection = {};
                this.timeSelection = {
                    dateMin: null,
                    dateMax: null
                };
                this.model = auctionModel.getModel();
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
            AuctionController.prototype.changingAuction = function () {
                this.timeSelection.dateMin = null;
                this.timeSelection.dateMax = null;
                this.selection.bidder = null;
            };
            AuctionController.prototype.observeBidderSelection = function (bidderName) {
                this.selection.bidder = this.model.getBidder(bidderName);
            };
            AuctionController.$inject = ['$scope', '$timeout', '$interval', 'NetworkService', 'AuctionModel'];
            return AuctionController;
        })();
        controllers.AuctionController = AuctionController;
        Madbid.registerController('AuctionController', AuctionController);
    })(controllers = Madbid.controllers || (Madbid.controllers = {}));
})(Madbid || (Madbid = {}));
//# sourceMappingURL=AuctionController.js.map