/**
 * Created by thomashourlier on 15/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var Auction = (function () {
        function Auction(ah, item, param) {
            this.ah = ah;
            this.id = item.getId();
            this.item = item;
            this.bidders = {};
            this.bids = {};
            this.closed = false;
            this.updateStat(param);
        }
        Auction.prototype.updateStat = function (param) {
            if (param.endTime)
                this.endTime = new Date(param.endTime);
            if (+new Date() - +this.endTime > 0)
                this.closed = true;
        };
        Auction.prototype.getId = function () {
            return this.id;
        };
        Auction.prototype.updateEndTime = function (reference) {
            this.closed = false;
            this.remainingTime = (+this.endTime - +reference) / 1000;
            if (this.remainingTime < -2)
                this.closed = true; //we considere that there is 2 seconds of latency
        };
        Auction.prototype.isValid = function () {
            return this.item.isValid() && this.hasBid() && !this.closed;
        };
        Auction.prototype.hasBid = function () {
            return Object.keys(this.bids).length > 0;
        };
        Auction.prototype.getNumberBids = function () {
            return Object.keys(this.bids).length;
        };
        Auction.prototype.hasNewBidderOnSince = function (biddersInCourse, auction, date1, date2) {
            var i, bidder;
            for (i in this.bidders) {
                bidder = this.bidders[i];
                if (!bidder.hasBidOnBetween(auction, date1, date2))
                    continue;
                if (!biddersInCourse[bidder.getId()]) {
                    return true;
                }
            }
            return false;
        };
        Auction.prototype.addBid = function (bid) {
            this.bids[bid.getId()] = bid;
            this.lastBid = bid;
            this.currentPrice = bid.value;
        };
        Auction.prototype.addBidder = function (bidder) {
            this.bidders[bidder.getId()] = bidder;
            this.lastBidder = bidder;
        };
        Auction.prototype.toJson = function () {
            var bids = [], item, i, bidders = [], obj;
            for (i in this.bidders) {
                bidders.push(this.bidders[i].toJson());
            }
            for (i in this.bids) {
                bids.push(this.bids[i].toJson());
            }
            item = this.item.toJson();
            obj = {
                id: this.id,
                bids: bids,
                bidders: bidders,
                item: item,
                endTime: this.endTime.toISOString()
            };
            return obj;
        };
        return Auction;
    })();
    Madbid.Auction = Auction;
})(Madbid || (Madbid = {}));
//# sourceMappingURL=Auction.js.map