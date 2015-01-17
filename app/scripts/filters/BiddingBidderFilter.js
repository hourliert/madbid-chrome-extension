/**
 * Created by thomashourlier on 14/01/15.
 */
/// <reference path='../_all.ts' />
var Madbid;
(function (Madbid) {
    var BiddingBidder = (function () {
        function BiddingBidder() {
        }
        BiddingBidder.prototype.filter = function (input, auction) {
            if (!auction)
                return input;
            var res = {}, bidder, i;
            for (i in input) {
                bidder = input[i];
                if (bidder.isBiddingOn(auction)) {
                    res[bidder.getId()] = bidder;
                }
            }
            return res;
        };
        return BiddingBidder;
    })();
    Madbid.BiddingBidder = BiddingBidder;
    angular.module('madbid.filter').filter('biddingBidder', function () { return (new BiddingBidder().filter); });
})(Madbid || (Madbid = {}));
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
//# sourceMappingURL=BiddingBidderFilter.js.map