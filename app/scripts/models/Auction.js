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
            this.bidsArray = [];
            this.closed = false;
            this.endingPatternDetected = false;
            this.updateStat(param);
        }
        Auction.prototype.getCloseToEndBids = function () {
            var obj = {}, i, bid;
            for (i in this.bids) {
                bid = this.bids[i];
                if (bid.delayBeforeEnd <= 2) {
                    obj[bid.getId()] = bid;
                }
            }
            return obj;
        };
        Auction.prototype.updateStat = function (param) {
            var newTime;
            if (param.endTime) {
                newTime = new Date(param.endTime);
                if (+newTime !== +this.endTime) {
                    this.previousEndTime = this.endTime;
                }
                this.endTime = newTime;
                if (!this.previousEndTime) {
                    this.previousEndTime = this.endTime;
                }
            }
            if (param.timeout)
                this.timeout = param.timeout;
            if (param.closed)
                this.closed = param.closed;
            if (+new Date() - +this.endTime > 0)
                this.closed = true;
        };
        Auction.prototype.detectClosing = function () {
            if (!this.timeout || ((+this.lastBid.date + this.timeout * 1000) > +this.endTime))
                this.closed = true;
        };
        Auction.prototype.detectPersistentBidder = function () {
            var i, bidder;
            this.persistentBidderNumber = 0;
            this.pacingBidderNumber = 0;
            this.aggresiveBidderNumber = 0;
            for (i in this.bidders) {
                bidder = this.bidders[i];
                if (bidder.isAggresive(this))
                    this.aggresiveBidderNumber++;
                if (bidder.isPacing(this))
                    this.pacingBidderNumber++;
            }
            this.persistentBidderNumber = this.pacingBidderNumber + this.aggresiveBidderNumber;
        };
        Auction.prototype.detectEndingPattern = function () {
            var i, ii, bid, firstPatternBid, bidSatisfyingPattern = 0;
            for (i = (this.bidsArray.length < 10) ? 0 : this.bidsArray.length - 10, ii = this.bidsArray.length; i < ii; i++) {
                bid = this.bidsArray[i];
                if (!firstPatternBid) {
                    if (bid.delayBeforeEnd <= Madbid.minBidTime)
                        firstPatternBid = bid;
                }
                else {
                    if (bid.delayBeforeEnd >= (this.timeout - Madbid.maxBidTime))
                        bidSatisfyingPattern++;
                }
            }
            this.endingPatternDetected = (bidSatisfyingPattern >= Madbid.minFollowingBid && 0 < this.persistentBidderNumber && this.persistentBidderNumber <= Madbid.maxPersistentBidder);
        };
        Auction.prototype.getId = function () {
            return this.id;
        };
        Auction.prototype.updateRemainingTime = function (reference) {
            this.closed = false;
            this.remainingTime = (+this.endTime - +reference) / 1000;
            if (this.remainingTime < -2) {
                this.closed = true;
            }
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
        Auction.prototype.hasNewBidderOnSince = function (biddersInCourse, date1, date2) {
            var i, bidder;
            for (i in this.bidders) {
                bidder = this.bidders[i];
                if (!bidder.hasBidOnBetween(this, date1, date2))
                    continue;
                if (!biddersInCourse[bidder.getId()]) {
                    return true;
                }
            }
            return false;
        };
        Auction.prototype.hasNewBidTimeSinceFor = function (bidTime, bidder, dateMin, dateMax) {
            var i, bid;
            for (i in this.bids) {
                bid = this.bids[i];
                if (bid.delayBeforeEnd < 0 || bid.delayBeforeEnd > this.timeout || (bidder && bid.bidder !== bidder) || !bid.isBetween(dateMin, dateMax))
                    continue;
                if (!bidTime[bid.delayBeforeEnd])
                    return true;
            }
            return false;
        };
        Auction.prototype.addBid = function (bid) {
            this.bids[bid.getId()] = bid;
            this.lastBid = bid;
            if (bid !== this.bidsArray[this.bidsArray.length - 1])
                this.bidsArray.push(bid);
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
                endTime: (this.endTime) ? this.endTime.toISOString() : '',
                timeout: this.timeout,
                closed: this.closed
            };
            return obj;
        };
        return Auction;
    })();
    Madbid.Auction = Auction;
})(Madbid || (Madbid = {}));
//# sourceMappingURL=Auction.js.map