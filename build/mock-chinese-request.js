require('@gongt/jenv-data/global');

function attachProxy() {
	const https = require('https');
	const http = require('http');
	
	console.log('will add http & https (proxy) agent:');
	
	// must before require https-proxy-agent
	const oldHttpsRequest = https.request;
	https.request = (opt, cb) => {
		opt.agent = httpsAgent;
		return oldHttpsRequest(opt, cb);
	};
	const MyClientRequest = https.ClientRequest;
	http.ClientRequest = function (opt, cb) {
		opt.agent = httpAgent;
		return MyClientRequest.call(this, opt, cb);
	};
	// monkey patch end
	
	// https
	const HttpsProxyAgent = require('https-proxy-agent');
	const httpsAgent = new HttpsProxyAgent(JsonEnv.gfw.proxy);
	// wait node core patch: require('https').globalAgent = httpsAgent;
	
	// http
	const HttpProxyAgent = require('http-proxy-agent');
	const httpAgent = new HttpProxyAgent(JsonEnv.gfw.proxy);
	// wait node core patch: require('http').globalAgent = httpAgent;
	
	console.log('    http & https (proxy) agent = ', JsonEnv.gfw.proxy);
}

// run normal main file (ts-app-loader)
if (JsonEnv.gfw.isInChina) {
	attachProxy();
}
runMain();

function runMain() {
	const appPackage = require.resolve('verdaccio/package.json');
	const main = require('path').resolve(appPackage, '..', require(appPackage).bin.verdaccio);
	require(main);
}
