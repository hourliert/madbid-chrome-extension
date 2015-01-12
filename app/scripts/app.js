/**
 * Created by thomashourlier on 12/01/15.
 */

'use strict';

var app = angular.module('madbid', [
  'madbid.controller',
  'madbid.service',
  'madbid.model',
  'madbid.directive'
]);

angular.module('madbid.controller', []);
angular.module('madbid.service', []);
angular.module('madbid.model', []);
angular.module('madbid.directive', []);

app.run(angular.noop);