/**
 * Created by thomashourlier on 15/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    Madbid.shortPeriod = 60;
    Madbid.longPeriod = 300;
    Madbid.minAggrBid = 5;
    Madbid.minPacingBid = 5;
    Madbid.minTotalBid = 20;
    Madbid.minBidTime = 2;
    Madbid.minFollowingBid = 1;
    Madbid.maxBidTime = 2;
    Madbid.maxPersistentBidder = 2;
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
        AuctionHouse.prototype.detectClosedAuction = function () {
            var i;
            for (i in this.auctions) {
                this.auctions[i].detectClosing();
            }
        };
        AuctionHouse.prototype.updateAuctionsEndTime = function (reference) {
            var i;
            for (i in this.auctions) {
                this.auctions[i].updateRemainingTime(reference);
            }
        };
        AuctionHouse.prototype.compute = function (reference) {
            var i, j, auction, bidder;
            for (i in this.auctions) {
                auction = this.auctions[i];
                auction.updateRemainingTime(reference);
                auction.detectClosing();
                for (j in this.bidders) {
                    bidder = this.bidders[j];
                    bidder.setBidderType(auction, bidder.detectType(auction));
                }
                auction.detectPersistentBidder();
                auction.detectEndingPatern();
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