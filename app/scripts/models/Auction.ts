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
        id: number;
        bids?: Array<ISerializedBid>;
        bidders?: Array<ISerializedBidder>;
        item?: ISerializedItem;
        endTime?: string;
        timeout?: number;
        closed?: boolean;
    }

    export class Auction implements ISerializable{
        private ah: AuctionHouse;
        private id: number;
        public item: Item;
        public bidders: IBidderMap;
        public bids: IBidMap;
        public lastBid: Bid;
        private lastBidder: Bidder;

        public previousEndTime: Date;
        public endTime: Date;
        public remainingTime: number;
        public currentPrice: number;
        public closed: boolean;
        public timeout: number;

        public persitentBidderNumber: number;

        constructor(ah: AuctionHouse, item: Item, param: ISerializedAuction){
            this.ah = ah;
            this.id = item.getId();
            this.item = item;
            this.bidders = {};
            this.bids = {};
            this.closed = false;

            this.updateStat(param);
        }

        public getCloseToEndBids(): IBidMap{
            var obj: IBidMap = {},
                i: any,
                bid: Bid;

            for(i in this.bids){
                bid = this.bids[i];
                if (bid.delayBeforeEnd <= 2){ //bid between 0 and 2 seconds)
                    obj[bid.getId()] = bid;
                }
            }

            return obj;
        }
        public updateStat(param: ISerializedAuction){
            var newTime: Date;

            if (param.endTime){
                newTime = new Date(param.endTime);

                if (+newTime !== +this.endTime){
                    this.previousEndTime = this.endTime;
                }
                this.endTime = newTime;

                if (!this.previousEndTime){
                    this.previousEndTime = this.endTime;
                }
            }
            if (param.timeout) this.timeout = param.timeout;
            if (param.closed) this.closed = param.closed;

            if (+new Date() - +this.endTime > 0) this.closed = true;
        }
        public detectClosing(){
            if (!this.timeout || (+this.lastBid.date + this.timeout*1000 < +this.endTime)) this.closed = true;
        }
        public getId(): number{
            return this.id;
        }
        public updateRemainingTime(reference: Date){
            this.closed = false;
            this.remainingTime = (+this.endTime - +reference) / 1000;
            if (this.remainingTime < -2) {
                this.closed = true;
            } //we considere that there is 2 seconds of latency
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
        public hasNewBidderOnSince(biddersInCourse: IBidderMap, date1?: Date, date2?: Date): boolean{
            var i: any,
                bidder: Bidder;

            for (i in this.bidders){
                bidder = this.bidders[i];

                if (!bidder.hasBidOnBetween(this, date1, date2)) continue;

                if (!biddersInCourse[bidder.getId()]){
                    return true;
                }
            }
            return false;
        }
        public hasNewBidTimeSinceFor(bidTime: any, bidder: Bidder, dateMin: Date, dateMax: Date): boolean{
            var i: any,
                bid: Bid;

            for (i in this.bids){
                bid = this.bids[i];
                if (bid.delayBeforeEnd < 0 || bid.delayBeforeEnd > this.timeout || (bidder && bid.bidder !== bidder) || !bid.isBetween(dateMin, dateMax)) continue;

                if (!bidTime[bid.delayBeforeEnd]) return true;
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
                endTime: (this.endTime) ? this.endTime.toISOString() :'',
                timeout: this.timeout,
                closed: this.closed
            };

            return obj;
        }
    }
}

