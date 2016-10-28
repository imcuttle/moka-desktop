var fs = require('fs')
var path = require('path')


var getDirChildren = function (dirname) {
	var lists = fs.readdirSync(dirname);
	return lists.filter(x=>!x.startsWith('.')).map(x=>
		Object.assign(fs.statSync(path.join(dirname, x)),{name: x})
	)
}


module.exports = {
	getDirChildren
}