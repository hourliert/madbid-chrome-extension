/**
 * Created by thomashourlier on 12/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid.directives {
    interface IBidInfoScope extends ng.IScope{
        ngModel: AuctionHouse;
        auction: Auction;
        bidder: Bidder;
        timeSelection: ITimeSelection;
    }

    export function BidInfoDirective(): ng.IDirective{
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                ngModel: '=',
                auction: '=',
                bidder: '=',
                timeSelection: '='
            },
            link: function($scope: IBidInfoScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes){
                var ah:AuctionHouse = $scope.ngModel,
                    auction: Auction = $scope.auction,
                    bidder: Bidder = $scope.bidder,
                    timeSelection: ITimeSelection = $scope.timeSelection,
                    container: ng.IAugmentedJQuery,
                    graphOptions: HighchartsOptions = {
                        chart: {
                            renderTo: 'container-bid-info',
                            type: 'column'
                        },
                        title: {
                            text: 'Bids time for ' + (auction.item.name || auction.getId().toString()) + ' for ' + ((bidder) ? bidder.getId() : 'everyone')
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
                            headerFormat: '<table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y}</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                animation: false,
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: []
                    },
                    highCharts: HighchartsChartObject,
                    graphBidTime: any = {};

                function buildSerie(auction: Auction, bidder: Bidder, timeSelection: ITimeSelection): HighchartsSeriesOptions{
                    var i: any,
                        ii: number,
                        bid: Bid,
                        serie: HighchartsSeriesOptions = {
                            name: 'Bids',
                            data: [],
                            color: 'rgba(119,152,191,0.9)'
                        };

                    graphBidTime = {};

                    for (i = 0, ii = auction.bidsArray.length; i < ii; i++){
                        bid = auction.bidsArray[i];

                        if (bid.delayBeforeEnd < 0 || bid.delayBeforeEnd > auction.timeout || (bidder && bid.bidder !== bidder) || !bid.isBetween(timeSelection.dateMin, timeSelection.dateMax)) continue;

                        if (!graphBidTime[bid.delayBeforeEnd]) {
                            graphBidTime[bid.delayBeforeEnd] = 1;
                        } else {
                            graphBidTime[bid.delayBeforeEnd]++;
                        }
                    }

                    for (i in graphBidTime){
                        serie.data.push({
                            id: i,
                            name: i,
                            y: graphBidTime[i]
                        });
                    }


                    return serie;
                }
                function updateSerie(auction: Auction, bidder: Bidder, timeSelection: ITimeSelection, chart: HighchartsChartObject){
                    var i: any,
                        ii: number,
                        bid: Bid,
                        bidTime: any = {},
                        highchartPoint: HighchartsPointObject;


                    for (i = 0, ii = auction.bidsArray.length; i < ii; i++){
                        bid = auction.bidsArray[i];

                        if (bid.delayBeforeEnd < 0 || bid.delayBeforeEnd > auction.timeout || (bidder && bid.bidder !== bidder) || !bid.isBetween(timeSelection.dateMin, timeSelection.dateMax)) continue;

                        if (!bidTime[bid.delayBeforeEnd]) {
                            bidTime[bid.delayBeforeEnd] = 1;
                        } else {
                            bidTime[bid.delayBeforeEnd]++;
                        }
                    }

                    for (i in bidTime){
                        highchartPoint = chart.get(i);
                        if (highchartPoint){
                            highchartPoint.update({
                                id: i,
                                name: i,
                                y: bidTime[i]
                            });
                        }
                    }
                }

                container = angular.element('<div id="container-bid-info" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
                $element.append(container);

                highCharts = new Highcharts.Chart(graphOptions);
                highCharts.addSeries(buildSerie(auction, bidder, timeSelection), true);

                $scope.$watch('bidder', function(newVal: Bidder, oldVal: Bidder){
                    if (newVal !== oldVal){
                        bidder = newVal;

                        highCharts.destroy();
                        highCharts = new Highcharts.Chart(graphOptions);
                        highCharts.addSeries(buildSerie(auction, bidder, timeSelection), true);

                        highCharts.setTitle({
                            text: 'Bids time for ' + (auction.item.name || auction.getId().toString()) + ' for ' + ((bidder) ? bidder.getId() : 'everyone')
                        });
                    }
                });
                $scope.$watch('timeSelection', function(newVal: ITimeSelection, oldVal: ITimeSelection){
                    if (newVal && newVal !== oldVal){
                        timeSelection = newVal;

                        highCharts.destroy();
                        highCharts = new Highcharts.Chart(graphOptions);
                        highCharts.addSeries(buildSerie(auction, bidder, timeSelection), true);
                    }
                }, true);
                $scope.$watch(function(){
                    return auction.getNumberBids();
                }, function(newVal: number, oldVal: number){
                    if (newVal && newVal !== oldVal){
                        if (auction.hasNewBidTimeSinceFor(graphBidTime, bidder, timeSelection.dateMin, timeSelection.dateMax)){
                            highCharts.destroy();
                            highCharts = new Highcharts.Chart(graphOptions);
                            highCharts.addSeries(buildSerie(auction, bidder, timeSelection), true);
                        } else {
                            updateSerie(auction, bidder, timeSelection, highCharts);
                        }
                    }
                });
                $scope.$watch('auction', function(newVal: Auction, oldVal: Auction){
                    if (newVal !== oldVal){
                        auction = newVal;

                        highCharts.destroy();
                        highCharts = new Highcharts.Chart(graphOptions);
                        highCharts.addSeries(buildSerie(auction, bidder, timeSelection), true);

                        highCharts.setTitle({
                            text: 'Bids time for ' + (auction.item.name || auction.getId().toString()) + ' for ' + ((bidder) ? bidder.getId() : 'everyone')
                        });
                    }
                });
            }
        };
    }

    Madbid.registerDirective('bidInfo', BidInfoDirective);
}

