/// <reference path="./.jsonenv/_current_result.json.d.ts"/>
import {JsonEnv} from "@gongt/jenv-data";
import {EPlugins, MicroBuildConfig} from "./.micro-build/x/microbuild-config";
import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
/*
 +==================================+
 |  **DON'T EDIT ABOVE THIS LINE**  |
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
build.forceLocalDns(false, true);
// build.npmInstallSource(JsonEnv.gfw.npmRegistry.upstream);
// build.npmCacheLayer(JsonEnv.gfw.npmRegistry);
build.npmInstall('./package.json');
build.systemInstall('nginx', 'curl');

build.forwardPort(80, 'tcp');

build.shellCommand('sh');
build.environmentVariable('STORAGE', '/data/storage', true);

build.onConfig((isBuild) => {
	if (isBuild) {
		build.startupCommand('./start.sh');
	} else {
		build.startupCommand('./build/start.sh');
	}
});

build.label('microbuild', 'yes');

build.specialLabel(ELabelNames.alias, []);
build.addPlugin(EPlugins.jenv);

build.volume('./storage', '/data/storage');

build.noDataCopy();

build.prependDockerFileContent('COPY build /data');
