var loader = require('../loader');
global.userSignInPath = '/api/user/signin';


var data = [
    { route:"/api/user/signin", store:"userSignin.json" },
];

data.forEach((entry) => {
    loader.LoadStore(entry);
});