/**
 * Created by thomashourlier on 12/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid.controllers {
    interface IUserSelection{
        auction?: Auction;
        bidder?: Bidder;
    }

    export class AuctionController {
        public static $inject = ['$scope', '$timeout', '$interval', 'NetworkService', 'AuctionModel'];

        public model: AuctionHouse;
        public time: Date;
        public selection: IUserSelection;
        public timeSelection: ITimeSelection;

        constructor(
            private $scope: ng.IScope,
            private $timeout: ng.ITimeoutService,
            private $interval: ng.IIntervalService,
            private networkService: Madbid.services.NetworkService,
            private auctionModel: Madbid.models.AuctionModel
        ){
            this.selection = {};
            this.timeSelection = {
                dateMin: null,
                dateMax: null
            };

            this.model = auctionModel.getModel();

            networkService.addListener(function(res){
                $scope.$apply(function(){
                    auctionModel.handleUpdate(res);
                });
            });
            $interval(angular.bind(this, function(){
                this.time = new Date();
            }), 1000);
        }

        public resetCache(){
            this.auctionModel.clearCache();
        }
        public changingAuction(){
            this.timeSelection.dateMin = null;
            this.timeSelection.dateMax = null;
            this.selection.bidder = null;
        }
        public observeBidderSelection(bidderName: string){
            this.selection.bidder = this.model.getBidder(bidderName);
        }
    }

    Madbid.registerController('AuctionController', AuctionController);
}
