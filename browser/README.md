#mcApi-browser.js 

A library for making requests to the [Marvel Comics API](http://developer.marvel.com) from a frontend project. Made by me for PERSONAL fun and use. In other words, this is not an official nor an endorsed Marvel product.

##Getting Started
Load ```mcApi-browser.js``` like any other script.
    
    <script type="text/javascript" src="path/to/your/libs/mcApi-browser.js"></script>

This will create a ```mcApi``` object and you're good to go.

##mcApi Methods

###.setPublicKey(key)
>**key** (type: String) Your api _public_ key

Sets the api public key. You must set a key to make successful calls. Returns the mcApi object.

####Example:

    mcApi.setPublicKey("myUncannyPublicKey");

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

Get a collection with the optional parameters passed in the querystring. Returns the mcApi XMLHttpRequest object with ```.complete()``` method for constructing callbacks.

####Example 1:
    mcApi.characters.get().complete(function(error, response, xhr){
        console.log('/characters');
        if (!error){
            console.log(response);
        }
    });

####Example 2:
    mcApi.comics.get({
        limit: 100
    }).complete(function(error, response, xhr){
        console.log('/comics?limit=100');
        if (!error){
            console.log(response);
        }
    });

###.collection.get(id)
>**id** (type: String or number) The id of an item in the collection

Get a single item from the collection, by id. Returns the mcApi XMLHttpRequest object with ```.complete()``` method for constructing callbacks.

####Example:
    mcApi.characters.get(1009610).complete(function(error, response, xhr){
        console.log('/characters/100960');
        if (!error){
            console.log(response);
        }
    });

###.collection.getSubsetOf(id,subset[,parameters])
 >**id** (type: String or number) The id of an item in the collection
 
 >**subset** (type: String) The name of the subcollection
 
 >**parameters** (type: PlainObject) A set of key/value parameters for the call (_optional_).

Get subcollection for a single item by optional parameters. Returns the mcApi XMLHttpRequest object with ```.complete()``` method for constructing callbacks.

####Example:
    mcApi.creators.getSubsetFor(196, "series").complete(function(error, response, xhr){
        console.log('/creators/196/series');
        if (!error){
            console.log(response);
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

##mcApi XMLHttpRequest Object
All GET requests made with the mcApi collection methods return a standard XMLHttpRequest object with an additional ```.complete()``` method for constructing callbacks. 

###xhr.complete(function(error, response, xhr){})
>**error** (type: String) Error code.

>**response** (type: JSON) Response body from Marvel Comics Api.

>**xhr** (type: XMLHttpRequest Object)

I opted to call this method ```complete``` for parity with the deferred methods returned when using ```$.ajax```. It takes a callback function and can be chained to your initial GET request method.

####Example:
    mcApi.characters.get().complete(function(error, response, xhr){
        console.log('/characters');
        if (!error){
            console.log(response);
        }
    });

Because you are receiving an XMLHttpRequest object when making requests with ```mcApi``` you can also create callbacks in the more traditional manner.

####Example:
    var chars = mcApi.characters.get();
    chars.onerror = function(){
        console.log(this.status);
    }
    chars.onload = function(){
        console.log(this.response);
    }
    chars.onloadend = function(){
        console.log('/characters complete');
    }); 



 