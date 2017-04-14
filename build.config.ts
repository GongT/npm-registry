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

build.isInChina(JsonEnv.gfw.isInChina, JsonEnv.gfw);
build.forceLocalDns();
// build.npmInstallSource(JsonEnv.gfw.npmRegistry.upstream);
build.npmCacheLayer(JsonEnv.gfw.npmRegistry);
build.npmInstall('./package.json');
build.systemInstall('nginx');

build.forwardPort(80, 'tcp');

build.shellCommand('sh');
build.startupCommand('./start.sh');
build.onConfig((isBuild) => {
	if (!isBuild) {
		build.startupCommand('./build/start.sh');
	}
});

build.label('microbuild', 'yes');

build.specialLabel(ELabelNames.alias, []);
build.addPlugin(EPlugins.jenv);

build.volume('./storage', '/data/storage');

build.noDataCopy();

build.prependDockerFileContent('COPY build /data');
build.appendDockerFileContent('RUN node create-config.js');
