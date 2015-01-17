/**
 * Created by thomashourlier on 16/01/15.
 */


/// <reference path='../../typings/tsd.d.ts' />
/// <reference path='models/Bidder.ts' />
/// <reference path='models/Bid.ts' />
/// <reference path='models/Auction.ts' />
/// <reference path='models/Item.ts' />
/// <reference path='models/AuctionHouse.ts' />
/// <reference path='models/AuctionModel.ts' />
/// <reference path='controllers/AuctionController.ts' />
/// <reference path='services/NetworkService.ts' />
/// <reference path='filters/BiddingBidderFilter.ts' />
/// <reference path='directives/AuctionInfoDirective.ts' />

module Madbid{
    export interface ISerializable{
        toJson(): any;
    }


    export interface IMadbidResponse{
        cmd: string;
        status: number;
        version: string;
        response: any;
    }

    export interface IMadbidUpdateResponse{
        items: Array<IMadbidAuction>;
        reference: IMadbidReference;
    }

    export interface IMadbidRefreshResponse{
        items: Array<IMadbidItem>;
        reference: IMadbidReference;
    }

    export interface IMadbidReference{
        timestamp: string;
        image_base?: string;
        sms_cost?: number;
        sms_msisdn?: number;
    }

    export interface IMadbidAuction{
        auction_id?: number;
        date_bid: string;
        date_timeout?: string;
        highest_bid: number;
        highest_bidder?: string;
        state?: number;
        timeout?: number;
    }

    export interface IMadbidItem{
        title: string;
        shipping_costs: number;
        buynow_data: IMadbidBuyNowData;
        auction_id: number;
        auction_data: IMadbidAuctionData;
        rrp: number;
    }

    export interface IMadbidAuctionData{
        cerdit_cost: number;
        last_bid: IMadbidAuction;
    }

    export interface IMadbidBuyNowData{
        base_price: number;
    }
}