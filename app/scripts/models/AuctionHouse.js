/**
 * Created by thomashourlier on 15/01/15.
 */
/// <reference path='../_all.ts' />
var Madbid;
(function (Madbid) {
    var AuctionHouse = (function () {
        function AuctionHouse(bidders, items, auctions) {
            this.bidders = bidders;
            this.items = items;
            this.auctions = auctions;
            this.bidders = bidders || {};
            this.items = items || {};
            this.auctions = auctions || {};
        }
        AuctionHouse.prototype.addAuction = function (auction) {
            this.auctions[auction.getId()] = auction;
        };
        AuctionHouse.prototype.addBidder = function (bidder) {
            this.bidders[bidder.getId()] = bidder;
        };
        AuctionHouse.prototype.addItem = function (item) {
            this.items[item.getId()] = item;
        };
        AuctionHouse.prototype.getAuction = function (id) {
            return this.auctions[id];
        };
        AuctionHouse.prototype.getBidder = function (id) {
            return this.bidders[id];
        };
        AuctionHouse.prototype.getItem = function (id) {
            return this.items[id];
        };
        AuctionHouse.prototype.updateAuctionsEndTime = function (reference) {
            for (var i in this.auctions) {
                this.auctions[i].updateEndTime(reference);
            }
        };
        AuctionHouse.prototype.toJson = function () {
            var obj, i, auctions = [];
            for (i in this.auctions) {
                auctions.push(this.auctions[i].toJson());
            }
            obj = {
                auctions: auctions
            };
            return obj;
        };
        return AuctionHouse;
    })();
    Madbid.AuctionHouse = AuctionHouse;
})(Madbid || (Madbid = {}));
//# sourceMappingURL=AuctionHouse.js.map