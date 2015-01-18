/**
 * Created by thomashourlier on 12/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var models;
    (function (models) {
        var AuctionModel = (function () {
            function AuctionModel(storage, $interval, $timeout) {
                this.storage = storage;
                this.$interval = $interval;
                this.$timeout = $timeout;
                this.ah = new Madbid.AuctionHouse();
                this.timeReference = new Date();
                this.restoreData();
                $interval(angular.bind(this, function () {
                    this.timeReference.setSeconds(this.timeReference.getSeconds() + 1);
                    this.ah.compute(this.timeReference); //computation of all data only every seconds.. lot of watcher, I have to preserve angular performances...
                    this.saveData();
                }), 1000);
            }
            AuctionModel.prototype.singletonBidder = function (param) {
                var bidder = this.ah.getBidder(param.bidderName);
                if (!bidder) {
                    bidder = new Madbid.Bidder(this.ah, param);
                    this.ah.addBidder(bidder);
                }
                else {
                    bidder.updateStat(param);
                }
                return bidder;
            };
            AuctionModel.prototype.singletonItem = function (param) {
                var item = this.ah.getItem(param.id);
                if (!item) {
                    item = new Madbid.Item(this.ah, param);
                    this.ah.addItem(item);
                }
                else {
                    item.updateStat(param);
                }
                return item;
            };
            AuctionModel.prototype.singletonAuction = function (item, param) {
                var auction = this.ah.getAuction(item.getId());
                if (!auction) {
                    auction = new Madbid.Auction(this.ah, item, param);
                    this.ah.addAuction(auction);
                }
                else {
                    auction.updateStat(param);
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
                    localItem = this.singletonItem(item);
                    itemsRes[localItem.getId()] = localItem;
                    localAuction = this.singletonAuction(localItem, auction);
                    auctionsRes[localAuction.getId()] = localAuction;
                    for (b = 0, bb = bidders.length; b < bb; b++) {
                        bidder = bidders[b];
                        localBidder = this.singletonBidder(bidder);
                        localBidder.addAuction(localAuction);
                        biddersRes[localBidder.getId()] = localBidder;
                        localAuction.addBidder(localBidder);
                    }
                    for (b = 0, bb = bids.length; b < bb; b++) {
                        bid = bids[b];
                        localBidder = this.singletonBidder({ bidderName: bid.bidderName });
                        localBid = new Madbid.Bid(localAuction, localBidder, bid);
                        localBidder.addAuction(localAuction);
                        localBidder.addBid(localBid);
                        localAuction.addBidder(localBidder);
                        localAuction.addBid(localBid);
                    }
                }
                //console.log(this.ah);
            };
            AuctionModel.prototype.clearCache = function () {
                this.storage.clearAll();
                this.ah = new Madbid.AuctionHouse();
            };
            AuctionModel.prototype.handleUpdate = function (json) {
                var response, localItem, localBidder, localAuction, localBid, bidParam, auctionParam, itemParam, i, ii, auction, limitDate, item;
                if (json.cmd === "/update") {
                    response = json.response;
                    this.timeReference = new Date(response.reference.timestamp);
                    limitDate = new Date(response.reference.timestamp);
                    limitDate.setMonth(limitDate.getMonth() - 1);
                    for (i = 0, ii = response.items.length; i < ii; i++) {
                        auction = response.items[i];
                        try {
                            //validation of madbid response... lot of shitty bug in their responses...
                            if (!auction.auction_id || !auction.highest_bid || !auction.highest_bidder || !auction.date_bid || auction.state !== 3 || new Date(auction.date_bid) < limitDate)
                                throw 'Incorrect Auction';
                            bidParam = {
                                value: auction.highest_bid,
                                date: auction.date_bid
                            };
                            auctionParam = {
                                id: auction.auction_id,
                                endTime: auction.date_timeout,
                                timeout: auction.timeout
                            };
                        }
                        catch (e) {
                            continue;
                        }
                        localItem = this.singletonItem({ id: auction.auction_id });
                        localAuction = this.singletonAuction(localItem, auctionParam);
                        localBidder = this.singletonBidder({ bidderName: auction.highest_bidder });
                        localBid = new Madbid.Bid(localAuction, localBidder, bidParam);
                        localItem.setAuction(localAuction);
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
                                id: item.auction_id,
                                name: item.title,
                                creditCost: item.auction_data.cerdit_cost,
                                shippingCost: item.shipping_costs,
                                buyNowPrice: (item.buynow_data) ? item.buynow_data.base_price : null,
                                retailPrice: item.rrp
                            };
                            auctionParam = {
                                id: item.auction_id,
                                endTime: item.auction_data.last_bid.date_timeout
                            };
                        }
                        catch (e) {
                            continue;
                        }
                        localItem = this.singletonItem(itemParam);
                        localAuction = this.singletonAuction(localItem, auctionParam);
                        localBidder = this.singletonBidder({ bidderName: item.auction_data.last_bid.highest_bidder });
                        localItem.setAuction(localAuction);
                        localAuction.addBidder(localBidder);
                        localBidder.addAuction(localAuction);
                    }
                }
            };
            AuctionModel.$inject = ['storage', '$interval', '$timeout'];
            return AuctionModel;
        })();
        models.AuctionModel = AuctionModel;
        Madbid.registerModel('AuctionModel', AuctionModel);
    })(models = Madbid.models || (Madbid.models = {}));
})(Madbid || (Madbid = {}));
//# sourceMappingURL=AuctionModel.js.map