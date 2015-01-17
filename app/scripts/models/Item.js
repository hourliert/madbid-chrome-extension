/**
 * Created by thomashourlier on 15/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var Item = (function () {
        function Item(ah, param) {
            this.ah = ah;
            this.id = param.id;
            this.updateStat(param);
        }
        Item.prototype.getId = function () {
            return this.id;
        };
        Item.prototype.isValid = function () {
            if (this.name) {
                return true;
            }
            else {
                return false;
            }
        };
        Item.prototype.setAuction = function (auction) {
            this.auction = auction;
        };
        Item.prototype.updateStat = function (param) {
            if (param.name)
                this.name = param.name;
            if (param.creditCost)
                this.creditCost = param.creditCost;
            if (param.shippingCost)
                this.shippingCost = param.shippingCost;
            if (param.buyNowPrice)
                this.buyNowPrice = param.buyNowPrice;
            if (param.retailPrice)
                this.retailPrice = param.retailPrice;
        };
        Item.prototype.toJson = function () {
            var obj = {
                id: this.id,
                name: this.name,
                creditCost: this.creditCost,
                shippingCost: this.shippingCost,
                buyNowPrice: this.buyNowPrice,
                retailPrice: this.retailPrice
            };
            return obj;
        };
        return Item;
    })();
    Madbid.Item = Item;
})(Madbid || (Madbid = {}));
//# sourceMappingURL=Item.js.map