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
       var itemPoints = $scope.ngModel.items[$scope.auctionId].updatePoints,
           auctionIndex = {},
           item,
           data = [],
           container,
           i,
           ii,
           oldAuctionId = $scope.auctionId,
           oldBidderName = $scope.bidderName,
           highCharts,
           graphOptions = {
             chart: {
               renderTo: 'container-auction-info',
               type: 'line',
               zoomType: 'x',
               events: {
                 selection: function(e){
                   if (e.xAxis){
                      $scope.ngModel.dateMin = e.xAxis[0].min;

                      if (e.xAxis[0].max > highCharts.xAxis[0].dataMax){
                        $scope.ngModel.dateMax = Number.MAX_VALUE;
                      } else {
                        $scope.ngModel.dateMax = e.xAxis[0].max;
                      }
                   } else {
                     $scope.ngModel.dateMin = null;
                     $scope.ngModel.dateMax = null;
                   }
                 }
               }
             },
             title: {
               text: 'Bids for ' + $scope.ngModel.items[$scope.auctionId].title || $scope.auctionId
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
             series: []
           };

       container = angular.element('<div id="container-auction-info" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
       angular.element($element[0]).append(container);
       container = $($element[0].firstChild);

       for (i = 0, ii = itemPoints.length ; i < ii ; i++){
         item = itemPoints[i];
         if ($scope.bidderName && item.winner !== $scope.bidderName){
           continue;
         }
         data.push({
           x: new Date(item.date),
           y: item.price,
           name: item.winner
         });
         auctionIndex[+new Date(item.date) + '_' + item.price] = i;
       }

       highCharts = new Highcharts.Chart(graphOptions);
       highCharts.addSeries({
         name: 'Bids',
         color: 'rgba(119,152,191,0.9)',
         data: data,
         turboThreshold: 0,
         shadow: false,
         animation: false
       }, true);

       $scope.ngModel.dateMin = null;
       $scope.ngModel.dateMax = null;

       $scope.$watch(function(){
         return $scope.auctionId + $scope.ngModel.items[$scope.auctionId].updatePoints.length + (($scope.bidderName) ? $scope.bidderName.length : 0);
       }, function(newVal){
         if(newVal){
           var start = +new Date(),
               itemPoints = $scope.ngModel.items[$scope.auctionId].updatePoints,
               item,
               index,
               i,
               ii;

           if ($scope.auctionId !== oldAuctionId || $scope.bidderName !== oldBidderName){
             var data = [];

             for (i = 0, ii = itemPoints.length ; i < ii ; i++){
               item = itemPoints[i];
               if ($scope.bidderName && item.winner !== $scope.bidderName){
                  continue;
               }
               data.push({
                 x: new Date(item.date),
                 y: item.price,
                 name: item.winner
               });
               auctionIndex[+new Date(item.date) + '_' + item.price] = i;
             }


             highCharts.destroy();
             highCharts = new Highcharts.Chart(graphOptions);

             highCharts.addSeries({
               name: 'Bids',
               color: 'rgba(119,152,191,0.9)',
               data: data,
               turboThreshold: 0,
               shadow: false,
               animation: false
             });
             $scope.ngModel.dateMin = null;
             $scope.ngModel.dateMax = null;
           } else {
             for (i = 0, ii = itemPoints.length ; i < ii ; i++){
               item = itemPoints[i];
               index = +new Date(item.date) + '_' + item.price;
               if (!auctionIndex[index]){
                 if ($scope.bidderName && item.winner !== $scope.bidderName){
                   continue;
                 }

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
             text: 'Bids for ' + $scope.ngModel.items[$scope.auctionId].title || $scope.auctionId
           });

           oldAuctionId = $scope.auctionId;
           oldBidderName = $scope.bidderName;
           console.log('bids', (+new Date() - start), 'ms');
         }
       });
     }
   };
  });