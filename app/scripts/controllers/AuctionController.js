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
                var _this = this;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.$interval = $interval;
                this.networkService = networkService;
                this.auctionModel = auctionModel;
                this.messaging = new Madbid.Messaging();
                this.messaging.addListener(function (msg) { return _this.onReceiveMessage(msg); });
                this.autoBidPlaced = 0;
                this.selection = {};
                this.timeSelection = {
                    dateMin: null,
                    dateMax: null
                };
                this.constantBidTime = 1;
                this.maxBidToPlace = 1;
                this.model = auctionModel.getModel();
                networkService.addListener(function (res) {
                    auctionModel.handleUpdate(res);
                    $scope.$digest();
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
            AuctionController.prototype.activeAutobid = function (auction, constantBidTime, maxBidToPlace) {
                this.autoBidPlaced = 0;
                this.autoBidLive = false;
                this.autoBidEnable = true;
                this.messaging.sendMessage({
                    action: 'start',
                    autobid: auction.getId(),
                    bidTime: constantBidTime,
                    maxBid: maxBidToPlace
                });
            };
            AuctionController.prototype.stopAutobid = function () {
                this.autoBidEnable = false;
                this.autoBidLive = false;
                this.messaging.sendMessage({
                    action: 'stop'
                });
            };
            AuctionController.prototype.onReceiveMessage = function (msg) {
                switch (msg.action) {
                    case 'compute':
                        this.autoBidLive = true;
                        break;
                    case 'bid':
                        this.autoBidPlaced = msg.nbAutoBids;
                        break;
                    case 'done':
                        this.autoBidEnable = false;
                        this.autoBidLive = false;
                        this.autoBidPlaced = msg.nbAutoBids;
                        break;
                }
            };
            AuctionController.$inject = ['$scope', '$timeout', '$interval', 'NetworkService', 'AuctionModel'];
            return AuctionController;
        })();
        controllers.AuctionController = AuctionController;
        Madbid.registerController('AuctionController', AuctionController);
    })(controllers = Madbid.controllers || (Madbid.controllers = {}));
})(Madbid || (Madbid = {}));
//# sourceMappingURL=AuctionController.js.map