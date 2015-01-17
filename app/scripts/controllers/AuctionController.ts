/**
 * Created by thomashourlier on 12/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
    export interface IUserSelection{
        auction?: Auction;
        bidder?: Bidder;
    }


    export class AuctionController{
        public static $inject = ['$scope', '$timeout', '$interval', 'NetworkService', 'AuctionModel'];

        public model: AuctionHouse;
        public time: Date;
        public selection: IUserSelection;

        constructor(
            private $scope: ng.IScope,
            private $timeout: ng.ITimeoutService,
            private $interval: ng.IIntervalService,
            private networkService: NetworkService,
            private auctionModel: AuctionModel
        ){
            this.selection = {};
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
    }

    angular.module('madbid.controller').controller('AuctionController', AuctionController);
}

/*var AuctionController = function($scope, $timeout, $interval, NetworkService, AuctionModel){
  var timer;

  //this.model = AuctionModel.getAuctionHouse();
  this.dateFilter = 0;


  this.time = new Date();

  this.selection = {
    selectedItem : '',
    selectedBidder : ''
  };

  NetworkService.addListener(function(res){
    $scope.$apply(function(){
      AuctionModel.handleUpdate(res);
    })
  });

  this.resetCache = function(){
    AuctionModel.clearCache();
    this.selection.selectedBidder = '';
    this.selection.selectedItem = '';
  };

  this.changeAuction = function(){
    this.model.dateMin = null;
    this.model.dateMax = null;
  };

  timer = $interval(angular.bind(this, function(){
   this.time = new Date();
  }), 1000);

  $scope.$on('$destroy', function(){
    $interval.cancel(timer);
  });
};


AuctionController.$inject= ['$scope', '$timeout', '$interval', 'NetworkService', 'AuctionModel'];*/


