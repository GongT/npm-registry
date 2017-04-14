#!/usr/bin/env sh

set -e
set -x

VERDACCIO=./node_modules/.bin/verdaccio

if [ -z "${RUN_IN_DOCKER}" ]; then
	cd build
	export STORAGE=`pwd`/storage
	node 'create-config.js'
	VERDACCIO=".${VERDACCIO}"
fi

"${VERDACCIO}" --config "./npm/config.yaml" --listen '0.0.0.0:8888' &

sleep 3

if ! ps | grep -q verdaccio; then
	echo "verdaccio can not start" >&2
	exit 1
fi

exec /usr/sbin/nginx -c `pwd`/nginx/nginx.conf -g 'daemon off;'
