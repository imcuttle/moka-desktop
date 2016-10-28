
import React from 'react'
import {render} from 'react-dom'
import {Map} from 'immutable'

const {dialog} = require('electron').remote

const JsTree = require('../fe-js/tree')
const db = require('../db')
const fs = require('fs')
const path = require('path')
import utils from '../api/utils'
import {shell, spawn} from '../api/shell'
import Editor from './Editor'
import Wrap from './Wrap'
import Logs from './Logs'

const {remote} = require('electron')
const {Menu, MenuItem} = remote
const menu = new Menu()



class AppIndex extends React.Component {
	constructor(props) {
		super(props)
		this.syncTree_Editor.bind(this)
		this.openFile.bind(this)
	}
	componentWillMount() {}
	componentDidMount() {

	}
	componentWillReceiveProps(newProps) {}
	shouldComponentUpdate(newProps, newState, newContext) {
		return !Map(this.props).equals(Map(newProps)) ||
			!Map(this.state).equals(Map(newState))
	}
	componentWillUpdate(newProps, newState, newContext) {
		
	}
	componentDidUpdate(oldProps, oldState, oldContext) {
		if(oldState.workdir!==this.state.workdir) {
			this.syncTree_Editor();
		}
	}
	componentWillUnmount() {}
	static defaultProps = {}
    state = {
    	workdir: db.get('work_directory'),
    	setting: false,
    	logs: '日志记录\n',
    	new: false,
    	openWindow: false,
		staticPort: parseInt(db.get('moka_staticport')) || 9888,
		serverPort: parseInt(db.get('moka_serverport')) || 9999,
		address: db.get('moka_address') || ''
    }
    static propTypes = {}
	render() {
		const {...props} = this.props;
		const {workdir, setting, _new, address, openWindow, logs, staticPort, serverPort} = this.state;

		return (
			<div id="container">

			  <div ref="head" id="head">
			      <span ref="init" onClick={this.init.bind(this)} className="btn btn-prim">Init</span>
			      <span ref="generate" onClick={this.generate.bind(this)} className="btn btn-prim">Generate</span>
			      <span ref="server" onClick={this.server.bind(this)} className="btn btn-prim">Server</span>
			      <span ref="staticServer" onClick={this.staticServer.bind(this)} className="btn btn-prim">StaticServer</span>
			      <span ref="deploy" onClick={this.deploy.bind(this)} className="btn btn-prim">Deploy</span>
			      <span ref="bak" onClick={this.bak.bind(this)} className="btn btn-prim">Bak</span>
			      <span ref="new" onClick={this.newFn.bind(this)} className="btn btn-prim">New</span>
			      <span ref="shortcut" onClick={this.shortcut.bind(this)} className="btn btn-prim">一键发布</span>
			      <span onClick={this.openSetting.bind(this)} className="btn btn-prim" title="设置"><i className="fa fa-cogs"></i></span>
			      <span onClick={this.open.bind(this)} className="btn btn-prim" title="open">open</span>
			      <span className="toggle" onClick={this.toggleHead.bind(this)}><i className="fa fa-hand-o-left"></i></span>
			  </div>
			  <div id="main">
			    <div ref="files" id="files" onContextMenu={this.treeContextMenu.bind(this)} className="left">
			        
			    </div>
			    <div id="content" className="">
			      <Editor ref="editor" src="./md-editor/index.html" onLoad={this.syncTree_Editor.bind(this)}/>
			    </div>
			    <Logs />
			  </div>

			  
			  {(!workdir||setting||_new||openWindow) && <Wrap 
			  		address={address}
			  		_new={_new} newArticle={this.newArticle.bind(this)} openWindow={openWindow}
				  	workdir={workdir} openFile={this.openFile.bind(this)} setting={setting} setParState={this.setState.bind(this)}
				  	staticPort={staticPort} serverPort={serverPort}
			  	/> }
		  	</div>
		)
	}
	treeContextMenu(e) {
		
		menu.items.length === 0 &&
		menu.append(new MenuItem({
			label: 'RefreshTree', 
			click: function () { 
				this.syncTree_Editor();
			}.bind(this)
		}));
		e.stopPropagation()
		e.preventDefault()
		menu.popup(remote.getCurrentWindow())
	}
	init() {

		const {init} = this.refs;
		if(init.classList.contains('disable')) {
			return;
		}
		var n = 3;
		while(0===dialog.showMessageBox({type: 'question', message: `是否初始化？可能会覆盖您的修改(需确认${n}次)`, buttons: ['确定', '取消']})) {
			n--;
			if(n==0) {
				init.classList.add('disable')
				var cwd = db.get('work_directory');
				if(cwd) {
					let cp = spawn(['i'], cwd, (error)=>{
						if(!error) {
							
						} else {
							dialog.showErrorBox(`init`, [error.message].join('\n'))
						}
						cp.kill('SIGINT')
						init.classList.remove('disable')
						this.syncTree_Editor()
					})
					
					cp.stdout.on('data', (data)=>{
						data = data.toString()
						console.log(data);
						utils.logs(data);
					});
					cp.stderr.on('data', (data) => {
						data = data.toString()
						console.log(data);
						utils.logs(data);
					})
				}
				break;
			}
		}
	}
	generate() {
		const {generate} = this.refs;
		if(generate.classList.contains('disable')) {
			return;
		}
		generate.classList.add('disable')
		var cwd = db.get('work_directory');
		if(cwd) {
			let cp = spawn(['g'], cwd, (error)=>{
				if(!error) {
					
				} else {
					dialog.showErrorBox(`generate`, [error.message].join('\n'))
				}
				cp.kill('SIGINT')
				generate.classList.remove('disable')
			})
			
			cp.stdout.on('data', (data)=>{
				data = data.toString()
				console.log(data);
				utils.logs(data);
				if(data.replace(/\s*$/, '').endsWith(`generate static pages done.`)) {
					cp.kill('SIGINT')
					generate.classList.remove('disable')
				}
			});
			cp.stderr.on('data', (data) => {
				data = data.toString()
				console.log(data);
				utils.logs(data);
			})
		}
	}

	server() {
		const {server} = this.refs
		const {logs, serverPort} = this.state;
		if(!server.classList.contains('disable')) {
			var cwd = db.get('work_directory');
			if(cwd) {
				let cp = spawn(['s', '-p', `${serverPort}`], cwd, (error)=>{
					if(!error) {
						// window.open(`http://localhost:${serverPort}`)
					} else {
						dialog.showErrorBox(`动态服务，端口${serverPort}`, [error.message].join('\n'))
					}
					cp.kill('SIGINT')
					server.classList.remove('disable')
				})
				
				cp.stdout.on('data', (data)=>{
					data = data.toString()
					console.log(data);
					utils.logs(data);
					
					if(data.replace(/\s*$/, '').endsWith(`http://localhost:${serverPort}`)) {
						cp._window = window.open(`http://localhost:${serverPort}`)	
					}
				});
				cp.stderr.on('data', (data) => {
					data = data.toString()
					console.log(data);
					utils.logs(data);
				})
				this.vals.cpServer = cp;
			}
		} else if(this.vals.cpServer) {
			this.vals.cpServer._window &&
			!this.vals.cpServer._window.closed &&
			this.vals.cpServer._window.close();
			this.vals.cpServer.kill('SIGINT');
		}
		server.classList.toggle('disable')
	}

	staticServer() {
		const {staticServer} = this.refs
		const {logs, staticPort} = this.state;
		
		if(!staticServer.classList.contains('disable')) {
			var cwd = db.get('work_directory');
			if(cwd) {
				let cp = spawn(['ss', '-p', `${staticPort}`], cwd, (error)=>{
					if(!error) {
						// cp._window = window.open(`http://localhost:${staticPort}`)
					} else {
						dialog.showErrorBox(`静态服务，端口${staticPort}`, [error.message].join('\n'))
					}
					staticServer.classList.remove('disable')
					cp.kill('SIGINT')
				})
				this.vals.cpStaticServer = cp;
				cp.stdout.on('data', (data)=>{
					data = data.toString()
					console.log(data);
					utils.logs(data);
					if(data.replace(/\s*$/, '').endsWith(`http://localhost:${staticPort}`)) {
						cp._window = window.open(`http://localhost:${staticPort}`)	
					}
				});
				cp.stderr.on('data', (data) => {
					data = data.toString()
					console.log(data);
					utils.logs(data);
				})
			}
		} else if(this.vals.cpStaticServer) {
			this.vals.cpStaticServer._window &&
			!this.vals.cpStaticServer._window.closed &&
			this.vals.cpStaticServer._window.close();
			this.vals.cpStaticServer.kill('SIGINT');
		}
		
		staticServer.classList.toggle('disable')
	}
	open() {
		this.setState({openWindow: true})
	}
	deploy() {
		const {deploy} = this.refs;
		if(deploy.classList.contains('disable')) {
			return;
		}
		deploy.classList.add('disable')
		var cwd = db.get('work_directory');
		if(cwd) {
			let cp = spawn(['d'], cwd, (error)=>{
				if(!error) {
					
				} else {
					dialog.showErrorBox(`deploy`, [error.message].join('\n'))
				}
				cp.kill('SIGINT')
				deploy.classList.remove('disable')
			})
			
			cp.stdout.on('data', (data)=>{
				data = data.toString()
				console.log(data);
				utils.logs(data);
			});
			cp.stderr.on('data', (data) => {
				data = data.toString()
				console.log(data);
				utils.logs(data);
			})
		}
	}
	bak() {
		const {bak} = this.refs;
		if(bak.classList.contains('disable')) {
			return;
		}
		bak.classList.add('disable')
		var cwd = db.get('work_directory');
		if(cwd) {
			let cp = spawn(['b'], cwd, (error)=>{
				if(!error) {
					
				} else {
					dialog.showErrorBox(`bak`, [error.message].join('\n'))
				}
				cp.kill('SIGINT')
				bak.classList.remove('disable')
			})
			
			cp.stdout.on('data', (data)=>{
				data = data.toString()
				console.log(data);
				utils.logs(data);
			});
			cp.stderr.on('data', (data) => {
				data = data.toString()
				console.log(data);
				utils.logs(data);
			})
		}
	}
	newFn() {
		this.setState({_new: true})
	}
	newArticle(val) {
		const _new = this.refs.new;
		if(_new.classList.contains('disable')) {
			return;
		}
		var cwd = db.get('work_directory');
		if(cwd) {
			let cp = spawn(['n', val], cwd, (error)=>{
				if(!error) {
					this.openFile(path.join(cwd, 'source', '_articles', `${val}.md`))
				} else {
					dialog.showErrorBox(`new`, [error.message].join('\n'))
				}
				cp.kill('SIGINT')
				_new.classList.remove('disable')
			})
			
			cp.stdout.on('data', (data)=>{
				data = data.toString()
				console.log(data);
				utils.logs(data);
			});
			cp.stderr.on('data', (data) => {
				data = data.toString()
				console.log(data);
				utils.logs(data);
			})
		}
	}
	shortcut() {
		const {shortcut} = this.refs;
		if(shortcut.classList.contains('disable')) {
			return;
		}
		var cwd = db.get('work_directory');
		if(cwd) {
			let cp = spawn(['d', '-g', '-b'], cwd, (error)=>{
				if(!error) {
					
				} else {
					dialog.showErrorBox(`shortcut`, [error.message].join('\n'))
				}
				cp.kill('SIGINT')
				shortcut.classList.remove('disable')
			})
			
			cp.stdout.on('data', (data)=>{
				data = data.toString()
				console.log(data);
				utils.logs(data);
			});
			cp.stderr.on('data', (data) => {
				data = data.toString()
				console.log(data);
				utils.logs(data);
			})
		}
	}

	openSetting(e) {
		this.setState({setting: true})
		this.toggleHead();
	}
	
	toggleHead(e) {
		const {head} = this.refs
		head.classList.toggle('active');
	}

	vals = {}
	syncTree_Editor() {
		const {editor, files} = this.refs;
		const {workdir} = this.state;
		var win = editor.refs.iframe.contentWindow;
		
		win.nPath = path
		win.nFs = fs
		win.Buffer = Buffer
		win.__dirname = __dirname;
		if(!workdir) {
			return;
		}
		var self = this;
		db.set('current_fpath', '')
		db.set('work_directory', workdir);
		var lists = utils.getDirTreeList(workdir, function fileCallback(fpath) {
			self.openFile(fpath, this)
		})

		files.innerHTML = ''
		files.appendChild(new JsTree(lists))

		this.vals.watcher && this.vals.watcher.close()
		this.vals.watcher = fs.watch(workdir, (eventType, filename) => {
		  console.log(`event type is: ${eventType}`);
		  if (filename) {
		    console.log(`filename provided: ${filename}`);
		  } else {
		    console.log('filename not provided');
		  }
		});
	}

	openFile(fpath, el) {
		const {editor, files} = this.refs;
		var win = editor.refs.iframe.contentWindow;
		var aceEditor = win.editor;

		var mode = utils.getFileMimeType(fpath);
		console.info(mode, fpath)
		if(/^(png|gif|ico|icon|jpg|jpeg|pdf)$/i.test(mode)) {
			window.open(`file://${fpath}`)
			return;
		}
		if(/^(doc|docx|xls|xlsx|eot|ttf|woff|woff2)$/i.test(mode)) {
			return;
		}
		
		if(!!db.get('current_fpath') && aceEditor.changed && 0===dialog.showMessageBox({type: 'question', message: `是否保存对${path.basename(db.get('current_fpath'))}修改?`, buttons: ['确定', '取消']})) {
			aceEditor.save();
		}

		db.set('editor_mode', mode);
		db.set('current_fpath', fpath);
		var string = fs.readFileSync(fpath).toString()

		var newSession = win.ace.createEditSession(string)
		// var oldSession = editor.session
		aceEditor.setSession(newSession)
		aceEditor.getSession().setMode(`ace/mode/${mode}`)
		aceEditor.setValue(string)

		aceEditor.changed = false;

		el = el || document.querySelector(`[jstree-key="${fpath}"]`);
		var self = this;
		self.vals.prev && self.vals.prev.classList.remove('open');
		if(el) {
			el.classList.add('open')
		}
		self.vals.prev = el;
		// db.set('editor_value', aceEditor.getValue())
	}
}

render(
    <AppIndex />,
    document.getElementById('root')
);

export default AppIndex;
