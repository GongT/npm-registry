import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
import {MicroBuildConfig, ELabelNames, EPlugins} from "./.micro-build/x/microbuild-config";
import {JsonEnv} from "./.jsonenv/_current_result";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
/*
 +==================================+
 | <**DON'T EDIT ABOVE THIS LINE**> |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'npm-registry';

build.baseImage('node', 'alpine');
build.projectName(projectName);
build.domainName(projectName + '.' + JsonEnv.baseDomainName);

build.isInChina(JsonEnv.gfw.isInChina);
build.npmInstallSource(JsonEnv.gfw.npmRegistry.upstream);
build.npmInstall('./package.json');

build.forwardPort(80, 'tcp').publish(19991);

build.startupCommand('./node_modules/.bin/verdaccio', '--config', './config/config.yaml', '--listen', '0.0.0.0:80');
build.shellCommand('node');
// build.stopCommand('stop.sh');

// build.buildArgument('SOME_ARG', defaultValue);

build.label('microbuild', 'yes');

build.specialLabel(ELabelNames.alias, []);
build.addPlugin(EPlugins.jenv);

build.dependService('microservice-dnsmasq', 'http://github.com/GongT/microservice-dnsmasq.git');

build.volume('./storage', '/data/storage');
build.volume('./config/htfile', '/data/config/htfile');

build.appendDockerFile('config/create-config.Dockerfile');
