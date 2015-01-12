/**
 * Created by thomashourlier on 12/01/15.
 */

var AuctionController = function(NetworkService, AuctionModel){
  this.itemsModel = AuctionModel.getItems();
  this.biddersModel = AuctionModel.getBidders();

  this.selection = {
    selectedItem : '',
    selectedBidder : ''
  };

  NetworkService.addListener(AuctionModel.handleUpdate);
};

AuctionController.$inject= ['NetworkService', 'AuctionModel'];


angular.module('madbid.controller')
.controller('AuctionController', AuctionController);