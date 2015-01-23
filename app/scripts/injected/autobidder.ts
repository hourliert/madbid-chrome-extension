/**
 * Created by thomashourlier on 23/01/15.
 */

/// <reference path='../_all.ts' />


var listener: any,
    interval: any,
    auctionId: number,
    constantBidTime: number;

if (interval){
    clearInterval(interval);
}
if (!listener){
    listener = function(msg){
        var data =JSON.parse(msg.data);
        auctionId = data.autobid;
        constantBidTime = data.bidTime;
    };
} else {
    window.removeEventListener('message', listener);
}
window.addEventListener('message', listener);


module MadbidInjected {

    export class AutoBidder{
        constructor(){
            interval = setInterval(function(){
                console.log('watching for better bid on', auctionId, 'at time', constantBidTime);

            }, 500);
        }

        public compute(){

        }
    }


    var test = new AutoBidder();
}

