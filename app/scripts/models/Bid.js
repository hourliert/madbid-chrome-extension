/**
 * Created by thomashourlier on 15/01/15.
 */
/// <reference path='../_all.ts' />
var Madbid;
(function (Madbid) {
    var Bid = (function () {
        function Bid(auction, bidder) {
            this.auction = auction;
            this.bidder = bidder;
            this.id = this.auction.getId() + '_' + this.bidder.getId() + '_' + (+this.date);
        }
        Bid.prototype.updateStat = function (param) {
            if (param.value)
                this.value = param.value;
            if (param.date)
                this.date = new Date(param.date);
            this.id = this.auction.getId() + '_' + this.bidder.getId() + '_' + (+this.date);
        };
        Bid.prototype.isOn = function (auction) {
            return auction === this.auction;
        };
        Bid.prototype.setBidder = function (bidder) {
            this.bidder = bidder;
        };
        Bid.prototype.getId = function () {
            return this.id;
        };
        Bid.prototype.toJson = function () {
            var obj = {
                bidderName: this.bidder.getId(),
                value: this.value,
                date: this.date.toISOString(),
                delta: this.delta
            };
            return obj;
        };
        return Bid;
    })();
    Madbid.Bid = Bid;
})(Madbid || (Madbid = {}));
//# sourceMappingURL=Bid.js.map