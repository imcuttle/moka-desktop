#!/usr/bin/env node
var Path = require('path');
var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2))

var startServer = require('./index');


const imagePath = Path.resolve(((!argv._||argv._.length==0) && '.' || argv._[0]), 'upload')
!fs.existsSync(imagePath) && fs.mkdirSync(imagePath);

startServer(argv.p, imagePath);

