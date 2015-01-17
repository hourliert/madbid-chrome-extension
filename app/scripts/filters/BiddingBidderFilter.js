/**
 * Created by thomashourlier on 14/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var filters;
    (function (filters) {
        var BiddingBidder = (function () {
            function BiddingBidder() {
            }
            BiddingBidder.prototype.filter = function (input, auction) {
                if (!auction)
                    return input;
                var res = {}, bidder, i;
                for (i in input) {
                    bidder = input[i];
                    if (bidder.hasBidOn(auction)) {
                        res[bidder.getId()] = bidder;
                    }
                }
                return res;
            };
            return BiddingBidder;
        })();
        filters.BiddingBidder = BiddingBidder;
        Madbid.registerFilter('biddingBidder', function () { return (new BiddingBidder().filter); });
    })(filters = Madbid.filters || (Madbid.filters = {}));
})(Madbid || (Madbid = {}));
//# sourceMappingURL=BiddingBidderFilter.js.map