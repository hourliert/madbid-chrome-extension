/**
 * Created by thomashourlier on 13/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
    export class AuctionWithName{
        public filter(input: IAuctionMap){
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

    angular.module('madbid.filter').filter('auctionWithName', () => (new AuctionWithName().filter));
}

/*
angular.module('madbid.filter')
.filter('excludeUnamed',function(){
    return function(inputArray){
       var res ={};

        for (var i in inputArray){
            if (inputArray[i].title && inputArray[i].updatePoints.length){
                res[i] = inputArray[i];
            }
        }

        return res;
    };
});*/
