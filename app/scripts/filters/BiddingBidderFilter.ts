/**
 * Created by thomashourlier on 14/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
    export class BiddingBidder{
        public filter(input: IBidderMap, auction: Auction): any{
            if (!auction) return input;

            var res: IBidderMap = {},
                bidder: Bidder,
                i: any;

            for (i in input){
                bidder = input[i];
                if (bidder.isBiddingOn(auction)) {
                   res[bidder.getId()] = bidder;
                }
            }
            return res;
        }
    }

    angular.module('madbid.filter').filter('biddingBidder', () => (new BiddingBidder().filter));
}
/*
angular.module('madbid.filter')
    .filter('bidders',function(){
        return function(inputArray, selectedItem){
            if (!selectedItem){
                return inputArray;
            } else {
                var res ={},
                    bidder;

                for (i in inputArray){
                    bidder = inputArray[i];
                    for (j in bidder.bids){
                        if (j === selectedItem){
                            res[i] = inputArray[i];
                            break;
                        }
                    }
                }
                return res;
            }
        };
    });*/
