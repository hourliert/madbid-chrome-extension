/**
 * Created by thomashourlier on 12/01/15.
 */

/// <reference path='../_all.ts' />

module Madbid{
    export class NetworkService{
        public static $inject = ['$q'];

        private listeners: Array<Function>;

        constructor(
            private $q: ng.IQService
        ){
            this.listeners = [];

            var This: NetworkService = this;
            chrome.devtools.network.onRequestFinished.addListener(
                function(res: chrome.devtools.network.Request){
                    res.getContent(function(data){
                        This.receiveData(data)
                    });
                }
            );
        }

        private receiveData(data: string){
            var json: any,
                i: number,
                ii: number;

            try {
                json = JSON.parse(data);

                for (i = 0, ii = this.listeners.length ; i < ii ; i++){
                    this.listeners[i](json || {});
                }
            } catch(e){
            }
        }

        public addListener(f: Function){
            this.listeners.push(f);
        }
    }
    angular.module('madbid.service').service('NetworkService', NetworkService);
}
