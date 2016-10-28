#!/bin/sh

# mkdir release
# rsync -rv --exclude release . ./release 
# cd release

# npm uninstall --save-dev
# npm prune --production
ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron
if [ -z "$1" ]; then
	echo pack all
	PACK=all npm run p
else
	echo pack "$1"
	PACK="$1" npm run p	
fi

