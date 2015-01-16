/**
 * Created by thomashourlier on 12/01/15.
 */
/// <reference path='../_all.ts' />
var Madbid;
(function (Madbid) {
    var AuctionModel = (function () {
        function AuctionModel(storage, $interval) {
            this.storage = storage;
            this.$interval = $interval;
            this.ah = new Madbid.AuctionHouse();
            this.timeReference = new Date();
            this.restoreData();
            $interval(angular.bind(this, function () {
                this.timeReference.setSeconds(this.timeReference.getSeconds() + 1);
                this.ah.updateAuctionsEndTime(this.timeReference);
            }), 1000);
        }
        AuctionModel.prototype.singletonBidder = function (name) {
            var bidder = this.ah.getBidder(name);
            if (!bidder) {
                bidder = new Madbid.Bidder(this.ah, name);
                this.ah.addBidder(bidder);
            }
            return bidder;
        };
        AuctionModel.prototype.singletonItem = function (id) {
            var item = this.ah.getItem(id);
            if (!item) {
                item = new Madbid.Item(this.ah, id);
                this.ah.addItem(item);
            }
            return item;
        };
        AuctionModel.prototype.singletonAuction = function (item) {
            var auction = this.ah.getAuction(item.getId());
            if (!auction) {
                auction = new Madbid.Auction(this.ah, item);
                this.ah.addAuction(auction);
            }
            return auction;
        };
        AuctionModel.prototype.getModel = function () {
            return this.ah;
        };
        AuctionModel.prototype.saveData = function () {
            this.storage.set('full-cache', this.ah.toJson());
        };
        AuctionModel.prototype.restoreData = function () {
            var data = this.storage.get('full-cache'), i, ii, b, bb, auction, auctions, item, bidder, bidders, bid, bids, localItem, localBidder, localAuction, localBid, biddersRes = {}, itemsRes = {}, auctionsRes = {};
            if (!data)
                return;
            auctions = data.auctions;
            for (i = 0, ii = auctions.length; i < ii; i++) {
                auction = auctions[i];
                item = auction.item;
                bidders = auction.bidders;
                bids = auction.bids;
                localItem = this.singletonItem(item.id);
                localItem.updateStat(item);
                itemsRes[localItem.getId()] = localItem;
                localAuction = this.singletonAuction(localItem);
                localAuction.updateStat(auction);
                auctionsRes[localAuction.getId()] = localAuction;
                for (b = 0, bb = bidders.length; b < bb; b++) {
                    bidder = bidders[b];
                    localBidder = this.singletonBidder(bidder.bidderName);
                    localBidder.addAuction(localAuction);
                    biddersRes[localBidder.getId()] = localBidder;
                    localAuction.addBidder(localBidder);
                }
                for (b = 0, bb = bids.length; b < bb; b++) {
                    bid = bids[b];
                    localBidder = this.singletonBidder(bid.bidderName);
                    localBid = new Madbid.Bid(localAuction, localBidder);
                    localBidder.addAuction(localAuction);
                    localBidder.addBid(localBid);
                    localBid.updateStat(bid);
                    localAuction.addBidder(localBidder);
                    localAuction.addBid(localBid);
                }
            }
            console.log(this.ah);
        };
        AuctionModel.prototype.clearCache = function () {
            this.storage.clearAll();
            delete this.ah;
            this.ah = new Madbid.AuctionHouse();
        };
        AuctionModel.prototype.handleUpdate = function (json) {
            var response, localItem, localBidder, localAuction, localBid, bidParam, auctionParam, itemParam, i, ii, auction, item;
            if (json.cmd === "/update") {
                response = json.response;
                this.timeReference = new Date(response.reference.timestamp);
                for (i = 0, ii = response.items.length; i < ii; i++) {
                    auction = response.items[i];
                    try {
                        if (!auction.auction_id || !auction.highest_bid || !auction.highest_bidder)
                            throw 'Incorrect Auction';
                        bidParam = {
                            value: auction.highest_bid,
                            date: new Date(auction.date_bid)
                        };
                        auctionParam = {
                            endTime: new Date(auction.date_timeout)
                        };
                    }
                    catch (e) {
                        continue;
                    }
                    localItem = this.singletonItem(auction.auction_id);
                    localAuction = this.singletonAuction(localItem);
                    localBidder = this.singletonBidder(auction.highest_bidder);
                    localBid = new Madbid.Bid(localAuction, localBidder);
                    localItem.setAuction(localAuction);
                    localBid.updateStat(bidParam);
                    localAuction.updateStat(auctionParam);
                    localAuction.addBidder(localBidder);
                    localAuction.addBid(localBid);
                    localBidder.addBid(localBid);
                    localBidder.addAuction(localAuction);
                }
            }
            else if (json.cmd === '/load/current') {
                response = json.response;
                this.timeReference = new Date(response.reference.timestamp);
                for (i = 0, ii = response.items.length; i < ii; i++) {
                    item = response.items[i];
                    try {
                        if (!item.auction_id || !item.auction_data.last_bid.highest_bidder)
                            throw 'Incorrect Item';
                        itemParam = {
                            name: item.title,
                            creditCost: item.auction_data.cerdit_cost,
                            shippingCost: item.shipping_costs,
                            buyNowPrice: (item.buynow_data) ? item.buynow_data.base_price : null,
                            retailPrice: item.rrp
                        };
                        bidParam = {
                            value: item.auction_data.last_bid.highest_bid,
                            date: new Date(item.auction_data.last_bid.date_bid)
                        };
                        auctionParam = {
                            endTime: new Date(item.auction_data.last_bid.date_timeout)
                        };
                    }
                    catch (e) {
                        continue;
                    }
                    localItem = this.singletonItem(item.auction_id);
                    localAuction = this.singletonAuction(localItem);
                    localBidder = this.singletonBidder(item.auction_data.last_bid.highest_bidder);
                    localBid = new Madbid.Bid(localAuction, localBidder);
                    localItem.updateStat(itemParam);
                    localItem.setAuction(localAuction);
                    localBid.updateStat(item);
                    localAuction.updateStat(item);
                    localAuction.addBidder(localBidder);
                    localAuction.addBid(localBid);
                    localBidder.addBid(localBid);
                    localBidder.addAuction(localAuction);
                }
            }
            console.log(this.ah);
            this.saveData();
        };
        AuctionModel.$inject = ['storage', '$interval'];
        return AuctionModel;
    })();
    Madbid.AuctionModel = AuctionModel;
    angular.module('madbid.model').service('AuctionModel', Madbid.AuctionModel);
})(Madbid || (Madbid = {}));
//# sourceMappingURL=AuctionModel.js.map