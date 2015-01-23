/**
 * Created by thomashourlier on 23/01/15.
 */

/// <reference path='../_all.ts' />


var listener: any,
    interval: any,
    autoBidder: MadbidInjected.AutoBidder,
    MadBidAuctionList: any,
    MadBidUser: any,
    MadBidEssentials: any,
    MadBidReference: any;


module MadbidInjected {
    export class AutoBidder{
        private auctionId: number;
        private bidTime: number;

        private madbidHighestBidder: string;
        private madbidBidButtonId: string;
        private madbidAuctionList: any;
        private madbidAuction: any;
        private auctionTimeLeft: number;

        private madbidUsername: string;
        private totalAutoBid: number;

        constructor(){
            this.totalAutoBid = 0;
            this.madbidUsername = MadBidUser.getUserName();
            interval = setInterval(() => this.compute(), 400);
        }

        public compute(){
            this.madbidHighestBidder = this.madbidAuction.getHighestBidder();
            this.auctionTimeLeft = this.madbidAuctionList.getTimeLeft(this.madbidAuction);

            window.postMessage(JSON.stringify({
                action: 'compute'
            }), '*');

            if (this.madbidHighestBidder !== this.madbidUsername && this.auctionTimeLeft <= this.bidTime){
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
        }
        public setAuctionId(id: number){
            this.auctionId = id;

            this.madbidBidButtonId = MadBidAuctionList.getAuctionElementNameClean(this.auctionId, 'bid_button');
            this.madbidAuctionList = MadBidReference.get(MadBidAuctionList.REFERENCE_NAME, MadBidAuctionList.getAuctionListNameFromElementName(this.madbidBidButtonId));
            this.madbidAuction = this.madbidAuctionList.get(this.auctionId);
        }
        public setBidTime(bidTime: number){
            this.bidTime = bidTime;
        }
    }

    function cleanUp(){
        if (interval){
            clearInterval(interval);
        }
        if (listener){
            window.removeEventListener('message', listener);
        }
        delete autoBidder;
    }


    if (!listener){
        listener = function(msg){
            var data = JSON.parse(msg.data);
            if (data.action === 'stop'){
                cleanUp();
            } else if (data.action === 'start'){
                autoBidder.setAuctionId(data.autobid);
                autoBidder.setBidTime(data.bidTime);
            }
        };
    }

    cleanUp();
    window.addEventListener('message', listener);
    autoBidder = new AutoBidder();
}

