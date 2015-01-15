/**
 * Created by thomashourlier on 15/01/15.
 */

function Auction(ah, id, item, bidders, bids){
    this.ah = ah;
    this.id = id; //item id
    this.item = item;
    this.bidders = bidders || {};
    this.bids = bids || {};

    this.endTime = 0;
}

Auction.prototype.updateStat = function(param){
    var lastBidData = param;

    try{
        lastBidData = param['auction_data']['last_bid'];
    } catch(e){
        //console.log('Auction: has no last_bid');
    }

    this.endTime = new Date(lastBidData['date_timeout']);
};

Auction.prototype.getId = function(){
    return this.id;
};

Auction.prototype.setItem = function(item){
    this.item = item;
};

Auction.prototype.addBid = function(bid){
    this.bids[bid.getId()] = bid;
};

Auction.prototype.addBidder = function(bidder){
    this.bidders[bidder.getId()] = bidder;
};

Auction.prototype.toJson = function(stringify){
    var bids = [],
        item,
        i,
        bidders = [],
        obj;

    for (i in this.bidders){
       bidders.push(this.bidders[i].toJson());
    }
    for (i in this.bids){
        bids.push(this.bids[i].toJson());
    }
    item = this.item.toJson();

    obj = {
        id: this.id,
        bids: bids,
        bidders: bidders,
        item: item,
        date_timeout: this.endTime
    };

    if (stringify){
        return JSON.stringify(obj);
    } else {
        return obj;
    }
};

Auction.prototype.fromJson = function(json, ah, item, bidders, bids){
    var auctionData = JSON.parse(json),
        auction = new Auction(ah, auctionData.id, item, bidders, bids);

    return auction;
};
