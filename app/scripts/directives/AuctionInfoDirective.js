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
     controller: function(){

     },
     link: function($scope, $element, attrs){
       var itemPoints = $scope.ngModel[$scope.auctionId].updatePoints,
           auctionIndex = {},
           item,
           data = [],
           container,
           i,
           ii,
           highCharts;

       for (i = 0, ii = itemPoints.length ; i < ii ; i++){
         item = itemPoints[i];
         data.push([item.date, item.price]);
         auctionIndex[+new Date(item.date) + '_' + item.price] = i;
       }

       container = angular.element('<div id="container-auction-info" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
       angular.element($element[0]).append(container);
       container = $($element[0].firstChild);

       container.highcharts({
         chart: {
           type: 'scatter',
           zoomType: 'xy'
         },
         title: {
           text: 'Bids over time for ' + $scope.auctionId
         },
         subtitle: {
           text: 'Since last reset / launch'
         },
         xAxis: {
           title: {
             enabled: true,
             text: 'Time'
           },
           startOnTick: true,
           endOnTick: true,
           showLastLabel: true
         },
         yAxis: {
           title: {
             text: 'Price (€)'
           }
         },
         legend: {
           layout: 'vertical',
           align: 'left',
           verticalAlign: 'top',
           x: 100,
           y: 70,
           floating: true,
           backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
           borderWidth: 1
         },
         plotOptions: {
           scatter: {
             marker: {
               radius: 3,
               states: {
                 hover: {
                   enabled: true,
                   lineColor: 'rgb(100,100,100)'
                 }
               }
             },
             states: {
               hover: {
                 marker: {
                   enabled: false
                 }
               }
             },
             tooltip: {
               headerFormat: '<b>{series.name}</b><br>',
               pointFormat: '{point.x} cm, {point.y} kg'
             }
           }
         },
         series: [{
           name: 'Bids',
           color: 'rgba(119,152,191,0.9)',
           data: data
         }]
       });

       highCharts = container.highcharts();


       $scope.$watch(function(){
         return $scope.auctionId;
       }, function(newVal, oldVal){
         if (newVal && newVal !== oldVal){

         }
       });

       $scope.$watch(function(){
         return [$scope.auctionId, $scope.ngModel[$scope.auctionId]];
       }, function(newVal, oldVal){
         if(newVal && newVal !== oldVal){
           if (newVal[0] !== oldVal[0]){
             highCharts.series[0].remove(true);
             highCharts.addSeries({
               name: 'Bids',
               color: 'rgba(119,152,191,0.9)'
             });
           }

           var itemPoints = newVal[1].updatePoints,
               item,
               index,
               i,
               ii;

           for (i = 0, ii = itemPoints.length ; i < ii ; i++){
             item = itemPoints[i];
             index = +new Date(item.date) + '_' + item.price;
             if (!auctionIndex[index]){
               highCharts.series[0].addPoint([item.date, item.price], true);
               auctionIndex[index] = highCharts.series[0].data.length - 1;
             }
           }
         }
       }, true);
     }
   };
  });