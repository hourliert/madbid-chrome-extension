/**
 * Created by thomashourlier on 12/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
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
            }), 1000);
        }

        private singletonBidder(name: string){
            var bidder: Bidder = this.ah.getBidder(name);
            if (!bidder){
                bidder = new Bidder(this.ah, name);
                this.ah.addBidder(bidder);
            }
            return bidder;
        }
        private singletonItem(id: number){
            var item: Item = this.ah.getItem(id);
            if (!item){
                item = new Item(this.ah, id);
                this.ah.addItem(item);
            }
            return item;
        }
        private singletonAuction(item: Item){
            var auction: Auction = this.ah.getAuction(item.getId());
            if (!auction){
                auction = new Auction(this.ah, item);
                this.ah.addAuction(auction);
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

                localItem = this.singletonItem(item.id);
                localItem.updateStat(item);
                itemsRes[localItem.getId()] = localItem;

                localAuction = this.singletonAuction(localItem);
                localAuction.updateStat(auction);
                auctionsRes[localAuction.getId()] = localAuction;


                for (b = 0, bb = bidders.length; b < bb; b++){
                    bidder = bidders[b];

                    localBidder = this.singletonBidder(bidder.bidderName);
                    localBidder.addAuction(localAuction);
                    biddersRes[localBidder.getId()] = localBidder;

                    localAuction.addBidder(localBidder);
                }

                for (b = 0, bb = bids.length; b < bb; b++){
                    bid = bids[b];
                    localBidder = this.singletonBidder(bid.bidderName);
                    localBid = new Bid(localAuction, localBidder);

                    localBidder.addAuction(localAuction);
                    localBidder.addBid(localBid);

                    localBid.updateStat(bid);

                    localAuction.addBidder(localBidder);
                    localAuction.addBid(localBid);
                }
            }

            console.log(this.ah);
        }
        public clearCache(){
           this.storage.clearAll();
            delete this.ah;
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
                item: IMadbidItem;


            if (json.cmd === "/update"){
                response = <IMadbidUpdateResponse> json.response;
                this.timeReference = new Date(response.reference.timestamp);

                for (i = 0, ii = response.items.length; i < ii; i++) {
                    auction = response.items[i];

                    try {
                        if (!auction.auction_id || !auction.highest_bid || !auction.highest_bidder) throw 'Incorrect Auction';
                        bidParam = {
                            value: auction.highest_bid,
                            date: new Date(auction.date_bid)
                        };
                        auctionParam = {
                            endTime: new Date(auction.date_timeout)
                        };
                    } catch(e) {
                        continue;
                    }

                    localItem = this.singletonItem(auction.auction_id);
                    localAuction = this.singletonAuction(localItem);
                    localBidder = this.singletonBidder(auction.highest_bidder);
                    localBid = new Bid(localAuction, localBidder);

                    localItem.setAuction(localAuction);

                    localBid.updateStat(bidParam);

                    localAuction.updateStat(auctionParam);
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
                    } catch (e) {
                        continue;
                    }


                    localItem = this.singletonItem(item.auction_id);
                    localAuction = this.singletonAuction(localItem);
                    localBidder = this.singletonBidder(item.auction_data.last_bid.highest_bidder);
                    localBid = new Bid(localAuction, localBidder);

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
        }


    }

    angular.module('madbid.model')
        .service('AuctionModel', Madbid.AuctionModel);
}

