/**
 * Created by thomashourlier on 15/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid {
    export interface IBidderMap{
        [index: string]: Bidder;
    }
    export interface IAuctionBidMap{
        [index: number]: IBidMap;
    }
    export interface IAuctionBidArrayMap{
        [index: number]: Array<Bid>;
    }
    export interface IAuctionLastBidMap{
        [index: number]: Bid;
    }
    export interface ISerializedBidder{
        bidderName: string;
    }
    export interface IAuctionBidderTypeMap{
        [index: number]: BidderType;
    }
    export enum BidderType{
        Aggressive,
        Pacing,
        Idle,
        SleepyActive
    }

    export class Bidder implements ISerializable{
        private ah: AuctionHouse;
        private name: string;
        private bids: IBidMap;
        public bidsArray: Array<Bid>;
        private auctions: IAuctionMap;
        private bidsByAuction: IAuctionBidMap;
        private bidsByAuctionArray: IAuctionBidArrayMap;
        private bidderTypeByAuction: IAuctionBidderTypeMap;
        private consideredPersistentByAuction: INumberBooleanMap;
        private lastBidByAuction: IAuctionLastBidMap;

        constructor(ah: AuctionHouse, param: ISerializedBidder){
            this.name = param.bidderName;
            this.ah = ah;
            this.bids = {};
            this.bidsArray = [];
            this.auctions = {};
            this.bidsByAuction = {};
            this.bidsByAuctionArray = [];
            this.bidderTypeByAuction = {};
            this.lastBidByAuction = {};
            this.consideredPersistentByAuction = {};
        }

        public setBidderType(auction: Auction, type: BidderType){
            if (type !== BidderType.Idle) this.consideredPersistentByAuction[auction.getId()] = true;
            this.bidderTypeByAuction[auction.getId()] = type;
        }
        public isPersistent(auction: Auction): boolean{
            return this.isAggresive(auction) || this.isPacing(auction) || this.isSleepyActive(auction);
        }
        public isPacing(auction: Auction): boolean{
            return this.bidderTypeByAuction[auction.getId()] === BidderType.Pacing;
        }
        public isIdle(auction: Auction): boolean{
            return this.bidderTypeByAuction[auction.getId()] === BidderType.Idle;
        }
        public isAggresive(auction: Auction): boolean{
            return this.bidderTypeByAuction[auction.getId()] === BidderType.Aggressive;
        }
        public isSleepyActive(auction: Auction): boolean{
            return this.bidderTypeByAuction[auction.getId()] === BidderType.SleepyActive;
        }
        public detectType(auction: Auction): BidderType{
            var bid: Bid,
                bidsArray: Array<Bid>,
                nbShortBid: number = 0,
                nbShortBidForSleepy: number = 0,
                nbLongBid: number = 0,
                nbTotalBid: number = 0,
                now: Date = new Date(),
                i: number,
                ii: number;

            if (!(bidsArray = this.bidsByAuctionArray[auction.getId()])) return BidderType.Idle;

            for (i = 0, ii = bidsArray.length; i < ii; i++){
                bid = bidsArray[i];

                nbTotalBid++;

                if ((+bid.date + shortPeriod * 1000) > +now) nbShortBid++;
                if ((+bid.date + longPeriod * 1000) > +now) nbLongBid++;
                if ((+bid.date + shortPeriodForSleepy * 1000) > +now) nbShortBidForSleepy++;
            }

            if (nbShortBid >= minAggrBid) return BidderType.Aggressive;
            if (nbShortBid >= 1 && nbLongBid >= minPacingBid && nbTotalBid >= minTotalBid) return BidderType.Pacing;
            if (this.consideredPersistentByAuction[auction.getId()] && nbShortBidForSleepy >= 1) return BidderType.SleepyActive;
        }
        public updateStat(param: ISerializedBidder){

        }
        public getId(): string{
            return this.name;
        }
        public addBid(bid: Bid){
            var bidsForMap: IBidMap = this.bidsByAuction[bid.auction.getId()],
                bidsForArray: Array<Bid> = this.bidsByAuctionArray[bid.auction.getId()];

            if (!bidsForMap) this.bidsByAuction[bid.auction.getId()] = {};
            if (!bidsForArray) this.bidsByAuctionArray[bid.auction.getId()] = [];

            bidsForMap = this.bidsByAuction[bid.auction.getId()];
            bidsForArray = this.bidsByAuctionArray[bid.auction.getId()];

            this.bids[bid.getId()] = bid;

            if (bid !== this.bidsArray[this.bidsArray.length -1]) this.bidsArray.push(bid);

            bidsForMap[bid.getId()] = bid;
            if (bid !== bidsForArray[bidsForArray.length -1]) bidsForArray.push(bid);


            this.lastBidByAuction[bid.auction.getId()] = bid;
        }
        public hasBidOn(auction: Auction): boolean{
            if (this.auctions[auction.getId()]){
                return true;
            } else {
                return false;
            }
        }
        public hasBidOnBetween(auction:Auction, date1: Date, date2: Date): boolean{
            var i: any,
                bid: Bid = this.lastBidByAuction[auction.getId()];

            if (bid && bid.isBetween(date1, date2)) return true;

            for (i in this.bids){
                bid = this.bids[i];

                if (bid.isOn(auction) && bid.isBetween(date1, date2)) return true;
            }
            return false;
        }
        public getNumberBidsOn(auction: Auction, date1?: Date, date2?: Date): number{
            var cpt = 0,
                bid: Bid,
                i: any,
                bidMap: IBidMap = this.bidsByAuction[auction.getId()];

            for (i in bidMap){
                bid = bidMap[i];
                if (bid.isBetween(date1, date2)) cpt++;
            }
            return cpt;
        }
        public addAuction(auction: Auction){
            this.auctions[auction.getId()] = auction;
        }
        public toJson(): ISerializedBidder{
            var obj: ISerializedBidder ={
                bidderName: this.name
            };

            return obj;
        }
   }
}

