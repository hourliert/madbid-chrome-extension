/**
 * Created by thomashourlier on 12/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid.models {
    export class AuctionModel{
        public static $inject = ['storage', '$interval'];

        private ah: AuctionHouse;
        public timeReference: Date;

        constructor(
            private storage: ng.localStorage.ILocalStorageService,
            private $interval: ng.IIntervalService
        ){
            this.ah = new AuctionHouse();
            this.timeReference = new Date();
            this.restoreData();

            $interval(angular.bind(this, function(){
                this.timeReference.setSeconds(this.timeReference.getSeconds() + 1);
                this.ah.updateAuctionsEndTime(this.timeReference);
                this.ah.detectClosedAuction();
            }), 1000);
        }

        private singletonBidder(param: ISerializedBidder){
            var bidder: Bidder = this.ah.getBidder(param.bidderName);
            if (!bidder){
                bidder = new Bidder(this.ah, param);
                this.ah.addBidder(bidder);
            } else {
                bidder.updateStat(param);
            }
            return bidder;
        }
        private singletonItem(param: ISerializedItem){
            var item: Item = this.ah.getItem(param.id);
            if (!item){
                item = new Item(this.ah, param);
                this.ah.addItem(item);
            } else {
                item.updateStat(param);
            }
            return item;
        }
        private singletonAuction(item: Item, param: ISerializedAuction){
            var auction: Auction = this.ah.getAuction(item.getId());
            if (!auction){
                auction = new Auction(this.ah, item, param);
                this.ah.addAuction(auction);
            } else {
                auction.updateStat(param);
            }
            return auction;
        }

        public getModel(){
            return this.ah;
        }
        public saveData(){
            this.storage.set('full-cache', this.ah.toJson());
        }
        public restoreData(){
            var data: ISerializedAuctionHouse = this.storage.get('full-cache'),

                i: number,
                ii: number,
                b: number,
                bb: number,

                auction: ISerializedAuction,
                auctions: Array<ISerializedAuction>,

                item: ISerializedItem,

                bidder: ISerializedBidder,
                bidders: Array<ISerializedBidder>,

                bid: ISerializedBid,
                bids: Array<ISerializedBid>,

                localItem: Item,
                localBidder: Bidder,
                localAuction: Auction,
                localBid: Bid,

                biddersRes: IBidderMap = {},
                itemsRes: IItemMap = {},
                auctionsRes: IAuctionMap = {};

            if (!data) return;

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


                for (b = 0, bb = bidders.length; b < bb; b++){
                    bidder = bidders[b];

                    localBidder = this.singletonBidder(bidder);
                    localBidder.addAuction(localAuction);
                    biddersRes[localBidder.getId()] = localBidder;

                    localAuction.addBidder(localBidder);
                }

                for (b = 0, bb = bids.length; b < bb; b++){
                    bid = bids[b];

                    localBidder = this.singletonBidder({bidderName: bid.bidderName});
                    localBid = new Bid(localAuction, localBidder, bid);

                    localBidder.addAuction(localAuction);
                    localBidder.addBid(localBid);

                    localAuction.addBidder(localBidder);
                    localAuction.addBid(localBid);
                }
            }

            //console.log(this.ah);
        }
        public clearCache(){
            this.storage.clearAll();
            this.ah = new AuctionHouse();
        }
        public handleUpdate(json: IMadbidResponse){
            var response: any,
                localItem: Item,
                localBidder: Bidder,
                localAuction: Auction,
                localBid: Bid,
                bidParam: ISerializedBid,
                auctionParam: ISerializedAuction,
                itemParam: ISerializedItem,
                i: number,
                ii: number,
                auction: IMadbidAuction,
                limitDate: Date,
                item: IMadbidItem;

            if (json.cmd === "/update"){
                response = <IMadbidUpdateResponse> json.response;
                this.timeReference = new Date(response.reference.timestamp);
                limitDate = new Date(response.reference.timestamp);
                limitDate.setMonth(limitDate.getMonth() - 1);

                for (i = 0, ii = response.items.length; i < ii; i++) {
                    auction = response.items[i];

                    try {
                        //validation of madbid response... lot of shitty bug in their responses...
                        if (!auction.auction_id || !auction.highest_bid || !auction.highest_bidder || !auction.date_bid || auction.state !== 3 || new Date(auction.date_bid) < limitDate) throw 'Incorrect Auction';
                        bidParam = {
                            value: auction.highest_bid,
                            date: auction.date_bid
                        };
                        auctionParam = {
                            id: auction.auction_id,
                            endTime: auction.date_timeout,
                            timeout: auction.timeout
                        };
                    } catch(e) {
                        continue;
                    }

                    localItem = this.singletonItem({id: auction.auction_id});
                    localAuction = this.singletonAuction(localItem, auctionParam);
                    localBidder = this.singletonBidder({bidderName: auction.highest_bidder});
                    localBid = new Bid(localAuction, localBidder, bidParam);

                    localItem.setAuction(localAuction);

                    localAuction.addBidder(localBidder);
                    localAuction.addBid(localBid);

                    localBidder.addBid(localBid);
                    localBidder.addAuction(localAuction);
                }
            } else if (json.cmd === '/load/current') {
                response = <IMadbidRefreshResponse> json.response;
                this.timeReference = new Date(response.reference.timestamp);

                for (i = 0, ii = response.items.length; i < ii; i++) {
                    item = response.items[i];

                    try {
                        if (!item.auction_id || !item.auction_data.last_bid.highest_bidder) throw 'Incorrect Item';
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
                    } catch (e) {
                        continue;
                    }

                    localItem = this.singletonItem(itemParam);
                    localAuction = this.singletonAuction(localItem, auctionParam);
                    localBidder = this.singletonBidder({bidderName: item.auction_data.last_bid.highest_bidder});

                    localItem.setAuction(localAuction);
                    localAuction.addBidder(localBidder);
                    localBidder.addAuction(localAuction);
                }
            }

            //console.log(this.ah);
            this.saveData();
        }
    }

    Madbid.registerModel('AuctionModel', AuctionModel);
}

