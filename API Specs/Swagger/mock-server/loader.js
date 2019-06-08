var fs = require('fs');
var path = require('path');

var storeDir = "./store/";
var Resource = global.Resource;
var normalizedPath = path.join(__dirname, storeDir);

global.storeData = [];

exports.LoadStore = function(mockEntry)
{
    var store = require(normalizedPath + mockEntry.store);

    global.storeData.push({
        key: mockEntry.route,
        value: store
    });
    
    if (Array.isArray(store)) {
        var data = [];
        store.forEach((value, index) => {
            var collectionPath = mockEntry.route;
            if (mockEntry.route === '/security/login') {
                collectionPath = '/api' + mockEntry.route;
            }
            data.push({
                    collection: collectionPath,
                    name: index,
                    data: value
                });
        });
        var resource = Resource.parse(data);
    } else {
        var resource = new Resource(mockEntry.route, store);
    }

    global.data.push(resource);
};
