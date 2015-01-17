/**
 * Created by thomashourlier on 13/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid.filters {
    export class AuctionWithName{
        public static filter(input: IAuctionMap){
            var res: IAuctionMap = {},
                i: any,
                auction: Auction;

            for (i in input){
                auction = input[i];
                if (auction.isValid()){
                    res[auction.getId()] = auction;
                }
            }
            return res;
        }
    }

    Madbid.registerFilter('validAuction', () => (new AuctionWithName().filter));
}