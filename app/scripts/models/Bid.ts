/**
 * Created by thomashourlier on 15/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
    export interface IBidMap{
        [index: string]: Bid;
    }

    export interface ISerializedBid{
        value?: number;
        date?: Date;
        bidderName?: string;
        delta?: number;
    }

    export class Bid implements ISerializable{
        private auction: Auction;
        private bidder: Bidder;
        private id: string;

        private value: number;
        private date: Date;
        private delta: number;

        constructor(auction: Auction, bidder: Bidder){
            this.auction = auction;
            this.bidder = bidder;
            this.id = this.auction.getId() + '_' + this.bidder.getId();
        }

        public updateStat(param: ISerializedBid){
            if (param.value) this.value = param.value;
            if (param.date) this.date = param.date;
        }

        public setBidder(bidder: Bidder){
            this.bidder = bidder;
        }

        public getId(): string{
            return this.id;
        }

        public toJson(): ISerializedBid{
            var obj: ISerializedBid = {
                bidderName: this.bidder.getId(),
                value: this.value,
                date: this.date,
                delta: this.delta
            };

            return obj;
        }

    }
}
