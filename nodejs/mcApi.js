/** 
 * file: mcApi.js
 * author: Rolando Garcia
 * twitter: @roshow
 * description: A library for making requests to the Marvel Comics API (http://developer.marvel.com) from Node.js. Made by me for PERSONAL fun and use. In other words, this is not an official nor an endorsed Marvel product.
 * 
 */

var request = require("request"),
    Deferred = require("promised-io/promise").Deferred,
    crypto = require("crypto"),
    publicKey,
    privateKey,
    gateway = "http://gateway.marvel.com/v1/public/",
    collections = ["comics", "characters", "series", "events", "creators", "stories"];

function setKeys(public, private){
    publicKey = public;
    privateKey = private;
    return this;
}

function _makeCredentials(keyObj){
    keyObj = (typeof keyObj !== "object" || Array.isArray(keyObj)) ? {} : keyObj;
    keyObj.apikey = publicKey;
    keyObj.ts = new Date().getTime();
    keyObj.hash = crypto.createHash("md5").update(keyObj.ts + privateKey + publicKey).digest("hex");
    return keyObj;
}


function _makeHashAndQuery(defaultParams, params){
    var query = _makeCredentials(params);
    for (key in defaultParams){
        if(!query[key]) query[key] = defaultParams[key];
    }
    return query;
}

function CollectionApi(collection){

    var defaults = {};

    function get(params){
        var url = gateway + collection,
            deferred = new Deferred();
        if (typeof params === "string" || typeof params  === "number"){
            url += ("/" + params);
        }
        request({
            url: url,
            qs: _makeHashAndQuery(defaults, params),
            json: true
        }, function(error, response, body){
            deferred.resolve(response);
        });
        return deferred;
    }

    function getSubsetFor(id, subset, params){
        var deferred = new Deferred();
        request({
            url: gateway + collection + "/" + id + "/" + subset,
            qs: _makeHashAndQuery(defaults, params),
            json: true
        }, function(error, response, body){
            deferred.resolve(response);
        });
        return deferred;
    }

    function setParams(params){
        for (key in params){
            defaults[key] = params[key];
        }
    }

    return {
        get: get,
        getSubsetFor: getSubsetFor,
        setParams: function(params){
            setParams(params);
            return this;
        }
    };
}

function init(){      
    var mcApi = {
        setKeys: function(public, private){
            setKeys(public, private);
            return this;
        }
    };
    for (var i = 0; i < collections.length; i++){
        mcApi[collections[i]] = new CollectionApi(collections[i]);
    }
    return mcApi;
}

module.exports = init();