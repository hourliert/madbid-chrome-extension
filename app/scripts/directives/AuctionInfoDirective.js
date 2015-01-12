/**
 * Created by thomashourlier on 12/01/15.
 */

angular.module('madbid.directive')
.directive('auctionInfo', function(){
   return {
     restrict: 'E',
     require: '^ngModel',
     scope: {
       ngModel: '=',
       auctionId: '='
     },
     template: '<div>{{ngModel[auctionId]}}</div>',
     controller: function(){

     },
     link: function($scope, $element, attrs){

     }
   };
  });