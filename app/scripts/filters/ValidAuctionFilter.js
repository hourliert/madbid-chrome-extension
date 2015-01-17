/**
 * Created by thomashourlier on 13/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var filters;
    (function (filters) {
        var AuctionWithName = (function () {
            function AuctionWithName() {
            }
            AuctionWithName.filter = function (input) {
                var res = {}, i, auction;
                for (i in input) {
                    auction = input[i];
                    if (auction.isValid()) {
                        res[auction.getId()] = auction;
                    }
                }
                return res;
            };
            return AuctionWithName;
        })();
        filters.AuctionWithName = AuctionWithName;
        Madbid.registerFilter('validAuction', function () { return (new AuctionWithName().filter); });
    })(filters = Madbid.filters || (Madbid.filters = {}));
})(Madbid || (Madbid = {}));
//# sourceMappingURL=ValidAuctionFilter.js.map