/**
 * Created by thomashourlier on 13/01/15.
 */
/// <reference path='../_all.ts' />
var Madbid;
(function (Madbid) {
    var AuctionWithName = (function () {
        function AuctionWithName() {
        }
        AuctionWithName.prototype.filter = function (input) {
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
    Madbid.AuctionWithName = AuctionWithName;
    angular.module('madbid.filter').filter('auctionWithName', function () { return (new AuctionWithName().filter); });
})(Madbid || (Madbid = {}));
//# sourceMappingURL=AuctionWithNameFilter.js.map