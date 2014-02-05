#mcApi for Node.js

A library for making requests to the [Marvel Comics API](http://developer.marvel.com) from Node.js. Made by me for PERSONAL fun and use. In other words, this is not an official nor an endorsed Marvel product.

##Getting Started
###Dependencies
+ [request](https://github.com/mikeal/request)
+ [promised-io](https://github.com/kriszyp/promised-io)

To load dependencies run ```npm install``` from the command line
    
    $ npm install -d


Since ```mcApi``` uses promised-io's ```Deferred``` and request's ```response``` objects when handling callbacks, please read their documentation (linked above).

###Loading mcApi library
Load into your node project using require, like any other module. Returns the ```mcApi``` object.
    
    var mcApi = require("./mcApi.js");

##mcApi Methods

###.setKeys(public, private)
>**public** (type: String) Your api _public_ key
>**private** (type: String) Your api _private_ key

Sets the api public and private keys. You must set these key to make successful calls. Returns the mcApi object.

####Example:

    mcApi.setKeys("myUncannyPublicKey", "myFantasticPrivateKey");

##mcApi[collection] & Methods

Each collection provided by the Marvel Comics Api has its own object and methods. Currently supports these collections:

+ characters
+ comics
+ creators
+ events
+ series
+ stories

###.collection.get([parameters])
>**parameters** (type: PlainObject) A set of key/value parameters for the call (_optional_).

Get a collection with the optional parameters passed in the querystring. Returns a promised-io ```Deferred``` object  with the ```deferred.resolve()``` argument set to request's ```reponse``` object.

####Example 1:
    mcApi.characters.get().then(function(response){
        console.log('/characters');
        if (response.statusCode === 200){
            console.log(response.body);
        }
    });

####Example 2:
    mcApi.comics.get({
        limit: 100
    }).then(function(response){
        console.log('/comics?limit=100');
        if (response.statusCode === 200){
            console.log(response.body);
        }
    });

###.collection.get(id)
>**id** (type: String or number) The id of an item in the collection

Get a single item from the collection, by id. Returns a promised-io ```Deferred``` object  with the ```deferred.resolve()``` argument set to request's ```reponse``` object.

####Example:
    mcApi.characters.get(1009610).then(function(response){
        console.log('/characters/100960');
        if (response.statusCode === 200){
            console.log(response.body);
        }
    });

###.collection.getSubsetOf(id,subset[,parameters])
 >**id** (type: String or number) The id of an item in the collection
 
 >**subset** (type: String) The name of the subcollection
 
 >**parameters** (type: PlainObject) A set of key/value parameters for the call (_optional_).

Get subcollection for a single item by optional parameters. Returns a promised-io ```Deferred``` object  with the ```deferred.resolve()``` argument set to request's ```reponse``` object.

####Example:
    mcApi.creators.getSubsetFor(196, "series").then(function(response){
        console.log('/creators/196/series');
        if (response.statusCode === 200){
            console.log(response.body);
        }
    });

###.collection.setParams(parameters)
>**parameters** (type: PlainObject) A set of key/value parameters for the call.

Set default parameters for all calls to this collection.

####Example:
    mcApi.comics.setParams({
        format: "comic",
        hasDigitalIssue: true
    });



 