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
        public constantBidTime: number;

        public messaging: Messaging;

        constructor(
            private $scope: ng.IScope,
            private $timeout: ng.ITimeoutService,
            private $interval: ng.IIntervalService,
            private networkService: Madbid.services.NetworkService,
            private auctionModel: Madbid.models.AuctionModel
        ){
            this.messaging = new Messaging();
            //this.messaging.addListener(this.onReceiveMessage);

            this.selection = {};
            this.timeSelection = {
                dateMin: null,
                dateMax: null
            };
            this.constantBidTime = 1;

            this.model = auctionModel.getModel();

            networkService.addListener(function(res){
                auctionModel.handleUpdate(res);
                $scope.$digest();
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
        public activeAutobid(auction: Auction, constantBidTime: number){
            this.messaging.sendMessage({
                action: 'start',
                autobid: auction.getId(),
                bidTime: constantBidTime
            });
        }
        public stopAutobid(){
            this.messaging.sendMessage({
                action: 'stop'
            });
        }

        /*public onReceiveMessage(msg: any){
            console.log(msg);
        }*/
    }

    Madbid.registerController('AuctionController', AuctionController);
}
