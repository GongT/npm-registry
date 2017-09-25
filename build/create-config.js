require('@gongt/jenv-data/global');

let content;
const fs = require('fs');
const url = JsonEnv.gfw.npmRegistry.upstream;

// nginx
const NGX_PORT = process.env.RUN_IN_DOCKER? '80' : '35858';
content = fs.readFileSync(__dirname + '/nginx/nginx.template.conf', 'utf-8');

content = content.replace(/\$\{NPM_PRIVATE_SCOPE}/g, JsonEnv.gfw.npmRegistry.scope);
content = content.replace(/\$\{LISTEN_PORT}/g, NGX_PORT);
content = content.replace(/\$\{RANDOM_PORT}/g, process.env.RANDOM_PORT);

fs.writeFileSync(__dirname + '/nginx/nginx.conf', content, 'utf-8');
fs.writeFileSync(__dirname + '/private_name.txt', JsonEnv.gfw.npmRegistry.scope, 'utf-8');

// function escapeRegExp(str) {
// 	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
// }

// npm registry
content = fs.readFileSync(__dirname + '/npm/config-template.yaml', 'utf-8');
const target = module.exports = __dirname + '/npm/config.yaml';

content = content.replace(/\$\{NPM_JS_UPSTREAM_URL}/g, url);
content = content.replace(/\$\{NPM_PRIVATE_USER}/g, JsonEnv.gfw.npmRegistry.user);
content = content.replace(/\$\{NPM_PRIVATE_SCOPE}/g, JsonEnv.gfw.npmRegistry.scope);
content = content.replace(/\$\{STORAGE}/g, process.env.STORAGE);
content = content.replace(/\$\{RANDOM_PORT}/g, process.env.RANDOM_PORT);

let baseUrl = 'http://' + process.env.PROJECT_NAME + '.' + JsonEnv.baseDomainName;
if (!process.env.RUN_IN_DOCKER) {
	baseUrl += ':' + NGX_PORT;
}
console.log('OUTSIDE_URL=' + baseUrl);
content = content.replace(/\$\{OUTSIDE_URL}/g, baseUrl);

fs.writeFileSync(target, content, 'utf-8');
