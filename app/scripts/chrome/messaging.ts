/**
 * Created by thomashourlier on 23/01/15.
 */
/// <reference path='../_all.ts' />


module Madbid {
   export class Messaging{
       private listeners: Array<(d: any) => void>;
       private port: chrome.runtime.Port;

       constructor(){
           var This = this;

           this.listeners = [];
           this.port = chrome.runtime.connect({name: 'madbid'});

           this.port.onMessage.addListener(function(msg) {
               var i:any;

               for (i in This.listeners){
                   This.listeners[i](msg);
               }
           });
       }

       public addListener(l: (d: any) => void){
           this.listeners.push(l);
       }
       public sendMessage(msg: any){
           this.port.postMessage(msg);
       }
   }
}
