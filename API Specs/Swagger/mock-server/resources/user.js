var loader = require('../loader');
global.userPath = '/api/user';


var data = [
    { route:"/api/user", store:"user.json" },
];

data.forEach((entry) => {
    loader.LoadStore(entry);
});