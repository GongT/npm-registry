require('@gongt/jenv-data/global');
const fs = require('fs');

const url = JsonEnv.gfw.npmRegistry.upstream;

process.chdir(__dirname);

let content = fs.readFileSync('./config-template.yaml', 'utf-8');

content = content.replace(/\$\{NPM_JS_UPSTREAM_URL}/g, url);
content = content.replace(/\$\{NPM_PRIVATE_USER}/g, JsonEnv.gfw.npmRegistry.user);
content = content.replace(/\$\{NPM_PRIVATE_SCOPE}/g, JsonEnv.gfw.npmRegistry.scope);

fs.writeFileSync('./config.yaml', content, 'utf-8');



