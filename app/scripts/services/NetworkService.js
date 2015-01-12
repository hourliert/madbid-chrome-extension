/**
 * Created by thomashourlier on 12/01/15.
 */

var deferred;

angular.module('madbid.service')
.factory('NetworkService', ['$q', function($q){
    var listeners = [],
        listener = function(content){
          var json,
              i,
              ii;

          try {
            json = JSON.parse(content);

            for (i = 0, ii = listeners.length ; i < ii ; i++){
              listeners[i](json);
            }
          } catch(e){
          }
        };

    chrome.devtools.network.onRequestFinished.addListener(
      function(res){
        res.getContent(listener);
      }
    );

    return {
      addListener : function(listener){
        listeners.push(listener);
      }
      //no public services ?
    };
  }]);
