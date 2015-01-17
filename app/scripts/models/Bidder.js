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
    })(Madbid.BidderType || (Madbid.BidderType = {}));
    var BidderType = Madbid.BidderType;
    var Bidder = (function () {
        function Bidder(ah, param) {
            this.name = param.bidderName;
            this.ah = ah;
            this.bids = {};
            this.auctions = {};
        }
        Bidder.prototype.updateStat = function (param) {
        };
        Bidder.prototype.getId = function () {
            return this.name;
        };
        Bidder.prototype.addBid = function (bid) {
            this.bids[bid.getId()] = bid;
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
            var i, bid;
            for (i in this.bids) {
                bid = this.bids[i];
                if (bid.isOn(auction) && bid.isBetween(date1, date2))
                    return true;
            }
            return false;
        };
        Bidder.prototype.getNumberBidsOn = function (auction, date1, date2) {
            var cpt = 0, bid, i;
            for (i in this.bids) {
                bid = this.bids[i];
                if (bid.isOn(auction) && bid.isBetween(date1, date2))
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