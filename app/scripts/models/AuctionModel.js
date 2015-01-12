/**
 * Created by thomashourlier on 12/01/15.
 */

angular.module('madbid.model')
  .service('AuctionModel', function(){
    var db = {
        items : {},
        bidders: {}
      };

   return {
     getItems : function(){
       return db.items;
     },
     getBidders : function(){
       return db.bidders;
     },
     handleUpdate : function(json){
       if (json.cmd === '/update') {
         var items = json.response.items,
           item,
           localItem,
           localBidder,
           biddersBid,
           i,
           ii;

         for (i = 0, ii = items.length; i < ii; i++) {
           item = items[i];
           localItem = db.items[item['auction_id']];
           localBidder = db.bidders[item['highest_bidder']];

           if (item['highest_bid'] !== 0) {
             if (!localItem) {
               db.items[item['auction_id']] = {
                 updatePoints: []
               };
               localItem = db.items[item['auction_id']];
             }

             if (localItem.updatePoints.length === 0 || localItem.updatePoints[localItem.updatePoints.length - 1].price !== item['highest_bid']) {
               localItem.updatePoints.push({
                 date: item['date_bid'],
                 endDate: item['date_timeout'],
                 price: item['highest_bid'],
                 winner: item['highest_bidder']
               });
             }

             if (!localBidder) {
               db.bidders[item['highest_bidder']] = {
                 bids: {}
               }
               localBidder = db.bidders[item['highest_bidder']];
             }

             biddersBid = localBidder.bids[item['auction_id']];

             if (!biddersBid) {
               localBidder.bids[item['auction_id']] = {
                 updatePoints: []
               };
               biddersBid = localBidder.bids[item['auction_id']];
             }

             if (biddersBid.updatePoints.length === 0 || biddersBid.updatePoints[biddersBid.updatePoints.length - 1].price !== item['highest_bid']) {
               biddersBid.updatePoints.push({
                 date: item['date_bid'],
                 endDate: item['date_timeout'],
                 price: item['highest_bid']
               });
             }
           }
         }
       }
       console.log(db);
     }
   }
  });