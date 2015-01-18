/**
 * Created by thomashourlier on 15/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var Bid = (function () {
        function Bid(auction, bidder, param) {
            this.auction = auction;
            this.bidder = bidder;
            this.updateStat(param);
            this.id = this.auction.getId() + '_' + this.bidder.getId() + '_' + (+this.date);
        }
        Bid.prototype.updateStat = function (param) {
            if (param.value)
                this.value = param.value;
            if (param.date)
                this.date = new Date(param.date);
            if (param.delayBeforeEnd) {
                this.delayBeforeEnd = param.delayBeforeEnd;
            }
            else {
                if (this.auction.previousEndTime) {
                    this.delayBeforeEnd = (+this.auction.previousEndTime - +this.date) / 1000;
                }
            }
        };
        Bid.prototype.isOn = function (auction) {
            return auction === this.auction;
        };
        Bid.prototype.hasBidder = function (bidder) {
            return bidder === this.bidder;
        };
        Bid.prototype.isBetween = function (date1, date2) {
            if (!date1 && !date2) {
                return true;
            }
            else if (!date2) {
                if (date1 < this.date) {
                    return true;
                }
            }
            else {
                if (date1 < this.date && this.date < date2) {
                    return true;
                }
            }
            return false;
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
                delta: this.delta,
                delayBeforeEnd: this.delayBeforeEnd
            };
            return obj;
        };
        return Bid;
    })();
    Madbid.Bid = Bid;
})(Madbid || (Madbid = {}));
//# sourceMappingURL=Bid.js.map