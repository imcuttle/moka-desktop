#!/bin/sh

# mkdir release
# rsync -rv --exclude release . ./release 
# cd release

# npm uninstall --save-dev
# npm prune --production

if [ -z "$1" ]; then
	echo pack all
	ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/ PACK=all npm run p
else
	echo pack "$1"
	ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/ PACK="$1" npm run p	
fi

