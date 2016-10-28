var packager = require('electron-packager')
var path = require('path')

var config = {
	dir: __dirname,
	platform: 'darwin',
	prune: true,
	icon: path.join(__dirname, 'build', 'icon.icns'),
	overwrite: true,
	ignore: [
		/node_modules\/\.bin/, /srcViews/, /\.git/,
		/node_modules\/electron/,
		/node_modules\/electron-prebuilt/,
		/node_modules\/electron-packager/,
		/node_modules\/babel-/,
		/node_modules\/moyu-markdown/,
		/node_modules\/asar/,
		/node_modules\/webpack-target-electron-renderer/,
		/Moka-Desktop-/,
		/^\./, /.*\.(o|obj)$/,
	]
}

if(process.env.PACK) {
	// delete config.platform
	config.platform = process.env.PACK
	if(process.env.PACK==='win32'){
		config.icon = path.join(__dirname, 'build', 'icon.ico')
	}
}

packager(config, function done_callback (err, appPaths) { 
	if(err) {
		console.error(err)
	} else {
		console.info(appPaths);
	}
 })
