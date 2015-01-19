/**
 * Created by thomashourlier on 15/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid {
    export interface ISerializedAuctionHouse{
        auctions: Array<ISerializedAuction>;
    }

    export var shortPeriod = 60;
    export var longPeriod = 300;
    export var minAggrBid = 5;
    export var minPacingBid = 5;
    export var minTotalBid = 20;
    export var minBidTime = 2;
    export var minFollowingBid = 1;
    export var maxBidTime = 2;
    export var maxPersistentBidder = 2;

    export class AuctionHouse implements ISerializable{
        constructor(
            public bidders?: IBidderMap,
            public items?: IItemMap,
            public auctions?: IAuctionMap
        ){
            this.bidders = bidders || {};
            this.items = items || {};
            this.auctions = auctions || {};
        }

        public addAuction(auction: Auction){
            this.auctions[auction.getId()] = auction;
        }
        public addBidder(bidder: Bidder){
            this.bidders[bidder.getId()] = bidder;
        }
        public addItem(item: Item){
            this.items[item.getId()] = item;
        }

        public getAuction(id: number): Auction{
            return this.auctions[id];
        }
        public getBidder(id: string): Bidder{
            return this.bidders[id];
        }
        public getItem(id: number): Item{
            return this.items[id];
        }

        public detectClosedAuction(){
            var i: any;

            for (i in this.auctions){
                this.auctions[i].detectClosing();
            }
        }
        public updateAuctionsEndTime(reference: Date){
            var i: any;

            for (i in this.auctions){
                this.auctions[i].updateRemainingTime(reference);
            }
        }
        public compute(reference: Date){
            var i: any,
                j: any,
                auction: Auction,
                bidder: Bidder;

            for (i in this.auctions){
                auction = this.auctions[i];
                auction.updateRemainingTime(reference);
                auction.detectClosing();
                for (j in this.bidders){
                    bidder = this.bidders[j];
                    bidder.setBidderType(auction, bidder.detectType(auction));
                }
                auction.detectPersistentBidder();
                auction.detectEndingPattern();
            }
        }

        public toJson(): ISerializedAuctionHouse{
            var obj: ISerializedAuctionHouse,
                i: any,
                auctions: Array<ISerializedAuction> = [];

            for (i in this.auctions){
                auctions.push(this.auctions[i].toJson());
            }

            obj = {
                auctions: auctions
            };

            return obj;
        }
    }
}

