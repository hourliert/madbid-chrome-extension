/**
 * Created by thomashourlier on 12/01/15.
 */

angular.module('madbid.model')
  .service('AuctionModel', ['localStorageService', '$interval', function(localStorageService, $interval){
     var ah = new AuctionHouse();

    var db = {
          items : {},
          bidders: {},
          dateMin : null,
          dateMax : null
        },
        timer,
        reference;


      function SingletonBidder(ah, name){
        var bidder = ah.getBidder(name);

        if (!bidder){
          bidder = new Bidder(ah, name);
          ah.addBidder(bidder);
        }

        return bidder;
      }
      function SingletonItem(ah, id){
        var item = ah.getItem(id);

        if (!item){
          item = new Item(ah, id);
          ah.addItem(item);
        }

        return item;
      }
      function SingletonAuction(ah, id){
        var auction = ah.getAuction(id);

        if (!auction){
          auction = new Auction(ah, id);
          ah.addAuction(auction);
        }

        return auction;
      }


      timer = $interval(function(){
        var i,
            item,
            lastPoint,
            referenceDate = new Date(reference);


        for (i in db.items){
          item = db.items[i];
          lastPoint = item.updatePoints[item.updatePoints.length -1];

          if (lastPoint){
           item.remaining = (new Date(lastPoint.endDate) - referenceDate)/1000;
          }
        }

        referenceDate.setSeconds(referenceDate.getSeconds() + 1);
        reference = referenceDate.toUTCString();
      }, 1000);



   return {
     saveData: function(){
       localStorageService.set('full-cache', ah.toJson(true));
     },
     restoreData: function(data){
        var auctions = data.auctions,
            auction,
            i,
            ii,
            b,
            bb,
            bidders,
            bidder,
            bids,
            bid,
            item,
            localItem,
            localAuction,
            localBidder,
            localBid,
            itemsForAh = {},
            auctionsForAh = {},
            biddersForAh = {};

       for (i = 0, ii = auctions.length; i < ii; i++){
           auction = auctions[i];
           item = auction.item;
           bids = auction.bids,
           bidders = auction.bidders;

           localItem = SingletonItem(ah, item.id);
           localItem.updateStat(item);
           itemsForAh[localItem.getId()] = localItem;

           localAuction = SingletonAuction(ah, item.id);
           localAuction.updateStat(auction);
           localAuction.setItem(localItem);
           auctionsForAh[localAuction.getId()] = localAuction;

           for (b = 0, bb = bidders.length; b < bb; b++){
               bidder = bidders[b];
               localBidder = SingletonBidder(ah, bidder.bidderName);
               localBidder.addAuction(localAuction);
               biddersForAh[localBidder.getId()] = localBidder;

               localAuction.addBidder(localBidder);
           }

           for (b = 0, bb = bids.length; b < bb; b++){
               bid = bids[b];
               localBidder = SingletonBidder(ah, bid.bidderName);
               biddersForAh[localBidder.getId()] = localBidder;
               localBid = new Bid(localAuction);

               localBid.updateStat(bid);
               localBid.setBidder(localBidder);

               localBidder.addAuction(localAuction);
               localBidder.addBid(localBid);

               localAuction.addBidder(localBidder);
               localAuction.addBid(localBid);
           }


           console.log(auction);
       }

        ah = new AuctionHouse(biddersForAh, itemsForAh, auctionsForAh);
        console.log(ah);
     },
     clearCache: function(){
       localStorageService.clearAll();

       delete ah;
       ah = new AuctionHouse();
     },
     getAuctionHouse : function(){
       return ah;
     },
     handleUpdate : function(json){
       var items = json.response.items,
           item,
           itemId,
           localItem,
           highestBid,
           localAuction,
           localBidder,
           bidderName,
           localBid,
           i,
           ii;

       reference = json.response.reference.timestamp;

       if (json.cmd === '/update') {
         for (i = 0, ii = items.length; i < ii; i++) {
           item = items[i];

           try{
             itemId = item['auction_id'];
             highestBid = item['highest_bid'];
             bidderName = item['highest_bidder'];
             if (!itemId || !bidderName || !highestBid) throw "Incorrect Item";
           } catch(e){
             console.log('AuctionModel: Incorrect item');
             continue;
           }

           localItem = SingletonItem(ah, itemId);
           localAuction = SingletonAuction(ah, itemId);
           localBidder = SingletonBidder(ah, bidderName);
           localBid = new Bid(localAuction);

           localItem.setAuction(localAuction);

           localBid.updateStat(item);
           localBid.setBidder(localBidder);

           localAuction.updateStat(item);
           localAuction.setItem(localItem);
           localAuction.addBidder(localBidder);
           localAuction.addBid(localBid);

           localBidder.addBid(localBid);
           localBidder.addAuction(localAuction);
         }
       } else if (json.cmd === '/load/current'){
         for (i = 0, ii = items.length; i < ii; i++) {
           item = items[i];

           try{
             itemId = item['auction_id'];
             bidderName = item['auction_data']['last_bid']['highest_bidder'];
             if (!itemId || !bidderName) throw "Incorrect Item";
           } catch(e){
             console.log('AuctionModel: Incorrect item');
             continue;
           }

           localItem = SingletonItem(ah, itemId);
           localAuction = SingletonAuction(ah, itemId);
           localBidder = SingletonBidder(ah, bidderName);
           localBid = new Bid(localAuction);

           localItem.updateStat(item);
           localItem.setAuction(localAuction);

           localBid.updateStat(item);
           localBid.setBidder(localBidder);

           localAuction.updateStat(item);
           localAuction.setItem(localItem);
           localAuction.addBidder(localBidder);
           localAuction.addBid(localBid);

           localBidder.addBid(localBid);
           localBidder.addAuction(localAuction);
         }
       }

       console.log(ah);
       this.saveData(ah);
     }
   }
  }]);