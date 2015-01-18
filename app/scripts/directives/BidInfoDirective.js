/**
 * Created by thomashourlier on 12/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var directives;
    (function (directives) {
        function BidInfoDirective() {
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
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
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
                    }, highCharts, graphBidTime = {};
                    function buildSerie(auction, bidder, timeSelection) {
                        var i, bid, serie = {
                            name: 'Bids',
                            data: [],
                            color: 'rgba(119,152,191,0.9)'
                        };
                        graphBidTime = {};
                        for (i in auction.bids) {
                            bid = auction.bids[i];
                            if (bid.delayBeforeEnd < 0 || bid.delayBeforeEnd > auction.timeout || (bidder && bid.bidder !== bidder) || !bid.isBetween(timeSelection.dateMin, timeSelection.dateMax))
                                continue;
                            if (!graphBidTime[bid.delayBeforeEnd]) {
                                graphBidTime[bid.delayBeforeEnd] = 1;
                            }
                            else {
                                graphBidTime[bid.delayBeforeEnd]++;
                            }
                        }
                        for (i in graphBidTime) {
                            serie.data.push({
                                id: i,
                                name: i,
                                y: graphBidTime[i]
                            });
                        }
                        return serie;
                    }
                    function updateSerie(auction, bidder, timeSelection, chart) {
                        var i, bid, bidTime = {}, highchartPoint;
                        for (i in auction.bids) {
                            bid = auction.bids[i];
                            if (bid.delayBeforeEnd < 0 || bid.delayBeforeEnd > auction.timeout || (bidder && bid.bidder !== bidder) || !bid.isBetween(timeSelection.dateMin, timeSelection.dateMax))
                                continue;
                            if (!bidTime[bid.delayBeforeEnd]) {
                                bidTime[bid.delayBeforeEnd] = 1;
                            }
                            else {
                                bidTime[bid.delayBeforeEnd]++;
                            }
                        }
                        for (i in bidTime) {
                            highchartPoint = chart.get(i);
                            if (highchartPoint) {
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
                    $scope.$watch('bidder', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                            bidder = newVal;
                            highCharts.destroy();
                            highCharts = new Highcharts.Chart(graphOptions);
                            highCharts.addSeries(buildSerie(auction, bidder, timeSelection), true);
                            highCharts.setTitle({
                                text: 'Bids time for ' + (auction.item.name || auction.getId().toString()) + ' for ' + ((bidder) ? bidder.getId() : 'everyone')
                            });
                        }
                    });
                    $scope.$watch('timeSelection', function (newVal, oldVal) {
                        if (newVal && newVal !== oldVal) {
                            timeSelection = newVal;
                            highCharts.destroy();
                            highCharts = new Highcharts.Chart(graphOptions);
                            highCharts.addSeries(buildSerie(auction, bidder, timeSelection), true);
                        }
                    }, true);
                    $scope.$watch(function () {
                        return auction.getNumberBids();
                    }, function (newVal, oldVal) {
                        if (newVal && newVal !== oldVal) {
                            if (auction.hasNewBidTimeSinceFor(graphBidTime, bidder, timeSelection.dateMin, timeSelection.dateMax)) {
                                highCharts.destroy();
                                highCharts = new Highcharts.Chart(graphOptions);
                                highCharts.addSeries(buildSerie(auction, bidder, timeSelection), true);
                            }
                            else {
                                updateSerie(auction, bidder, timeSelection, highCharts);
                            }
                        }
                    });
                    $scope.$watch('auction', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
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
        directives.BidInfoDirective = BidInfoDirective;
        Madbid.registerDirective('bidInfo', BidInfoDirective);
    })(directives = Madbid.directives || (Madbid.directives = {}));
})(Madbid || (Madbid = {}));
//# sourceMappingURL=BidInfoDirective.js.map