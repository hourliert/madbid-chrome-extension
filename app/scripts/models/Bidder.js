/**
 * Created by thomashourlier on 15/01/15.
 */
/// <reference path='../_all.ts' />
var Madbid;
(function (Madbid) {
    var Bidder = (function () {
        function Bidder(ah, name) {
            this.name = name;
            this.ah = ah;
            this.bids = {};
            this.auctions = {};
        }
        Bidder.prototype.getId = function () {
            return this.name;
        };
        Bidder.prototype.addBid = function (bid) {
            this.bids[bid.getId()] = bid;
        };
        Bidder.prototype.isBiddingOn = function (auction) {
            if (this.auctions[auction.getId()]) {
                return true;
            }
            else {
                return false;
            }
        };
        Bidder.prototype.getNumberBidsOn = function (auction) {
            var cpt = 0, bid, i;
            for (i in this.bids) {
                bid = this.bids[i];
                if (bid.isOn(auction))
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