#!/usr/bin/env sh

set -e
set -x

VERDACCIO=./node_modules/.bin/verdaccio

if [ -z "${RUN_IN_DOCKER}" ]; then
	cd build
	node 'create-config.js'
	VERDACCIO=".${VERDACCIO}"
fi

"${VERDACCIO}" --config "./npm/config.yaml" --listen '0.0.0.0:8888' &

sleep 2
if [ "$(jobs | wc)" -eq 0 ]; then
	echo "verdaccio can not start" >&2
	exit 1
fi

exec /usr/sbin/nginx -c `pwd`/nginx/nginx.conf -g 'daemon off;'
