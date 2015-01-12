/**
 * Created by thomashourlier on 12/01/15.
 */

angular.module('madbid.directive')
  .directive('bidderInfo', function(){
    return {
      restrict: 'E',
      require: '^ngModel',
      scope: {
        ngModel: '=',
        bidderName: '='
      },
      template: '',
      controller: function(){

      },
      link: function($scope, $element, attrs){

      }
    };
  });