/**
 * Created by thomashourlier on 15/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid{
    export interface IAuctionMap{
        [index: number]: Auction;
    }

    export interface ISerializedAuction{
        id?: number;
        bids?: Array<ISerializedBid>;
        bidders?: Array<ISerializedBidder>;
        item?: ISerializedItem;
        endTime?: string;
    }

    export class Auction implements ISerializable{
        private ah: AuctionHouse;
        private id: number;
        public item: Item;
        public bidders: IBidderMap;
        public bids: IBidMap;
        private lastBid: Bid;
        private lastBidder: Bidder;

        private endTime: Date;
        public remainingTime: number;
        public currentPrice: number;
        public closed: boolean;


        constructor(ah: AuctionHouse, item: Item){
            this.ah = ah;
            this.id = item.getId();
            this.item = item;
            this.bidders = {};
            this.bids = {};
            this.closed = false;
        }

        public updateStat(param: ISerializedAuction){
            if (param.endTime) this.endTime = new Date(param.endTime);
            if (+new Date() - +this.endTime > 0) this.closed = true;
        }
        public getId(): number{
            return this.id;
        }
        public updateEndTime(reference: Date){
            this.closed = false;
            this.remainingTime = (+this.endTime - +reference) / 1000;

            if (this.remainingTime < 0) this.closed = true;
        }
        public isValid(): boolean{
            return this.item.isValid() && this.hasBid() && !this.closed;
        }
        public hasBid(): boolean{
            return Object.keys(this.bids).length > 0;
        }
        public getNumberBids(): number{
            return Object.keys(this.bids).length;
        }
        public hasNewBidderOnSince(biddersInCourse: IBidderMap, auction: Auction, date1?: Date, date2?: Date): boolean{
            var i: any,
                bidder: Bidder;

            for (i in this.bidders){
                bidder = this.bidders[i];

                if (!bidder.hasBidOnBetween(auction, date1, date2)) continue;

                if (!biddersInCourse[bidder.getId()]){
                    return true;
                }
            }
            return false;
        }
        public addBid(bid: Bid){
            this.bids[bid.getId()] = bid;
            this.lastBid = bid;
            this.currentPrice = bid.value;
        }
        public addBidder(bidder: Bidder){
            this.bidders[bidder.getId()] = bidder;
            this.lastBidder = bidder;
        }
        public toJson(): ISerializedAuction{
            var bids: Array<ISerializedBid> = [],
                item: ISerializedItem,
                i: any,
                bidders: Array<ISerializedBidder> = [],
                obj: ISerializedAuction;

            for (i in this.bidders){
                bidders.push(this.bidders[i].toJson());
            }
            for (i in this.bids){
                bids.push(this.bids[i].toJson());
            }
            item = this.item.toJson();

            obj = {
                id: this.id,
                bids: bids,
                bidders: bidders,
                item: item,
                endTime: this.endTime.toISOString()
            };

            return obj;
        }
    }
}

