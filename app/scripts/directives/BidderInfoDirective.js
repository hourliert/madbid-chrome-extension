/**
 * Created by thomashourlier on 12/01/15.
 */
/// <reference path='../_all.ts' />
'use strict';
var Madbid;
(function (Madbid) {
    var directives;
    (function (directives) {
        function BidderInfoDirective() {
            return {
                restrict: 'E',
                require: '^ngModel',
                scope: {
                    ngModel: '=',
                    auction: '=',
                    timeSelection: '=',
                    observeBidderSelection: '&'
                },
                link: function ($scope, $element, $attrs) {
                    var ah = $scope.ngModel, auction = $scope.auction, timeSelection = $scope.timeSelection, container, graphOptions = {
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
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
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
                                    click: function (e) {
                                        $scope.observeBidderSelection({
                                            bidderName: e.point.name
                                        });
                                    }
                                }
                            }
                        },
                        series: []
                    }, highCharts, bidderBidsNumberMap = {}, graphBidderIndexes = {}, graphBidder = {};
                    function buildSerie(auction, timeSelection) {
                        var i, bidder, nbBids, newLength, serie = {
                            name: 'Bids',
                            data: [],
                            color: 'rgba(119,152,191,0.9)'
                        };
                        graphBidderIndexes = {};
                        graphBidder = {};
                        bidderBidsNumberMap = {};
                        for (i in ah.bidders) {
                            bidder = ah.bidders[i];
                            if (!bidder.hasBidOn(auction) || !(nbBids = bidder.getNumberBidsOn(auction, timeSelection.dateMin, timeSelection.dateMax)))
                                continue;
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
                    function updateSerie(auction, timeSelection, chart) {
                        var i, nbBids, highchartPoint, bidder;
                        for (i in ah.bidders) {
                            bidder = ah.bidders[i];
                            if (!bidder.hasBidOn(auction) || !(nbBids = bidder.getNumberBidsOn(auction, timeSelection.dateMin, timeSelection.dateMax)))
                                continue;
                            if (nbBids !== bidderBidsNumberMap[bidder.getId()]) {
                                highchartPoint = chart.get(bidder.getId());
                                if (highchartPoint) {
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
                    $scope.$watch('timeSelection', function (newVal, oldVal) {
                        if (newVal && newVal !== oldVal) {
                            timeSelection = newVal;
                            highCharts.destroy();
                            highCharts = new Highcharts.Chart(graphOptions);
                            highCharts.addSeries(buildSerie(auction, timeSelection), true);
                        }
                    }, true);
                    $scope.$watch(function () {
                        return auction.getNumberBids();
                    }, function (newVal, oldVal) {
                        if (newVal && newVal !== oldVal) {
                            if (auction.hasNewBidderOnSince(graphBidder, auction, timeSelection.dateMin, timeSelection.dateMax)) {
                                highCharts.destroy();
                                highCharts = new Highcharts.Chart(graphOptions);
                                highCharts.addSeries(buildSerie(auction, timeSelection), true);
                            }
                            else {
                                updateSerie(auction, timeSelection, highCharts);
                            }
                        }
                    });
                    $scope.$watch('auction', function (newVal, oldVal) {
                        if (newVal && newVal !== oldVal) {
                            auction = newVal;
                            highCharts.destroy();
                            highCharts = new Highcharts.Chart(graphOptions);
                            highCharts.addSeries(buildSerie(auction, timeSelection), true);
                        }
                    });
                }
            };
        }
        directives.BidderInfoDirective = BidderInfoDirective;
        Madbid.registerDirective('bidderInfo', BidderInfoDirective);
    })(directives = Madbid.directives || (Madbid.directives = {}));
})(Madbid || (Madbid = {}));
//# sourceMappingURL=BidderInfoDirective.js.map