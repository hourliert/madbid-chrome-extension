/**
 * Created by thomashourlier on 15/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
    export interface IBidderMap{
        [index: string]: Bidder;
    }
    export interface ISerializedBidder{
        bidderName: string;
    }

   export class Bidder implements ISerializable{
       private ah: AuctionHouse;
       private name: string;
       private bids: IBidMap;
       private auctions: IAuctionMap;

       constructor(ah: AuctionHouse, name: string){
           this.name = name;
           this.ah = ah;
           this.bids = {};
           this.auctions = {};
       }

       public getId(): string{
           return this.name;
       }

       public addBid(bid: Bid){
           this.bids[bid.getId()] = bid;
       }

       public isBiddingOn(auction: Auction): boolean{
           if (this.auctions[auction.getId()]){
               return true;
           } else {
               return false;
           }
       }

       public getNumberBidsOn(auction: Auction): number{
           var cpt = 0,
               bid: Bid,
               i: any;

           for (i in this.bids){
               bid = this.bids[i];
               if (bid.isOn(auction)) cpt++;
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

