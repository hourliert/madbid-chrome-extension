/**
 * Created by thomashourlier on 15/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
    export interface IItemMap{
        [index: number]: Item;
    }
    export interface ISerializedItem{
        id?: number;
        name?: string;
        creditCost?: number;
        shippingCost?: number;
        buyNowPrice?: number;
        retailPrice?: number;
    }

    export class Item implements ISerializable{
        private ah: AuctionHouse;
        private id: number;
        private auction: Auction;

        private name: string;
        private creditCost: number;
        private shippingCost: number;
        private buyNowPrice: number;
        private retailPrice: number;

        constructor(ah: AuctionHouse, id: number){
            this.ah = ah;
            this.id = id;
        }

        public getId(): number{
            return this.id;
        }

        public setAuction(auction: Auction){
            this.auction = auction;
        }

        public updateStat(param: ISerializedItem){
            if (param.name) this.name = param.name;
            if (param.creditCost) this.creditCost = param.creditCost;
            if (param.shippingCost) this.shippingCost = param.shippingCost;
            if (param.buyNowPrice) this.buyNowPrice = param.buyNowPrice;
            if (param.retailPrice) this.retailPrice = param.retailPrice;
        }

        public toJson(): ISerializedItem{
            var obj: ISerializedItem = {
                id: this.id,
                name: this.name,
                creditCost: this.creditCost,
                shippingCost: this.shippingCost,
                buyNowPrice: this.buyNowPrice,
                retailPrice: this.retailPrice
            };

            return obj;
        }
    }
}

