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
            this.selection = {};
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
        AuctionController.$inject = ['$scope', '$timeout', '$interval', 'NetworkService', 'AuctionModel'];
        return AuctionController;
    })();
    Madbid.AuctionController = AuctionController;
    angular.module('madbid.controller').controller('AuctionController', AuctionController);
})(Madbid || (Madbid = {}));
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
//# sourceMappingURL=AuctionController.js.map