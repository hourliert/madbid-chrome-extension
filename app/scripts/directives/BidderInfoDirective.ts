/**
 * Created by thomashourlier on 12/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid.directives {
    interface IBidderInfoScope extends ng.IScope{
        ngModel: AuctionHouse;
        auction: Auction;
        timeSelection: ITimeSelection;
        observeBidderSelection: {(o: {bidderName: string}): void};
    }

    export function BidderInfoDirective(): ng.IDirective{
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                ngModel: '=',
                auction: '=',
                timeSelection: '=',
                observeBidderSelection: '&'
            },
            link: function($scope: IBidderInfoScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes){
                var ah:AuctionHouse = $scope.ngModel,
                    auction: Auction = $scope.auction,
                    timeSelection: ITimeSelection = $scope.timeSelection,
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
                            },
                            series: {
                                events: {
                                    click: function(e: HighchartsAreaClickEvent){
                                        $scope.observeBidderSelection({
                                            bidderName: e.point.name
                                        });
                                    }
                                }
                            }
                        },
                        series: []
                    },
                    highCharts: HighchartsChartObject,
                    bidderBidsNumberMap: IStringNumberMap = {},
                    graphBidderIndexes: IStringNumberMap = {},
                    graphBidder: IBidderMap = {};

                function buildSerie(auction: Auction, timeSelection: ITimeSelection): HighchartsSeriesOptions{
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

                        if (!bidder.hasBidOn(auction) || !(nbBids = bidder.getNumberBidsOn(auction, timeSelection.dateMin, timeSelection.dateMax))) continue;

                        newLength = serie.data.push({
                            id: bidder.getId(),
                            name: bidder.getId(),
                            y: nbBids
                        });

                        graphBidderIndexes[bidder.getId()] = newLength - 1;
                        graphBidder[bidder.getId()] = bidder;
                        bidderBidsNumberMap[bidder.getId()] = nbBids;
                    }

                    return serie;
                }
                function updateSerie(auction: Auction, timeSelection: ITimeSelection, chart: HighchartsChartObject){
                    var i: any,
                        nbBids: number,
                        highchartPoint: HighchartsPointObject,
                        bidder: Bidder;

                    for (i in ah.bidders){
                        bidder = ah.bidders[i];

                        if (!bidder.hasBidOn(auction) || !(nbBids = bidder.getNumberBidsOn(auction, timeSelection.dateMin, timeSelection.dateMax))) continue;

                        if (nbBids !== bidderBidsNumberMap[bidder.getId()]){
                            highchartPoint = chart.get(bidder.getId());

                            if (highchartPoint){
                                highchartPoint.update({
                                    name: bidder.getId(),
                                    y: nbBids
                                }, true);

                                bidderBidsNumberMap[bidder.getId()] = nbBids;
                            }
                        }
                    }
                }

                container = angular.element('<div id="container-bidders-info" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
                $element.append(container);

                highCharts = new Highcharts.Chart(graphOptions);
                highCharts.addSeries(buildSerie(auction, timeSelection), true);

                $scope.$watch('timeSelection', function(newVal: ITimeSelection, oldVal: ITimeSelection){
                    if (newVal && newVal !== oldVal){
                        timeSelection = newVal;
                        highCharts.destroy();
                        highCharts = new Highcharts.Chart(graphOptions);
                        highCharts.addSeries(buildSerie(auction, timeSelection), true);
                    }
                }, true);
                $scope.$watch(function(){
                    return auction.getNumberBids();
                }, function(newVal: number, oldVal: number){
                    if (newVal && newVal !== oldVal){
                        if (auction.hasNewBidderOnSince(graphBidder, timeSelection.dateMin, timeSelection.dateMax)){
                            highCharts.destroy();
                            highCharts = new Highcharts.Chart(graphOptions);
                            highCharts.addSeries(buildSerie(auction, timeSelection), true);
                        } else {
                            updateSerie(auction, timeSelection, highCharts);
                        }
                    }
                });
                $scope.$watch('auction', function(newVal: Auction, oldVal: Auction){
                    if (newVal !== oldVal){
                        auction = newVal;

                        highCharts.destroy();
                        highCharts = new Highcharts.Chart(graphOptions);
                        highCharts.addSeries(buildSerie(auction, timeSelection), true);

                        highCharts.setTitle({
                            text: 'Bidders for ' + auction.item.name || auction.getId().toString()
                        });
                    }
                });
            }
        };
    }

    Madbid.registerDirective('bidderInfo', BidderInfoDirective);
}

