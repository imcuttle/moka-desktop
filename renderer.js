// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {remote} = require('electron')
const fs = require('fs')
const path = require('path')
const utils = require('./api/utils')
const {Menu, MenuItem, dialog} = remote

const menu = new Menu()
menu.append(new MenuItem({label: 'Refresh', click() { 
	window.location.reload()
 }}))

const filemenu = new Menu()
filemenu.append(new MenuItem({label: 'Delete', click() { 
	if(window.activeFile) {
		var xpath = window.activeFile.getAttribute('jstree-key')
		if(0===dialog.showMessageBox({type: 'question', message: `是否删除${path.basename(xpath)}?`, buttons: ['确定', '取消']})) {
			fs.unlinkSync(xpath);
			window.activeFile.remove()
		}
	}
 }}))

const dirmenu = new Menu()
dirmenu.append(new MenuItem({label: 'Reveal', click() { 
	if(window.activeFile) {
		var xpath = window.activeFile.getAttribute('jstree-key')
		const {shell} = require('electron')
		shell.showItemInFolder(xpath)
	}
 }}))
dirmenu.append(new MenuItem({label: 'Delete', click() { 
	if(window.activeFile) {
		var xpath = window.activeFile.getAttribute('jstree-key')
		if(0===dialog.showMessageBox({type: 'question', message: `是否删除${path.basename(xpath)}文件夹?`, buttons: ['确定', '取消']})) {
			fs.rmdirSync(xpath);
			window.activeFile.remove()
		}
	}
 }}))

// menu.append(new MenuItem({label: 'abc', click() { 
// 	console.log(require('./api/shell').getProcesses())
//  }}))
// menu.append(new MenuItem({type: 'separator'}))
// menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}))

window.addEventListener('contextmenu', (e) => {
	var item;
	e.preventDefault();
	if(e.target.classList.contains('jstree-witem')){
		item = e.target.parentElement;
	}
	if(e.target.classList.contains('jstree-text')) {
		item = e.target.parentElement.parentElement;
	}
	if(item) {
		if(item.classList.contains('file')) {
			window.activeFile = item;
			filemenu.popup(remote.getCurrentWindow())
		} else {
			window.activeFile = item;
			dirmenu.popup(remote.getCurrentWindow())
		}
		e.stopPropagation()
		e.preventDefault()
		return;
	}
  	// menu.popup(remote.getCurrentWindow())
}, true)




require('./views/AppIndex')


