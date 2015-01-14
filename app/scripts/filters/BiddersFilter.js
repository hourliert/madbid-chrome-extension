/**
 * Created by thomashourlier on 14/01/15.
 */


angular.module('madbid.filter')
    .filter('bidders',function(){
        return function(inputArray, selectedItem){
            if (!selectedItem){
                return inputArray;
            } else {
                var res ={},
                    bidder;

                for (i in inputArray){
                    bidder = inputArray[i];
                    for (j in bidder.bids){
                        if (j === selectedItem){
                            res[i] = inputArray[i];
                            break;
                        }
                    }
                }
                return res;
            }
        };
    });