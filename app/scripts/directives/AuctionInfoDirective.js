/**
 * Created by thomashourlier on 12/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var directives;
    (function (directives) {
        function AuctionInfoDirective() {
            return {
                restrict: 'E',
                require: '^ngModel',
                scope: {
                    ngModel: '=',
                    auction: '=',
                    bidder: '=',
                    timeSelection: '='
                },
                link: function ($scope, $element, $attrs) {
                    var ah = $scope.ngModel, auction = $scope.auction, bidder = $scope.bidder, timeSelection = $scope.timeSelection, container, graphOptions = {
                        chart: {
                            renderTo: 'container-auction-info',
                            type: 'line',
                            zoomType: 'x',
                            events: {
                                selection: function (e) {
                                    var extremes = highCharts.xAxis[0].getExtremes();
                                    if (e.xAxis) {
                                        timeSelection.dateMin = new Date(e.xAxis[0].min);
                                        if (e.xAxis[0].max > extremes.dataMax) {
                                            timeSelection.dateMax = null;
                                        }
                                        else {
                                            timeSelection.dateMax = new Date(e.xAxis[0].max);
                                        }
                                    }
                                    else {
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
                    }, highCharts, graphBidIndexes = {}, graphBid = {};
                    function buildSerie(auction, bidder, chart) {
                        var i, bid, highchartPoint, newLength, serie = {
                            name: 'Bids',
                            color: 'rgba(119,152,191,0.9)',
                            data: [],
                            turboThreshold: 0,
                            shadow: false,
                            animation: false
                        };
                        for (i in auction.bids) {
                            bid = auction.bids[i];
                            newLength = serie.data.push({
                                id: bid.getId(),
                                x: bid.date,
                                y: bid.value,
                                name: bid.bidder.getId()
                            });
                            if (bidder && bid.hasBidder(bidder)) {
                                highchartPoint = chart.get(bid.getId());
                                try {
                                    highchartPoint.select(true, true);
                                }
                                catch (e) {
                                }
                            }
                            graphBidIndexes[bid.getId()] = newLength - 1;
                            graphBid[bid.getId()] = bid;
                        }
                        serie.data.sort(function (t1, t2) {
                            if (t1.x < t2.x) {
                                return -1;
                            }
                            else {
                                return 1;
                            }
                            return 0;
                        });
                        return serie;
                    }
                    function updateSerie(auction, bidder, chart) {
                        var i, highchartPoint, bid;
                        for (i in graphBid) {
                            bid = graphBid[i];
                            highchartPoint = chart.get(bid.getId());
                            try {
                                if (bidder && bid.hasBidder(bidder)) {
                                    highchartPoint.select(true, true);
                                }
                                else {
                                    highchartPoint.select(false, true);
                                }
                            }
                            catch (e) {
                            }
                        }
                    }
                    function completeSerie(auction, bidder, chart) {
                        var i, highchartPoint, bid;
                        for (i in auction.bids) {
                            bid = auction.bids[i];
                            if (!graphBidIndexes[bid.getId()]) {
                                chart.series[0].addPoint({
                                    id: bid.getId(),
                                    x: bid.date,
                                    y: bid.value,
                                    name: bid.bidder.getId()
                                }, true, false);
                                if (bidder && bid.hasBidder(bidder)) {
                                    highchartPoint = chart.get(bid.getId());
                                    try {
                                        highchartPoint.select(true, true);
                                    }
                                    catch (e) {
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
                    $scope.$watch('bidder', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                            bidder = newVal;
                            updateSerie(auction, bidder, highCharts);
                        }
                    });
                    $scope.$watch(function () {
                        return auction.getNumberBids();
                    }, function (newVal, oldVal) {
                        if (newVal && newVal !== oldVal) {
                            completeSerie(auction, bidder, highCharts);
                        }
                    });
                    $scope.$watch('auction', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
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
        directives.AuctionInfoDirective = AuctionInfoDirective;
        Madbid.registerDirective('auctionInfo', AuctionInfoDirective);
    })(directives = Madbid.directives || (Madbid.directives = {}));
})(Madbid || (Madbid = {}));
//# sourceMappingURL=AuctionInfoDirective.js.map