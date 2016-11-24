import {MicroBuildConfig, ELabelNames} from "./x/microbuild-config";
import {JsonEnv} from "../.jsonenv/_current_result.json.d.ts";
declare const build: MicroBuildConfig;
/*
 +==================================+
 | <**DON'T EDIT ABOVE THIS LINE**> |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'npm-registry';

build.baseImage('node');
build.projectName(projectName);
build.domainName(projectName + '.' + JsonEnv.baseDomainName);
build.install('./package.json');

build.forwardPort(80, 'tcp').publish(19991);

build.startupCommand('./node_modules/.bin/sinopia', '--config', './config/config.yaml', '--listen', '0.0.0.0:80');
build.shellCommand('node');
// build.stopCommand('stop.sh');

// build.buildArgument('SOME_ARG', defaultValue);

build.label('microbuild', 'yes');

build.nsgLabel(ELabelNames.alias, ['npm.registry.' + JsonEnv.baseDomainName]);

build.dependService('nginx-service-generator', 'http://github.com/GongT/nginx-microservice-generator.git')

build.volume('./storage', '/data/storage');
build.volume('./config/htfile', '/data/config/htfile');

build.appendDockerFile('config/create-config.Dockerfile');

JsonEnv.gfw.npmRegistry.user = '';
JsonEnv.gfw.npmRegistry.url = JsonEnv.gfw.npmRegistry.upstream;
