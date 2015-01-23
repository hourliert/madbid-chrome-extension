/**
 * Created by thomashourlier on 23/01/15.
 */

/// <reference path='../_all.ts' />


var listener: any,
    interval: any,
    autoBidder: MadbidInjected.AutoBidder,
    MadBidAuctionList: any,
    MadBidReference: any;


module MadbidInjected {
    export class AutoBidder{
        private auctionId: number;
        private bidTime: number;

        constructor(){
            interval = setInterval(() => this.compute(), 100);
        }

        public compute(){
            var bidButtonId: string = MadBidAuctionList.getAuctionElementNameClean(this.auctionId, 'bid_button'),
                auctionList = MadBidReference.get(MadBidAuctionList.REFERENCE_NAME, MadBidAuctionList.getAuctionListNameFromElementName(bidButtonId)),
                auction = auctionList.get(this.auctionId);

            console.log('getTimeLeft', auctionList.getTimeLeft(auction));

            /*MadBidEssentials.auctionListBidClick.call({
                id: bidButtonId
            });*/
        }
        public setAuctionId(id: number){
            this.auctionId = id;
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

