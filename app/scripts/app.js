/**
 * Created by thomashourlier on 12/01/15.
 */

'use strict';

var app = angular.module('madbid', [
  'madbid.controller',
  'madbid.service',
  'madbid.model',
  'madbid.directive',
  'madbid.filter',
  'LocalStorageModule'
]);

angular.module('madbid.controller', []);
angular.module('madbid.service', []);
angular.module('madbid.model', []);
angular.module('madbid.directive', []);
angular.module('madbid.filter', []);

app.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('madbid-ia');
}]);

app.run(['localStorageService', 'AuctionModel', function(localStorageService, AuctionModel){
   var db = localStorageService.get('full-cache');
  AuctionModel.setBootData(db);
}]);