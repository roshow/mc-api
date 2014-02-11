/** 
 * file: mcApi-browser.js
 * author: Rolando Garcia
 * twitter: @roshow
 * description: A library for making requests to the Marvel Comics API (http://developer.marvel.com) from a frontend project. Made by me for PERSONAL fun and use. In other words, this is not an official nor an endorsed Marvel product.
 * 
 */

var mcApi = (function(){

    /** Method to check for Array type in IE8+ - thank you @jaimiedaly! **/
    _isArray = Array.isArray || function(arr) {
        return Object.prototype.toString.call(arr) == '[object Array]'
    };

    /** XMLHTTPREQUEST METHODS AND HELPERS **/
    function Xhr(url){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "json";
        xhr.complete = function(func){
            xhr.onloadend = function(){
                var error = (this.status === 200) ? false : this.status;
                func.call(this, error, this.response, this);
            }
            return this;
        }
        xhr.send();
        return xhr;
    }
    function makeQuerystring(params){
        var qs = "?";
        for (key in params){
            qs += encodeURIComponent(key) + "=" + encodeURIComponent(_isArray(params[key]) ? 
                params[key].join() : params[key]) + "&";
        }
        return qs;
    }
    
    var gateway,
        apikey,
        collections = ["comics", "characters", "series", "events", "creators", "stories"];

    function qsWithKeyAndDefaults(params, defaults){
        params = (typeof params === "object" && !_isArray(params)) ? params : {};
        for (key in defaults){
            if(!params[key]) params[key] = defaults[key];
        }
        return makeQuerystring(params) + "apikey=" + encodeURIComponent(apikey);
    }

    function CollectionApi(collection){

        var defaultParams = {};

        function get(params){
            var url = gateway + collection;
            url += ((typeof params === "string" || typeof params  === "number") ? 
                ("/" + params) : "") + qsWithKeyAndDefaults(params, defaultParams);
            return new Xhr(url);
        }

        function getSubsetFor(id, subset, params){
            var url = gateway + collection + "/" + id + "/" + subset + qsWithKeyAndDefaults(params, defaultParams);
            return new Xhr(url);
        }

        function getRandom(){
            var deferred = function(){};
            function complete(func){
                deferred = func;
            }
            var url = gateway + collection + qsWithKeyAndDefaults();
            var call = new Xhr(url).complete(function(e, r, xhr){
                var max = r.data.total,
                    rand = Math.floor(Math.random()*(max-1));
                    get({offset: rand, limit: 1}).complete(function(e,r,xhr){
                        deferred(e,r,xhr);
                    })
            });
            return { complete: complete };
        }

        function setParams(params){
            for (key in params){
                defaultParams[key] = params[key];
            }
            return this;
        }

        return {
            get: get,
            getSubsetFor: getSubsetFor,
            getRandom: getRandom,
            setParams: function(params){
                setParams(params);
                return this;
            }
        };
    }

    function setPublicKey(key){
        apikey = (typeof key === "string") ? key : null;
        return this;
    }

    function init(key){
        setPublicKey(key);
        gateway = "http://gateway.marvel.com/v1/public/";        
        var mcapi = {
            setPublicKey: function(key){
                setPublicKey(key);
                return this;
            }
        };
        for (var i = 0; i < collections.length; i++){
            mcapi[collections[i]] = new CollectionApi(collections[i]);
        }
        return mcapi;
    }
    return init();
}());

