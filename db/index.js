var fs = require('fs');


// let db = require('./db.json') || {}
let db = window.localStorage;

module.exports = {
	set(key, val) {
		db[key] = val;
	},
	get(key) {
		return db[key]
	}
}