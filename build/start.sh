#!/usr/bin/env sh

set -e

VERDACCIO=./node_modules/.bin/verdaccio

if [ -z "${RUN_IN_DOCKER}" ]; then
	cd build
	export STORAGE=`pwd`/../storage
	VERDACCIO=".${VERDACCIO}"
fi

echo "create config files" >&2
node 'create-config.js'
NPM_PRIVATE_SCOPE=$(cat private_name.txt)

echo "run verdaccio on port 8888 at background" >&2
"${VERDACCIO}" --config "./npm/config.yaml" --listen '0.0.0.0:8888' &

sleep 4

if ! ps | grep -q verdaccio; then
	echo "verdaccio can not start" >&2
	exit 1
fi

echo "remove npm package.json cache:"
rm -rf /tmp/npm-registry-package-cache
mkdir -p /tmp/npm-registry-package-cache

chmod a+x /data/scripts/* || true




PORT=35858
if [ -n "${RUN_IN_DOCKER}" ]; then
	PORT=80
fi
echo "run nginx proxy on port ${PORT} in frontend." >&2
echo "" >&2
echo "==================================================" >&2
echo "  to clear cache on package.json files, run:" >&2
echo "         docker exec npm-registry reload" >&2
echo "  to clear everything other than @${NPM_PRIVATE_SCOPE}, run:" >&2
echo "         docker exec npm-registry reset" >&2
echo "  to update cache at one package (nginx cache only), run:" >&2
echo "         docker exec npm-registry update package-name" >&2
echo "==================================================" >&2
exec /usr/sbin/nginx -c `pwd`/nginx/nginx.conf -g 'daemon off;'
