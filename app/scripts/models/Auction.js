/**
 * Created by thomashourlier on 15/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var Auction = (function () {
        function Auction(ah, item) {
            this.ah = ah;
            this.id = item.getId();
            this.item = item;
            this.bidders = {};
            this.bids = {};
        }
        Auction.prototype.updateStat = function (param) {
            if (param.endTime)
                this.endTime = new Date(param.endTime);
        };
        Auction.prototype.getId = function () {
            return this.id;
        };
        Auction.prototype.updateEndTime = function (reference) {
            this.remainingTime = (+reference - +this.endTime) / 1000;
        };
        Auction.prototype.isValid = function () {
            return this.item.isValid() && this.hasBid();
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