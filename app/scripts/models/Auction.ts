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
        public biddersArray: Array<Bidder>;
        public bids: IBidMap;
        public bidsArray: Array<Bid>;
        public lastBid: Bid;
        private lastBidder: Bidder;

        public previousEndTime: Date;
        public endTime: Date;
        public remainingTime: number;
        public currentPrice: number;
        public closed: boolean;
        public timeout: number;

        public persistentBidderNumber: number;
        public pacingBidderNumber: number;
        public aggresiveBidderNumber: number;
        public sleepyActiveBidderNumber: number;
        public endingPatternDetected: boolean;

        constructor(ah: AuctionHouse, item: Item, param: ISerializedAuction){
            this.ah = ah;
            this.id = item.getId();
            this.item = item;
            this.bidders = {};
            this.bids = {};
            this.bidsArray = [];
            this.biddersArray = [];
            this.closed = false;
            this.endingPatternDetected = false;

            this.updateStat(param);
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
            if (!this.timeout || ((+this.lastBid.date + this.timeout*1000) > +this.endTime)) this.closed = true;
        }
        public detectPersistentBidder(){
            var i: number,
                ii: number,
                bidder: Bidder;

            this.persistentBidderNumber = 0;
            this.pacingBidderNumber = 0;
            this.aggresiveBidderNumber = 0;
            this.sleepyActiveBidderNumber = 0;

            for (i = 0, ii = this.biddersArray.length; i < ii; i++){
                bidder = this.biddersArray[i];
                if (bidder.isAggresive(this)) this.aggresiveBidderNumber++;
                if (bidder.isPacing(this)) this.pacingBidderNumber++;
                if (bidder.isSleepyActive(this)) this.sleepyActiveBidderNumber++;
            }
            this.persistentBidderNumber = this.pacingBidderNumber + this.aggresiveBidderNumber + this.sleepyActiveBidderNumber;
        }
        public detectEndingPattern(){
            var i: number,
                ii: number,
                bid: Bid,
                firstPatternBid: Bid,
                bidSatisfyingPattern: number = 0;

            for (i = (this.bidsArray.length < 10) ? 0 : (this.bidsArray.length - 10), ii = this.bidsArray.length; i < ii; i++){
                bid = this.bidsArray[i];

                if (!firstPatternBid){
                    if (bid.delayBeforeEnd <= minBidTime) firstPatternBid = bid;
                } else {
                    if ((this.timeout - bid.delayBeforeEnd) <= this.timeout*maxBidTime) bidSatisfyingPattern++;
                    //if (bid.delayBeforeEnd >= (this.timeout * (1 - maxBidTime))) bidSatisfyingPattern++;
                }
            }
            this.endingPatternDetected = (bidSatisfyingPattern == minFollowingBid && 0 <= this.persistentBidderNumber && this.persistentBidderNumber <= maxPersistentBidder);
        }
        public getId(): number{
            return this.id;
        }
        public updateRemainingTime(reference: Date){
            this.closed = false;
            this.remainingTime = (+this.endTime - +reference) / 1000;
            if (this.remainingTime < -2) {
                this.closed = true;
            }
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
            var i: number,
                ii: number,
                bidder: Bidder;

            for (i = 0, ii = this.biddersArray.length; i < ii; i++){
                bidder = this.biddersArray[i];

                if (!bidder.hasBidOnBetween(this, date1, date2)) continue;

                if (!biddersInCourse[bidder.getId()]){
                    return true;
                }
            }
            return false;
        }
        public hasNewBidTimeSinceFor(bidTime: any, bidder: Bidder, dateMin: Date, dateMax: Date): boolean{
            var i: number,
                ii: number,
                bid: Bid;

            for (i = 0, ii = this.bidsArray.length; i < ii; i++){
                bid = this.bidsArray[i];
                if (bid.delayBeforeEnd < 0 || bid.delayBeforeEnd > this.timeout || (bidder && bid.bidder !== bidder) || !bid.isBetween(dateMin, dateMax)) continue;

                if (!bidTime[bid.delayBeforeEnd]) return true;
            }
            return false;
        }
        public addBid(bid: Bid){
            this.bids[bid.getId()] = bid;

            this.lastBid = bid;
            if (bid !== this.bidsArray[this.bidsArray.length -1]) this.bidsArray.push(bid);

            this.currentPrice = bid.value;
        }
        public addBidder(bidder: Bidder){
            this.bidders[bidder.getId()] = bidder;
            this.lastBidder = bidder;
            if (this.biddersArray.indexOf(bidder) < 0) this.biddersArray.push(bidder);
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

