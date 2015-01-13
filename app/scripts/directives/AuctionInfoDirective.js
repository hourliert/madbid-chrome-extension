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
       auctionId: '=',
       bidderName: '='
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
         data.push({
           x: new Date(item.date),
           y: item.price,
           name: item.winner
         });
         auctionIndex[+new Date(item.date) + '_' + item.price] = i;
       }

       container = angular.element('<div id="container-auction-info" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
       angular.element($element[0]).append(container);
       container = $($element[0].firstChild);

       container.highcharts({
         chart: {
           type: 'line',
           zoomType: 'xy'
         },
         title: {
           text: 'Bids over time for ' + $scope.ngModel[$scope.auctionId].title || $scope.auctionId
         },
         subtitle: {
           text: 'Since last reset / launch'
         },
         xAxis: {
           title: {
             enabled: true,
             text: 'Time'
           },
           type: 'datetime',
           startOnTick: true,
           endOnTick: true,
           showLastLabel: true
         },
         yAxis: {
           title: {
             text: 'Price (euros)'
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
           line: {
             animation: false,
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
               animation: false,
               headerFormat: '<b>{series.name}</b><br>',
               pointFormat: 'Bidder <strong>{point.name}</strong><br/>{point.x}<br/><strong>{point.y}</strong> euros'
             },
             dataGrouping: {
               approximation: 'average',
               enabled: 'true',
               groupPixelWidth: 2,
               dateTimeLabelFormats: {
                 second: '%H:%M:%S',
                 minute: '%H:%M',
                 hour: '%H:%M',
                 day: '%e. %b',
                 week: '%e. %b',
                 month: '%b \'%y',
                 year: '%Y'
               }
             }
           },
           serie: {
             animation: false
           }
         },
         series: [{
           name: 'Bids',
           color: 'rgba(119,152,191,0.9)',
           data: data,
           turboThreshold: 0,
           shadow: false,
           animation: false
         }]
       });

       highCharts = container.highcharts();


       $scope.$watch(function(){
         return $scope.bidderName;
       }, function(newVal, oldVal){
         if (newVal && newVal !== oldVal){
           console.log(newVal);

         }
       });

       $scope.$watch(function(){
         return [$scope.auctionId, $scope.ngModel[$scope.auctionId]];
       }, function(newVal, oldVal){
         if(newVal && newVal[0] && newVal[1] && newVal !== oldVal){
           var start = +new Date(),
               itemPoints = newVal[1].updatePoints,
               item,
               index,
               i,
               ii;

           if (newVal[0] !== oldVal[0]){
             var data = [];

             for (i = 0, ii = itemPoints.length ; i < ii ; i++){
               item = itemPoints[i];
               data.push({
                 x: new Date(item.date),
                 y: item.price,
                 name: item.winner
               });
               auctionIndex[+new Date(item.date) + '_' + item.price] = i;
             }

             highCharts.series[0].remove(true);
             highCharts.addSeries({
               name: 'Bids',
               color: 'rgba(119,152,191,0.9)',
               data: data,
               turboThreshold: 0,
               shadow: false,
               animation: false
             });

           } else {

             for (i = 0, ii = itemPoints.length ; i < ii ; i++){
               item = itemPoints[i];
               index = +new Date(item.date) + '_' + item.price;
               if (!auctionIndex[index]){
                 highCharts.series[0].addPoint({
                   x: new Date(item.date),
                   y: item.price,
                   name: item.winner
                 }, true);
                 auctionIndex[index] = highCharts.series[0].data.length - 1;
               }
             }
           }

           highCharts.setTitle({
             text: newVal[1].title || $scope.auctionId
           });
         }
       }, true);
     }
   };
  });