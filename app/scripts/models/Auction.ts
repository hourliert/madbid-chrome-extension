/**
 * Created by thomashourlier on 15/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
    export interface IAuctionMap{
        [index: number]: Auction;
    }

    export interface ISerializedAuction{
        id?: number;
        bids?: Array<ISerializedBid>;
        bidders?: Array<ISerializedBidder>;
        item?: ISerializedItem;
        endTime?: Date;
    }

    export class Auction implements ISerializable{
        private ah: AuctionHouse;
        private id: number;
        public item: Item;
        private bidders: IBidderMap;
        private bids: IBidMap;
        private lastBid: Bid;
        private lastBidder: Bidder;

        private endTime: Date;
        private remainingTime: number;

        constructor(ah: AuctionHouse, item: Item){
            this.ah = ah;
            this.id = item.getId();
            this.item = item;
            this.bidders = {};
            this.bids = {};
        }

        public updateStat(param: ISerializedAuction){
            if (param.endTime) this.endTime = param.endTime;
        }
        public getId(): number{
            return this.id;
        }

        public updateEndTime(reference: Date){
            this.remainingTime = (+reference - +this.endTime) / 1000;
        }

        public isValid(): boolean{
            return this.item.isValid(); //maybe we should test if bids is not empty too ?
        }

        public addBid(bid: Bid){
            this.bids[bid.getId()] = bid;
            this.lastBid = bid;
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
                endTime: this.endTime
            };

            return obj;
        }
    }
}

