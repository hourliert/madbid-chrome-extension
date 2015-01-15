/**
 * Created by thomashourlier on 15/01/15.
 */

function Bid(auction){
    this.auction = auction || {};

    this.bidder = '';
    this.value = 0;
    this.time = '';
    this.delta = 0;
}

Bid.prototype.updateStat = function(param){
    var lastBidData = param;

    try{
        lastBidData = param['auction_data']['last_bid'];
    } catch(e){
        //console.log('Bid: has no last_bid');
    }

    this.value = lastBidData['highest_bid'];
    this.time = new Date(lastBidData['date_bid']);
};

Bid.prototype.setBidder = function(bidder){
    this.bidder = bidder;
};

Bid.prototype.getId = function(){
    return +new Date(this.time) + '_' + this.value;
};

Bid.prototype.toJson = function(stringify){
    var obj = {
        bidderName: this.bidder.getId(),
        highest_bid: this.value,
        date_bid: this.time,
        delta: this.delta
    };

    if (stringify){
        return JSON.stringify(obj);
    } else {
        return obj;
    }
};

Bid.prototype.fromJson = function(json, auction){
    var bidData = JSON.parse(json),
        bid = new Bid(auction);

    bid.bidder = bidData.bidder;
    bid.value = bidData.value;
    bid.time = bidData.time;
    bid.delta = bidData.delta;

    return bid;
};