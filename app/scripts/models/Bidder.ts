/**
 * Created by thomashourlier on 15/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid{
    export interface IBidderMap{
        [index: string]: Bidder;
    }
    export interface ISerializedBidder{
        bidderName: string;
    }

    export enum BidderType{
        Aggressive,
        Pacing
    }

    export class Bidder implements ISerializable{
       private ah: AuctionHouse;
       private name: string;
       private bids: IBidMap;
       private auctions: IAuctionMap;

       private bidderType: BidderType;

       constructor(ah: AuctionHouse, param: ISerializedBidder){
           this.name = param.bidderName;
           this.ah = ah;
           this.bids = {};
           this.auctions = {};
       }

       public updateStat(param: ISerializedBidder){

       }
       public getId(): string{
           return this.name;
       }
       public addBid(bid: Bid){
           this.bids[bid.getId()] = bid;
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

