/**
 * Created by thomashourlier on 15/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid {
    export interface ISerializedAuctionHouse{
        auctions: Array<ISerializedAuction>;
    }
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
            for (var i in this.auctions){
                this.auctions[i].updateRemainingTime(reference);
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

