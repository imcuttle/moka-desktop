# Moka-Desktop


scripts in `package.json`

```js
"scripts": {
    "build": "NODE_ENV=production webpack --mini", // useless
    "package": "rm -rf Moka-Desktop-darwin-x64 && electron-packager . --platform darwin --icon build/icon.icns --overwrite --prune",  // package electron app by electron-packager
    "p": "rm -rf Moka-Desktop-darwin-x64 && NODE_ENV=production node package.js", // package electron app by electron-packager
    "start": "electron .",  // start app
    "dev": "babel srcViews -d views -w",  // srcViews(react) transform
    "pack": "build --dir", 
    "dist": "ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron build -m --x64 --ia32" // package electron app by electron-builder
},
```

[Change Logs](CHANGELOG.md)

#### License [CC0 1.0 (Public Domain)](LICENSE.md)
