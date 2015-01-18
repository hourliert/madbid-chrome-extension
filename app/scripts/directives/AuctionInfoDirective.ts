/**
 * Created by thomashourlier on 12/01/15.
 */

/// <reference path='../_all.ts' />

'use strict';

module Madbid.directives {
    interface IAuctionInfoScope extends ng.IScope{
        ngModel: AuctionHouse;
        auction: Auction;
        bidder: Bidder;
        timeSelection: ITimeSelection;
    }

    export function AuctionInfoDirective(): ng.IDirective {
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                ngModel: '=',
                auction: '=',
                bidder: '=',
                timeSelection: '='
            },
            link: function ($scope: IAuctionInfoScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes) {
                var ah: AuctionHouse = $scope.ngModel,
                    auction: Auction = $scope.auction,
                    bidder: Bidder = $scope.bidder,
                    timeSelection: ITimeSelection = $scope.timeSelection,
                    container: ng.IAugmentedJQuery,
                    graphOptions: HighchartsOptions = {
                        chart: {
                            renderTo: 'container-auction-info',
                            type: 'line',
                            zoomType: 'x',
                            events: {
                                selection: function(e: HighchartsSelectionEvent){
                                    var extremes: HighchartsExtremes = highCharts.xAxis[0].getExtremes();

                                    if (e.xAxis){
                                        timeSelection.dateMin = new Date(e.xAxis[0].min);

                                        if (e.xAxis[0].max > extremes.dataMax){
                                            timeSelection.dateMax = null;
                                        } else {
                                            timeSelection.dateMax = new Date(e.xAxis[0].max);
                                        }
                                    } else {
                                        timeSelection.dateMin = null;
                                        timeSelection.dateMax = null;
                                    }
                                }
                            }
                        },
                        title: {
                            text: 'Bids for ' + auction.item.name || auction.getId().toString()
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
                            backgroundColor: '#FFFFFF',
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
                    },
                    highCharts: HighchartsChartObject,
                    graphBidIndexes: IStringNumberMap = {},
                    graphBid: IBidMap = {};

                function buildSerie(auction: Auction, bidder: Bidder, chart: HighchartsChartObject): HighchartsSeriesOptions{
                    var i: any,
                        bid: Bid,
                        highchartPoint: HighchartsPointObject,
                        newLength: number,
                        serie: HighchartsSeriesOptions = {
                            name: 'Bids',
                            color: 'rgba(119,152,191,0.9)',
                            data: [],
                            turboThreshold: 0,
                            shadow: false,
                            animation: false
                        };

                    for (i in auction.bids){
                        bid = auction.bids[i];

                        newLength = serie.data.push({
                            id: bid.getId(),
                            x: bid.date,
                            y: bid.value,
                            name: bid.bidder.getId()
                        });

                        if (bidder && bid.hasBidder(bidder)){
                            highchartPoint = chart.get(bid.getId());
                            try {
                                highchartPoint.select(true, true);
                            } catch(e){
                            }
                        }

                        graphBidIndexes[bid.getId()] = newLength- 1;
                        graphBid[bid.getId()] = bid;
                    }

                    serie.data.sort(function(t1, t2){
                        if (t1.x < t2.x){
                            return -1;
                        } else {
                            return 1;
                        }
                        return 0;
                    });

                    return serie;
                }
                function updateSerie(auction: Auction, bidder: Bidder, chart: HighchartsChartObject){
                    var i: any,
                        highchartPoint: HighchartsPointObject,
                        bid: Bid;

                    for (i in graphBid){
                        bid = graphBid[i];

                        highchartPoint = chart.get(bid.getId());

                        try {
                            if (bidder && bid.hasBidder(bidder)) {
                                highchartPoint.select(true, true);
                            } else {
                                highchartPoint.select(false, true);
                            }
                        } catch(e){
                        }
                    }
                }
                function completeSerie(auction:Auction, bidder:Bidder, chart: HighchartsChartObject){
                    var i: any,
                        highchartPoint: HighchartsPointObject,
                        bid: Bid;

                    for (i in auction.bids){
                        bid = auction.bids[i];

                        if (!graphBidIndexes[bid.getId()]){
                            chart.series[0].addPoint({
                                id: bid.getId(),
                                x: bid.date,
                                y: bid.value,
                                name: bid.bidder.getId()
                            }, true, false);

                            if (bidder && bid.hasBidder(bidder)){
                                highchartPoint = chart.get(bid.getId());
                                try {
                                    highchartPoint.select(true, true);
                                } catch(e){
                                }
                            }

                            graphBidIndexes[bid.getId()] = chart.series[0].data.length - 1;
                            graphBid[bid.getId()] = bid;
                        }
                    }
                }

                container = angular.element('<div id="container-auction-info" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
                $element.append(container);

                highCharts = new Highcharts.Chart(graphOptions);
                highCharts.addSeries(buildSerie(auction, bidder, highCharts), true);

                $scope.$watch('bidder', function(newVal: Bidder, oldVal: Bidder){
                    if (newVal !== oldVal){
                        bidder = newVal;

                        updateSerie(auction, bidder, highCharts);
                    }
                });
                $scope.$watch(function() {
                    return auction.getNumberBids();
                }, function(newVal: number, oldVal: number){
                    if (newVal && newVal !== oldVal){
                        completeSerie(auction, bidder, highCharts);
                    }
                });
                $scope.$watch('auction', function(newVal: Auction, oldVal: Auction){
                    if(newVal !== oldVal){
                        auction = newVal;

                        highCharts.destroy();
                        highCharts = new Highcharts.Chart(graphOptions);
                        highCharts.addSeries(buildSerie(auction, bidder, highCharts), true);

                        highCharts.setTitle({
                            text: 'Bids for ' + auction.item.name || auction.getId().toString()
                        });
                    }
                });
            }
        };
    }

    Madbid.registerDirective('auctionInfo', AuctionInfoDirective);
}

