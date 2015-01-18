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
    export interface ISerializedBidder{
        bidderName: string;
    }
    export interface IAuctionBidderTypeMap{
        [index: number]: BidderType;
    }
    export enum BidderType{
        Aggressive,
        Pacing,
        Idle
    }

    export class Bidder implements ISerializable{
        private ah: AuctionHouse;
        private name: string;
        private bids: IBidMap;
        private auctions: IAuctionMap;
        private bidsByAuction: IAuctionBidMap;
        private bidderTypeByAuction: IAuctionBidderTypeMap;

        constructor(ah: AuctionHouse, param: ISerializedBidder){
            this.name = param.bidderName;
            this.ah = ah;
            this.bids = {};
            this.auctions = {};
            this.bidsByAuction = {};
            this.bidderTypeByAuction = {};
        }

        public setBidderType(auction: Auction, type: BidderType){
            this.bidderTypeByAuction[auction.getId()] = type;
        }
        public isPersistent(auction: Auction): boolean{
            return this.bidderTypeByAuction[auction.getId()] === BidderType.Aggressive || this.bidderTypeByAuction[auction.getId()] === BidderType.Pacing;
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
        public detectType(auction: Auction): BidderType{
            var bid: Bid,
                bidMap: IBidMap,
                nbShortBid: number = 0,
                nbLongBid: number = 0,
                nbTotalBid: number = 0,
                now: Date = new Date(),
                i: any;

            if (!(bidMap = this.bidsByAuction[auction.getId()])) return BidderType.Idle;

            for (i in bidMap){
                bid = bidMap[i];

                nbTotalBid++;

                if ((+bid.date + shortPeriod * 1000) > +now) nbShortBid++;
                if ((+bid.date + longPeriod * 1000) > +now) nbLongBid++;
            }

            if (nbShortBid > minAggrBid) return BidderType.Aggressive;
            if (nbShortBid > 1 && nbLongBid > minPacingBid && nbTotalBid > minTotalBid) return BidderType.Pacing;
        }
        public updateStat(param: ISerializedBidder){

        }
        public getId(): string{
            return this.name;
        }
        public addBid(bid: Bid){
            this.bids[bid.getId()] = bid;

            if (!this.bidsByAuction[bid.auction.getId()]){
                this.bidsByAuction[bid.auction.getId()] = {};
            }
            this.bidsByAuction[bid.auction.getId()][bid.getId()] = bid;
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
                bid: Bid;

            for (i in this.bids){
                bid = this.bids[i];

                if (bid.isOn(auction) && bid.isBetween(date1, date2)) return true;
            }
            return false;
        }
        public getNumberBidsOn(auction: Auction, date1?: Date, date2?: Date): number{
            var cpt = 0,
                bid: Bid,
                i: any;

            for (i in this.bids){
                bid = this.bids[i];
                if (bid.isOn(auction) && bid.isBetween(date1, date2)) cpt++;
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

