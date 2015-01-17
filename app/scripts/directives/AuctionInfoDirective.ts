/**
 * Created by thomashourlier on 12/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
    export interface IAuctionInfoScope extends ng.IScope{
        ngModel: AuctionHouse;
        auction: Auction;
        bidder: Bidder;
    }

    export function AuctionInfoDirective(): ng.IDirective {
        return {
            restrict: 'E',
            require: '^ngModel',
            scope: {
                ngModel: '=',
                auction: '=',
                bidder: '='
            },
            link: function ($scope: IAuctionInfoScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes) {
                var ah: AuctionHouse = <AuctionHouse> $scope.ngModel,
                    auction: Auction = <Auction> $scope.auction,
                    bidder: Bidder = <Bidder> $scope.bidder,
                    container: ng.IAugmentedJQuery,
                    graphOptions: HighchartsOptions = {
                        chart: {
                            renderTo: 'container-auction-info',
                            type: 'line',
                            zoomType: 'x',
                            events: {
                                selection: function(e){
                                    /*if (e.xAxis){
                                        $scope.ngModel.dateMin = e.xAxis[0].min;

                                        if (e.xAxis[0].max > highCharts.xAxis[0].dataMax){
                                            $scope.ngModel.dateMax = Number.MAX_VALUE;
                                        } else {
                                            $scope.ngModel.dateMax = e.xAxis[0].max;
                                        }
                                    } else {
                                        $scope.ngModel.dateMin = null;
                                        $scope.ngModel.dateMax = null;
                                    }*/
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
                    graphBidIndexes: IStringNumberMap = {};

                function buildSerie(auction: Auction, bidder: Bidder): HighchartsSeriesOptions{
                    var i: any,
                        bid: Bid,
                        ii: number,
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

                        if (bidder && bid.bidder !== bidder) continue;

                        newLength = serie.data.push({
                            x: bid.date,
                            y: bid.value,
                            name: bid.bidder.getId()
                        });
                        graphBidIndexes[bid.getId()] = newLength- 1;
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
                function updateSerie(auction:Auction, bidder:Bidder, charts: HighchartsChartObject){
                    var i: any,
                        bid: Bid;

                    for (i in auction.bids){
                        bid = auction.bids[i];

                        if (!graphBidIndexes[bid.getId()]){
                            if (bidder && bid.bidder !== bidder) continue;

                            charts.series[0].addPoint({
                                x: bid.date,
                                y: bid.value,
                                name: bid.bidder.getId()
                            }, true, false);
                            graphBidIndexes[bid.getId()] = charts.series[0].data.length - 1;
                        }
                    }
                }

                container = angular.element('<div id="container-auction-info" style="min-width: 310px; height: 400px; margin: 0 auto"></div>');
                $element.append(container);

                highCharts = new Highcharts.Chart(graphOptions);
                highCharts.addSeries(buildSerie(auction,bidder), true);

                $scope.$watch('bidder', function(newVal: Bidder, oldVal: Bidder){
                    if (newVal && newVal !== oldVal){
                        bidder = newVal;

                        highCharts.destroy();
                        highCharts = new Highcharts.Chart(graphOptions);
                        highCharts.addSeries(buildSerie(auction,bidder), true);
                    }
                });
                $scope.$watch(function() {
                    return auction.getNumberBids();
                }, function(newVal: number, oldVal: number){
                    if (newVal && newVal !== oldVal){
                        updateSerie(auction, bidder, highCharts);
                    }
                });
                $scope.$watch('auction', function(newVal: Auction, oldVal: Auction){
                    if(newVal && newVal !== oldVal){
                        auction = newVal;

                        highCharts.destroy();
                        highCharts = new Highcharts.Chart(graphOptions);
                        highCharts.addSeries(buildSerie(auction,bidder), true);

                        highCharts.setTitle({
                            text: 'Bids for ' + auction.item.name || auction.getId().toString()
                        });
                    }
                });
            }
        };
    }
    angular.module('madbid.directive').directive('auctionInfo', AuctionInfoDirective);
}

