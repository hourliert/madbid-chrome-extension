/**
 * Created by thomashourlier on 13/01/15.
 */

angular.module('madbid.filter')
.filter('excludeUnamed',function(){
    return function(inputArray){
       var res ={};

        for (var i in inputArray){
            if (inputArray[i].title && inputArray[i].updatePoints.length){
                res[i] = inputArray[i];
            }
        }

        return res;
    };
});