/**
 * Created by thomashourlier on 15/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    (function (BidderType) {
        BidderType[BidderType["Aggressive"] = 0] = "Aggressive";
        BidderType[BidderType["Pacing"] = 1] = "Pacing";
        BidderType[BidderType["Idle"] = 2] = "Idle";
        BidderType[BidderType["SleepyActive"] = 3] = "SleepyActive";
    })(Madbid.BidderType || (Madbid.BidderType = {}));
    var BidderType = Madbid.BidderType;
    var Bidder = (function () {
        function Bidder(ah, param) {
            this.name = param.bidderName;
            this.ah = ah;
            this.bids = {};
            this.bidsArray = [];
            this.auctions = {};
            this.bidsByAuction = {};
            this.bidsByAuctionArray = [];
            this.bidderTypeByAuction = {};
            this.lastBidByAuction = {};
            this.consideredPersistentByAuction = {};
        }
        Bidder.prototype.setBidderType = function (auction, type) {
            if (type !== 2 /* Idle */)
                this.consideredPersistentByAuction[auction.getId()] = true;
            this.bidderTypeByAuction[auction.getId()] = type;
        };
        Bidder.prototype.isPersistent = function (auction) {
            return this.isAggresive(auction) || this.isPacing(auction) || this.isSleepyActive(auction);
        };
        Bidder.prototype.isPacing = function (auction) {
            return this.bidderTypeByAuction[auction.getId()] === 1 /* Pacing */;
        };
        Bidder.prototype.isIdle = function (auction) {
            return this.bidderTypeByAuction[auction.getId()] === 2 /* Idle */;
        };
        Bidder.prototype.isAggresive = function (auction) {
            return this.bidderTypeByAuction[auction.getId()] === 0 /* Aggressive */;
        };
        Bidder.prototype.isSleepyActive = function (auction) {
            return this.bidderTypeByAuction[auction.getId()] === 3 /* SleepyActive */;
        };
        Bidder.prototype.detectType = function (auction) {
            var bid, bidsArray, nbShortBid = 0, nbShortBidForSleepy = 0, nbLongBid = 0, nbTotalBid = 0, now = new Date(), i, ii;
            if (!(bidsArray = this.bidsByAuctionArray[auction.getId()]))
                return 2 /* Idle */;
            for (i = 0, ii = bidsArray.length; i < ii; i++) {
                bid = bidsArray[i];
                nbTotalBid++;
                if ((+bid.date + Madbid.shortPeriod * 1000) > +now)
                    nbShortBid++;
                if ((+bid.date + Madbid.longPeriod * 1000) > +now)
                    nbLongBid++;
                if ((+bid.date + Madbid.shortPeriodForSleepy * 1000) > +now)
                    nbShortBidForSleepy++;
            }
            if (nbShortBid >= Madbid.minAggrBid)
                return 0 /* Aggressive */;
            if (nbShortBid >= 1 && nbLongBid >= Madbid.minPacingBid && nbTotalBid >= Madbid.minTotalBid)
                return 1 /* Pacing */;
            if (this.consideredPersistentByAuction[auction.getId()] && nbShortBidForSleepy >= 1)
                return 3 /* SleepyActive */;
        };
        Bidder.prototype.updateStat = function (param) {
        };
        Bidder.prototype.getId = function () {
            return this.name;
        };
        Bidder.prototype.addBid = function (bid) {
            var bidsForMap = this.bidsByAuction[bid.auction.getId()], bidsForArray = this.bidsByAuctionArray[bid.auction.getId()];
            if (!bidsForMap)
                this.bidsByAuction[bid.auction.getId()] = {};
            if (!bidsForArray)
                this.bidsByAuctionArray[bid.auction.getId()] = [];
            bidsForMap = this.bidsByAuction[bid.auction.getId()];
            bidsForArray = this.bidsByAuctionArray[bid.auction.getId()];
            this.bids[bid.getId()] = bid;
            if (bid !== this.bidsArray[this.bidsArray.length - 1])
                this.bidsArray.push(bid);
            bidsForMap[bid.getId()] = bid;
            if (bid !== bidsForArray[bidsForArray.length - 1])
                bidsForArray.push(bid);
            this.lastBidByAuction[bid.auction.getId()] = bid;
        };
        Bidder.prototype.hasBidOn = function (auction) {
            if (this.auctions[auction.getId()]) {
                return true;
            }
            else {
                return false;
            }
        };
        Bidder.prototype.hasBidOnBetween = function (auction, date1, date2) {
            var i, bid = this.lastBidByAuction[auction.getId()];
            if (bid && bid.isBetween(date1, date2))
                return true;
            for (i in this.bids) {
                bid = this.bids[i];
                if (bid.isOn(auction) && bid.isBetween(date1, date2))
                    return true;
            }
            return false;
        };
        Bidder.prototype.getNumberBidsOn = function (auction, date1, date2) {
            var cpt = 0, bid, i, bidMap = this.bidsByAuction[auction.getId()];
            for (i in bidMap) {
                bid = bidMap[i];
                if (bid.isBetween(date1, date2))
                    cpt++;
            }
            return cpt;
        };
        Bidder.prototype.addAuction = function (auction) {
            this.auctions[auction.getId()] = auction;
        };
        Bidder.prototype.toJson = function () {
            var obj = {
                bidderName: this.name
            };
            return obj;
        };
        return Bidder;
    })();
    Madbid.Bidder = Bidder;
})(Madbid || (Madbid = {}));
//# sourceMappingURL=Bidder.js.map