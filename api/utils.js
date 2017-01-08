const jsTree = require('../fe-js/tree')
const {getDirChildren} = require('./files')
const path = require('path')

const utils = {
	getDirTreeList: (dir, filecb, dircb) => {
		var lists = getDirChildren(dir);
		return lists.map(x=>{
			var fpath = path.join(dir, x.name)
			return {
				text: `${x.name}${x.isDirectory()?'/':''}`,
				key: fpath,
				children: null,
				class: `${x.isFile()?"file":"directory"}`,
				onclick: x.isFile()? function(data) {
					filecb && filecb.call(this, fpath);
				}: function(data) {
					dircb && dircb(fpath);

					if(this.classList.contains('open')) {
						this.classList.remove('open')
						Array.from(this.children).filter(dom=>dom.classList.contains('jstree')).forEach(tree=>{
							this.removeChild(tree);
						})
						return;
					}
					var nodes = new jsTree(utils.getDirTreeList(fpath, filecb, dircb))
					if(nodes.children.length!==0) {
						this.appendChild(nodes)
						this.classList.toggle('open')
					}
				}
			}
		})
	},
	getFileMimeType(filename) {
		var ext = path.extname(filename)
		ext = ext.substr(1)
		switch(ext) {
			case 'js': return 'javascript'
			case 'md':
			case 'text': 
			 return 'markdown'
		}
		return ext;
	},
	logs: (data) => {
		var p = document.createElement('p');
		p.innerText = `> ${data}`;
		var logs = document.querySelector('#logs');
		// logs.classList.add('active')
		var log = logs.querySelector('div')
		log.appendChild(p);
		log.scrollTop = log.scrollHeight
	}
}

module.exports = utils;