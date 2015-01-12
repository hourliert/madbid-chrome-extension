'use strict';

var db = {
      items : {},
      bidders: {}
    },
    input,
    iframe;

function validateAuctionID(){
  var id = input.value;
  console.log(id);
}

function handleReponse(json){
  //console.log(json);
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





window.addEventListener('load', function(evt) {
  // Cache a reference to the status display SPAN
  // Handle the bookmark form submit event with our addBookmark function




  input = document.getElementById('auction-id');
  document.getElementById('select-auction').addEventListener('submit', validateAuctionID);
});






chrome.devtools.panels.create(
  "TheNameOfYourExtension",
  "images/icon-16.png",
  "devtools_page.html",
  function() {
    console.log("on y est");
  }
);

chrome.devtools.network.onRequestFinished.addListener(
  function(res){
    res.getContent(function(content, encoding){
      try {
        handleReponse(JSON.parse(content));
      } catch(e){
        //console.error('JSON parsing error', e);
      }
    })
  }
);
