/**
 * Created by thomashourlier on 12/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
    export interface IBidderInfoScope extends ng.IScope{
        ngModel: AuctionHouse;
        auction: Auction;
    }
    export function BidderInfoDirective(): ng.IDirective{
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                ngModel: '=',
                auction: '='
            },
            link: function($scope: IBidderInfoScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes){
                var ah:AuctionHouse = $scope.ngModel,
                    auction: Auction = $scope.auction,
                    container: ng.IAugmentedJQuery,
                    graphOptions: HighchartsOptions = {
                        chart: {
                            renderTo: 'container-bidders-info',
                            type: 'column'
                        },
                        title: {
                            text: 'Bidders for ' + auction.item.name || auction.getId().toString()
                        },
                        subtitle: {
                            text: 'Since last reset / launch'
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Number of bids'
                            }
                        },
                        xAxis: {
                            type: 'category'
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: []
                    },
                    highCharts: HighchartsChartObject,
                    bidderBidsNumberMap: IStringNumberMap = {},
                    graphBidderIndexes: IStringNumberMap = {},
                    graphBidder: IBidderMap = {};

                function buildSerie(auction: Auction): HighchartsSeriesOptions{
                    var i: any,
                        bidder: Bidder,
                        nbBids: number,
                        newLength: number,
                        serie: HighchartsSeriesOptions = {
                            name: 'Bids',
                            data: [],
                            color: 'rgba(119,152,191,0.9)'
                        };

                    graphBidderIndexes = {};
                    graphBidder = {};
                    bidderBidsNumberMap = {};

                    for (i in ah.bidders){
                        bidder = ah.bidders[i];

                        if (!bidder.isBiddingOn(auction)) continue;

                        nbBids = bidder.getNumberBidsOn(auction);

                        newLength = serie.data.push({
                            name: bidder.getId(),
                            y: nbBids
                        });

                        graphBidderIndexes[bidder.getId()] = newLength - 1;
                        graphBidder[bidder.getId()] = bidder;
                        bidderBidsNumberMap[bidder.getId()] = nbBids;
                    }

                    return serie;
                }
                function updateSerie(auction: Auction, chart: HighchartsChartObject){
                    var i: any,
                        nbBids: number,
                        highchartPoint: HighchartsPointObject,
                        bidder: Bidder;

                    for (i in ah.bidders){
                        bidder = ah.bidders[i];

                        if (!bidder.isBiddingOn(auction)) continue;

                        nbBids = bidder.getNumberBidsOn(auction);
                        if (nbBids !== bidderBidsNumberMap[bidder.getId()]){
                            highchartPoint = highCharts.series[0].points[graphBidderIndexes[bidder.getId()]];
                            highchartPoint.update({
                                name: bidder.getId(),
                                y: nbBids
                            }, true);
                        }
                    }
                }

                container = angular.element('<div id="container-bidders-info" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
                $element.append(container);

                highCharts = new Highcharts.Chart(graphOptions);
                highCharts.addSeries(buildSerie(auction), true);

                $scope.$watch(function(){
                    return auction.getNumberBids();
                }, function(newVal: number, oldVal: number){
                    if (newVal && newVal !== oldVal){
                        if (auction.hasNewBidderSince(graphBidder)){
                            highCharts.destroy();
                            highCharts = new Highcharts.Chart(graphOptions);
                            highCharts.addSeries(buildSerie(auction), true);
                        } else {
                            updateSerie(auction, highCharts);
                        }
                    }
                });

                $scope.$watch('auction', function(newVal: Auction, oldVal: Auction){
                    if (newVal && newVal !== oldVal){
                        auction = newVal;

                        highCharts.destroy();
                        highCharts = new Highcharts.Chart(graphOptions);
                        highCharts.addSeries(buildSerie(auction), true);
                    }
                });

            }
        };
    }

    angular.module('madbid.directive').directive('bidderInfo', BidderInfoDirective);
}

/*
angular.module('madbid.directive')
  .directive('bidderInfo', function(){
    return {
      restrict: 'E',
      require: '^ngModel',
      scope: {
        ngModel: '=',
        bidderName: '=',
        auctionId: '='
      },
      template: '<div>{{ngModel[bidderName]}}</div>',
      controller: function(){

      },
      link: function($scope, $element, attrs){



          var container,
            i,
            j,
            oldAuctionId = $scope.auctionId,
            bidder,
            data = [],
            bidderIndex = {},
            highCharts,
            graphOptions = {
              chart: {
                  renderTo: 'container-bidders-info',
                  type: 'column'
              },
              title: {
                  text: 'Bidders for ' + $scope.ngModel.items[$scope.auctionId].title || $scope.auctionId
              },
              subtitle: {
                  text: 'Since last reset / launch'
              },
              yAxis: {
                  min: 0,
                  title: {
                      text: 'Number of bids'
                  }
              },
              xAxis: {
                  type: 'category'
              },
              tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y}</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
              },
              plotOptions: {
                  column: {
                      pointPadding: 0.2,
                      borderWidth: 0
                  }
              },
              series: []
            };


          container = angular.element('<div id="container-bidders-info" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
          angular.element($element[0]).append(container);
          container = $($element[0].firstChild);

          for (i in $scope.ngModel.bidders){
             bidder = $scope.ngModel.bidders[i];
             for (j in bidder.bids){
                if (j === $scope.auctionId){
                    data.push({
                        name: i,
                        y: bidder.bids[j].updatePoints.length
                    });
                    bidderIndex[i] = data.length - 1;
                    break;
                }
             }
          }

          highCharts = new Highcharts.Chart(graphOptions);
          highCharts.addSeries({
              name: 'Bids',
              data: data,
              color: 'rgba(119,152,191,0.9)'
          }, true);


          $scope.$watch(function(){
              return $scope.auctionId + $scope.ngModel.items[$scope.auctionId].updatePoints.length + (($scope.ngModel.dateMin) ? $scope.ngModel.dateMin : 0);
          }, function(newVal){
              if (newVal){
                  var start = +new Date(),
                      i,
                      j,
                      k,
                      kk,
                      cpt = 0,
                      bidder,
                      bidderPoints,
                      highchartPoint,
                      dateMin,
                      dateMax,
                      categories = [],
                      graphCategorie = highCharts.xAxis[0].names,
                      shouldRedrawGraph = false,
                      data = [];

                  console.log($scope.ngModel.dateMin, $scope.ngModel.dateMax);

                  for (i in $scope.ngModel.bidders){
                      bidder = $scope.ngModel.bidders[i];
                      for (j in bidder.bids){
                          if (j === $scope.auctionId){
                              if ($scope.ngModel.dateMin && $scope.ngModel.dateMax){
                                 bidderPoints = bidder.bids[$scope.auctionId].updatePoints;
                                 for (k = 0, kk = bidderPoints.length; k < kk ; k++){
                                     dateMin = +new Date(bidderPoints[k].date);
                                     dateMax = +new Date(bidderPoints[k].endDate);
                                     if (dateMin > $scope.ngModel.dateMin && dateMax < $scope.ngModel.dateMax){
                                         categories.push(i);
                                         break;
                                     }
                                 }
                              } else {
                                 categories.push(i);
                              }
                              break;
                          }
                      }
                  }

                  if (categories.length !== graphCategorie.length){
                      shouldRedrawGraph = true;
                  }

                  if ($scope.auctionId !== oldAuctionId || shouldRedrawGraph){
                      for (i in $scope.ngModel.bidders){
                          bidder = $scope.ngModel.bidders[i];
                          for (j in bidder.bids){
                              if (j === $scope.auctionId){
                                  if ($scope.ngModel.dateMin && $scope.ngModel.dateMax){
                                      bidderPoints = bidder.bids[$scope.auctionId].updatePoints;

                                      cpt = 0;
                                      for (k = 0, kk = bidderPoints.length; k < kk ; k++){
                                          dateMin = +new Date(bidderPoints[k].date);
                                          dateMax = +new Date(bidderPoints[k].endDate);
                                          if (dateMin > $scope.ngModel.dateMin && dateMax < $scope.ngModel.dateMax){
                                              cpt++;
                                          }
                                      }

                                      if (cpt){
                                          data.push({
                                              name: i,
                                              y: cpt
                                          });
                                          bidderIndex[i] = data.length - 1;
                                      }
                                  } else {
                                      data.push({
                                          name: i,
                                          y: bidder.bids[j].updatePoints.length
                                      });
                                      bidderIndex[i] = data.length - 1;
                                  }
                                  break;
                              }
                          }
                      }

                      highCharts.destroy();
                      highCharts = new Highcharts.Chart(graphOptions);

                      highCharts.addSeries({
                          name: 'Bids',
                          data: data,
                          color: 'rgba(119,152,191,0.9)'
                      }, true);
                  } else {
                      for (i in $scope.ngModel.bidders){
                          bidder = $scope.ngModel.bidders[i];

                          highchartPoint = highCharts.series[0].data[bidderIndex[i]];
                          for (j in bidder.bids){
                              if (j === $scope.auctionId){
                                  if ($scope.ngModel.dateMin && $scope.ngModel.dateMax){
                                      bidderPoints = bidder.bids[$scope.auctionId].updatePoints;

                                      cpt = 0;
                                      for (k = 0, kk = bidderPoints.length; k < kk ; k++){
                                          dateMin = +new Date(bidderPoints[k].date);
                                          dateMax = +new Date(bidderPoints[k].endDate);
                                          if (dateMin > $scope.ngModel.dateMin && dateMax < $scope.ngModel.dateMax){
                                              cpt++;
                                          }
                                      }
                                      if (highchartPoint && (cpt !== highchartPoint.y) && cpt){
                                          highchartPoint.update({
                                              name: i,
                                              y: cpt
                                          }, true);
                                      }
                                  } else {
                                      if (highchartPoint && (bidder.bids[j].updatePoints.length !== highchartPoint.y)){
                                          highchartPoint.update({
                                              name: i,
                                              y: bidder.bids[j].updatePoints.length
                                          }, true);
                                      }
                                  }

                                  break;
                              }
                          }
                      }
                  }



                  highCharts.setTitle({
                      text: 'Bidders for ' + $scope.ngModel.items[$scope.auctionId].title || $scope.auctionId
                  });
                  oldAuctionId = $scope.auctionId;

                  console.log('bidders', (+new Date() - start), 'ms');
              }
          });
      }
    };
  });*/
