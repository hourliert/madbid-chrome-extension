/**
 * Created by thomashourlier on 15/01/15.
 */

function Bidder(ah, name, bids, auctions){
    this.ah = ah;
    this.name = name;
    this.bids = bids || {}; //bids done by this bidder
    this.auctions = auctions || {};
}

Bidder.prototype.getId = function(){
    return this.name;
};

Bidder.prototype.addBid = function(bid){
    this.bids[bid.getId()] = bid;
};

Bidder.prototype.addAuction = function(auction){
    this.auctions[auction.getId()] = auction;
};

Bidder.prototype.toJson = function(stringify){
    var obj = {
        bidderName : this.name
    };

    if (stringify){
        return JSON.stringify(obj);
    } else {
        return obj;
    }
};

Bidder.prototype.fromJson = function(json, ah, bids, auctions){
    var bidderData = JSON.parse(json),
        bidder = new Bidder(ah, bidderData.name, bids, auctions);

    return bidder;
};


