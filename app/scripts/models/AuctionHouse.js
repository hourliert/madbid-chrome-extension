/**
 * Created by thomashourlier on 15/01/15.
 */



function AuctionHouse(bidders, items, auctions){
    this.bidders = bidders || {};
    this.items = items || {};
    this.auctions = auctions || {};
}

AuctionHouse.prototype.getAuction = function(id){
    return this.auctions[id];
};
AuctionHouse.prototype.getAuctions = function(){
    return this.auctions;
};
AuctionHouse.prototype.addAuction = function(auction){
    this.auctions[auction.getId()] = auction;
};


AuctionHouse.prototype.getBidder = function(id){
    return this.bidders[id];
};
AuctionHouse.prototype.getBidders = function(){
    return this.bidders;
};
AuctionHouse.prototype.addBidder = function(bidder){
    this.bidders[bidder.getId()] = bidder;
};


AuctionHouse.prototype.getItem = function(id){
    return this.items[id];
};
AuctionHouse.prototype.getItems = function(){
    return this.items;
};
AuctionHouse.prototype.addItem = function(item){
    this.items[item.getId()] = item;
};

AuctionHouse.prototype.toJson = function(stringify){
    var obj,
        i,
        auctions = [];

    for (i in this.auctions){
        auctions.push(this.auctions[i].toJson());
    }

    obj = {
        auctions: auctions
    };

    if (stringify) {
        return JSON.stringify(obj);
    } else {
        return obj;
    }
}