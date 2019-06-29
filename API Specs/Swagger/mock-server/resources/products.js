var loader = require('../loader');
global.getAllProductsPath = '/api/products/getAll';


var data = [
    { route: '/api/products/getAll', store:"products.json" },
];

data.forEach((entry) => {
    loader.LoadStore(entry);
});
