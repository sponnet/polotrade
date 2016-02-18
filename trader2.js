var Poloniex = require('poloniex.js');
var poloniex = new Poloniex('API_KEY', 'API_SECRET');
poloniex.getTicker(function(err, data){
    if (err){
        // handle error
    }

    console.log(data);
});
