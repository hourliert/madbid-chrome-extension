/**
 * Created by thomashourlier on 12/01/15.
 */

var AuctionController = function($scope, $timeout, NetworkService, AuctionModel){
  this.itemsModel = AuctionModel.getItems();
  this.biddersModel = AuctionModel.getBidders();

  this.selection = {
    selectedItem : '',
    selectedBidder : ''
  };

  NetworkService.addListener(function(res){
    $scope.$apply(function(){
      AuctionModel.handleUpdate(res);
    })
  });
};

AuctionController.$inject= ['$scope', '$timeout', 'NetworkService', 'AuctionModel'];


angular.module('madbid.controller')
.controller('AuctionController', AuctionController);