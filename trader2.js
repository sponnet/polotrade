require('dotenv').config();
var Poloniex = require('poloniex.js');
var poloniex = new Poloniex(process.env.API_KEY, process.env.API_SECRET);


var saldoBTC = 100;
var saldoETH = 0;
var wisselkoers = 0;


var pctchange = 0;

function updatepctchange(newpct) {
	console.log('pctchange: newpct=', newpct);
	if (pctchange === 0) {
		pctchange = newpct;
	} else {
		pctchange = (pctchange + newpct) / 2;
	}
	console.log('pctchange updated to', pctchange);
}

printPortemonee();
getTicker();
setInterval(function() {
	getTicker();
}, 2 * 1000);

function buy(price, amount) {
	console.log('buying ', amount / price, 'ETH for', price, 'BTC');
	saldoBTC -= amount;
	saldoETH += amount / price;
}

function sell(price, amount) {
	console.log('selling ', amount / price, 'ETH for', price, 'BTC');
	saldoBTC += amount;
	saldoETH -= amount / price;
}



function printPortemonee() {
	console.log('ik heb nu BTC', saldoBTC);
	console.log('ik heb nu ETH', saldoETH);
	console.log('totaal BTC = ', saldoBTC + saldoETH * wisselkoers);

}

function getTicker() {
	poloniex.getTicker(function(err, data) {
		if (err) {
			// handle error
		}

		console.log(data.BTC_ETH);
		wisselkoers = parseFloat(data.BTC_ETH.last);
		updatepctchange(parseFloat(data.BTC_ETH.percentChange));

		var koop;
		var verkoop;
		if (pctchange > 0) {
			koop = saldoBTC * pctchange / 2;
		} else {
			koop = 0;
		}
		if (pctchange < 0) {
			verkoop = saldoETH * pctchange / 2;
		}else{
			verkoop=0;
		}

		console.log('---');
		console.log('pctchange=', pctchange);
		console.log('koop=', koop);

		if (koop !== 0 && saldoBTC > koop) {
			buy(wisselkoers, koop);
		}
		if (verkoop !== 0 && saldoETH/wisselkoers > verkoop) {
			sell(wisselkoers, verkoop/wisselkoers);
		}

		printPortemonee();


	});
}



function getTrades() {
	poloniex.getTradeHistory('BTC', 'ETH', function(err, data) {
		if (err) {
			// handle error
		}

		console.log(data);
	});

}