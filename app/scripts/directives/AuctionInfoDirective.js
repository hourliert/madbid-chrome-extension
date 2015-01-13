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
           item,
           data = [],
           i,
           ii,
           container,
           highCharts;

       console.log(itemPoints);

       for (i = 0, ii = itemPoints.length ; i < ii ; i++){
         item = itemPoints[i];
         data.push([item.date, item.price]);
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
           color: 'rgba(223, 83, 83, .5)',
           data: data
         }]
       });

       highCharts = container.highcharts();
       console.log(highCharts);

     }
   };
  });