/**
 * Created by thomashourlier on 23/01/15.
 */
/// <reference path='../_all.ts' />
var listener, interval, autoBidder, MadBidAuctionList, MadBidUser, MadBidEssentials, MadBidReference;
var MadbidInjected;
(function (MadbidInjected) {
    var AutoBidder = (function () {
        function AutoBidder() {
            var _this = this;
            this.totalAutoBid = 0;
            this.madbidUsername = MadBidUser.getUserName();
            interval = setInterval(function () { return _this.compute(); }, 400);
        }
        AutoBidder.prototype.compute = function () {
            this.madbidHighestBidder = this.madbidAuction.getHighestBidder();
            this.auctionTimeLeft = this.madbidAuctionList.getTimeLeft(this.madbidAuction);
            window.postMessage(JSON.stringify({
                action: 'compute'
            }), '*');
            if (this.madbidHighestBidder !== this.madbidUsername && this.auctionTimeLeft <= this.bidTime) {
                MadBidEssentials.auctionListBidClick.call({
                    id: this.madbidBidButtonId
                });
                this.totalAutoBid++;
                console.log('AutoBidder has place one bid at ', this.auctionTimeLeft, 's before the end. Total autobids: ', this.totalAutoBid);
                window.postMessage(JSON.stringify({
                    action: 'bid',
                    nbAutoBids: this.totalAutoBid
                }), '*');
            }
        };
        AutoBidder.prototype.setAuctionId = function (id) {
            this.auctionId = id;
            this.madbidBidButtonId = MadBidAuctionList.getAuctionElementNameClean(this.auctionId, 'bid_button');
            this.madbidAuctionList = MadBidReference.get(MadBidAuctionList.REFERENCE_NAME, MadBidAuctionList.getAuctionListNameFromElementName(this.madbidBidButtonId));
            this.madbidAuction = this.madbidAuctionList.get(this.auctionId);
        };
        AutoBidder.prototype.setBidTime = function (bidTime) {
            this.bidTime = bidTime;
        };
        return AutoBidder;
    })();
    MadbidInjected.AutoBidder = AutoBidder;
    function cleanUp() {
        if (interval) {
            clearInterval(interval);
        }
        if (listener) {
            window.removeEventListener('message', listener);
        }
        delete autoBidder;
    }
    if (!listener) {
        listener = function (msg) {
            var data = JSON.parse(msg.data);
            if (data.action === 'stop') {
                cleanUp();
            }
            else if (data.action === 'start') {
                autoBidder.setAuctionId(data.autobid);
                autoBidder.setBidTime(data.bidTime);
            }
        };
    }
    cleanUp();
    window.addEventListener('message', listener);
    autoBidder = new AutoBidder();
})(MadbidInjected || (MadbidInjected = {}));
//# sourceMappingURL=autobidder.js.map