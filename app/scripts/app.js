/**
 * Created by thomashourlier on 12/01/15.
 */
/// <reference path='_all.ts' />
'use strict';
var angularModules = [
    'madbid.controllers',
    'madbid.services',
    'madbid.models',
    'madbid.directives',
    'madbid.filters'
];
angularModules.forEach(function (m) { return angular.module(m, []); });
angular.module('madbid', angularModules.concat([
    'angularLocalStorage',
    'ngMaterial',
    'ngMessages'
]));
var Madbid;
(function (Madbid) {
    function registerController(controllerName, controller) {
        angular.module('madbid.controllers').controller(controllerName, controller);
    }
    Madbid.registerController = registerController;
    function registerDirective(directiveName, directive) {
        angular.module('madbid.directives').directive(directiveName, directive);
    }
    Madbid.registerDirective = registerDirective;
    function registerFilter(filterName, filter) {
        angular.module('madbid.filters').filter(filterName, filter);
    }
    Madbid.registerFilter = registerFilter;
    function registerService(serviceName, service) {
        angular.module('madbid.services').service(serviceName, service);
    }
    Madbid.registerService = registerService;
    function registerModel(modelName, model) {
        angular.module('madbid.models').service(modelName, model);
    }
    Madbid.registerModel = registerModel;
})(Madbid || (Madbid = {}));
//# sourceMappingURL=app.js.map