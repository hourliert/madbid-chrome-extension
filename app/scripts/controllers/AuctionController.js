/**
 * Created by thomashourlier on 12/01/15.
 */

var AuctionController = function($scope, $timeout, $interval, NetworkService, AuctionModel){
  var timer;

  this.model = AuctionModel.getModel();
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


AuctionController.$inject= ['$scope', '$timeout', '$interval', 'NetworkService', 'AuctionModel'];


angular.module('madbid.controller')
.controller('AuctionController', AuctionController);