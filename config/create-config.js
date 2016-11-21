require('json-env-data/global');
const fs = require('fs');

const url = JsonEnv.gfw.npmRegistry.upstream;

process.chdir(__dirname);

let content = fs.readFileSync('./config-template.yaml', 'utf-8');

content = content.replace(/\$\{NPM_JS_UPSTREAM_URL}/g, url);

fs.writeFileSync('./config.yaml', content, 'utf-8');



