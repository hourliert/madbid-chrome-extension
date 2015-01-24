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

angularModules.forEach((m) => angular.module(m, []));
angular.module('madbid', angularModules.concat([
    'angularLocalStorage',
    'ngMaterial',
    'ngMessages'
]));

module Madbid {
    export module controllers {}
    export module directives {}
    export module filters {}
    export module models {}
    export module services {}

    export interface ITimeSelection{
        dateMin?: Date;
        dateMax?: Date;
    }
    export interface Function{
        $inject?: Array<string>;
    }

    export function registerController (controllerName: string, controller: any) {
        angular.module('madbid.controllers').controller(controllerName, controller);
    }
    export function registerDirective (directiveName: string, directive: any) {
        angular.module('madbid.directives').directive(directiveName, directive);
    }
    export function registerFilter (filterName: string, filter: any) {
        angular.module('madbid.filters').filter(filterName, filter);
    }
    export function registerService (serviceName: string, service: any) {
        angular.module('madbid.services').service(serviceName, service);
    }
    export function registerModel (modelName: string, model: any) {
        angular.module('madbid.models').service(modelName, model);
    }
}