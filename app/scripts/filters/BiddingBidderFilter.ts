/**
 * Created by thomashourlier on 14/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid.filters {
    export class BiddingBidder{
        public filter(input: IBidderMap, auction: Auction): any{
            if (!auction) return input;

            var res: IBidderMap = {},
                bidder: Bidder,
                i: any;

            for (i in input){
                bidder = input[i];
                if (bidder.hasBidOn(auction)) {
                   res[bidder.getId()] = bidder;
                }
            }
            return res;
        }
    }

    Madbid.registerFilter('biddingBidder', () => (new BiddingBidder().filter));
}