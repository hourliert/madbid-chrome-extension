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

