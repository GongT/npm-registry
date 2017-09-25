#!/usr/bin/env bash

if [ ! -e "build/private_name.txt" ]; then
	exit "never run, can not clear"
fi

NPM_PRIVATE_SCOPE=$(cat build/private_name.txt)

echo "removing 'storage' folder without remove @${NPM_PRIVATE_SCOPE}"

cd storage
find . -maxdepth 1 -type d \
	! -name "@${NPM_PRIVATE_SCOPE}" \
	! -name . | xargs rm -rf
