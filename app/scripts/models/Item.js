/**
 * Created by thomashourlier on 15/01/15.
 */

function Item(ah, id, auction){
    this.id = id;
    this.ah = ah;
    this.auction = auction || {};

    this.name = '';
    this.creditCost = 0;
    this.shippingCost = 0;
    this.buyNowPrice = 0;
    this.retailPrice = 0;
}

Item.prototype.getId = function(){
    return this.id;
};

Item.prototype.setAuction = function(auction){
  this.auction = auction;
};

Item.prototype.updateStat = function(param){
    try{
        this.name = param['title'];
    } catch(e){
        //console.log('Item: has no title');
    }

    try{
        this.shippingCost = param['shipping_costs'];
    } catch(e){
        //console.log('Item: has no shipping_cost');
    }

    try{
        this.creditCost = param['auction_data']['credit_cost'];
    } catch(e){
        //console.log('Item: has no credit_cost');
    }

    try{
        this.buyNowPrice = param['buynow_data']['base_price'];
    } catch(e){
        //console.log('Item: has no base_price');
    }

    try{
        this.retailPrice = param['rrp'];
    } catch(e){
        //console.log('Item: has no rrp');
    }
};

Item.prototype.toJson = function(stringify){
    var obj = {
        id: this.id,
        title: this.name,
        auction_data: {
            credit_cost: this.creditCost
        },
        shipping_costs: this.shippingCost,
        buynow_data: {
            base_price: this.buyNowPrice
        },
        rrp: this.retailPrice
    };

    if (stringify){
        return JSON.stringify(obj);
    } else {
        return obj;
    }
};

Item.prototype.fromJson = function(json, ah, auction){
   var itemData = JSON.parse(json),
       item = new Item(ah, itemData.id, auction);

    this.name = item.name;
    this.creditCost = item.creditCost;
    this.shippingCost = item.shippingCost;
    this.buyNowPrice = item.buyNowPrice;
    this.retailPrice = item.retailPrice;

    return item;
};

