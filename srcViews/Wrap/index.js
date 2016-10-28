
import React from 'react'
import {Map} from 'immutable'
const path = require('path')
const fs = require('fs')
const db = require('../../db')

class Wrap extends React.Component {
	constructor(props) {
		super(props)
	}
	componentWillMount() {}
	componentDidMount() {
		const {input} = this.refs
		if(input) {
			input.select();
			input.focus()
		}
	}
	componentWillReceiveProps(newProps) {}
	shouldComponentUpdate(newProps, newState, newContext) {
		return !Map(this.props).equals(Map(newProps))
	}
	componentWillUpdate(newProps, newState, newContext) {}
	componentDidUpdate(oldProps, oldState, oldContext) {}
	componentWillUnmount() {}
	static defaultProps = {}
    state = {}
    static propTypes = {}
	render() {
		const {workdir='', openWindow, _new, setParState, address, setting, openFile, staticPort, serverPort} = this.props;
		if(openWindow) {
			return (
				<div id="wrap" className="animated fadeIn">
					<div className="messagebox">
						<h1 className="center"> <i className="fa fa-cog"></i>打开新窗口<i onClick={this.closeWrap.bind(this)}className="pointer fa fa-close right"></i></h1>
						<div className="center inputgroup">
						<input ref="input" defaultValue={address || `http://localhost:${serverPort}`} />
						<span className="addon" onClick={()=>{
							window.open(this.refs.input.value);
						}}>打开</span>
						</div>
					</div>
				</div>
			)
		}
		if(_new) {
			return (
				<div id="wrap" className="animated fadeIn">
					<div className="messagebox">
						<h1 className="center"> <i className="fa fa-cog"></i>新建文章<i onClick={this.closeWrap.bind(this)}className="pointer fa fa-close right"></i></h1>
						<div className="center">
						<input ref="input" defaultValue="new" />
						<span className="btn btn-prim" onClick={this.newArticle.bind(this)}>创建</span>
						</div>
					</div>
				</div>
			)
		}
		if(!setting || !workdir) {
			return (
				<div id="wrap" className="animated fadeIn">
					<div className="messagebox">
						<h1 className="center"> <i className="fa fa-cog"></i>设置Moka工作目录</h1>
						{workdir && <span>当前工作目录为: {workdir}</span>}
						<div className="center">
						<span className="btn btn-prim" onClick={this.setDir.bind(this)}>立即设置</span>
						</div>
					</div>
				</div>
			)
		} else {
			const mokaConfigPath = path.join(workdir, 'moka.config.json');
			const mokaConfigExist = fs.existsSync(mokaConfigPath);
			
			let theme, mokaConfig, themeConfig;
			if(mokaConfigExist) {
				mokaConfig = JSON.parse(fs.readFileSync(mokaConfigPath))
				theme = mokaConfig.theme
			}

			return (
				<div id="wrap" className="animated fadeIn">
					<div className="messagebox lg">
						<h1> <i className="fa fa-cogs"></i>设置<i onClick={this.closeWrap.bind(this)}className="pointer fa fa-close right"></i></h1>
						{workdir && <div><span>当前工作目录为: {workdir}</span><i onClick={this.setDir.bind(this)} className="fa fa-cog icon-btn"></i></div>}
						{workdir && mokaConfigExist && <div><span>moka配置: moka.config.json</span><i onClick={()=>{openFile(mokaConfigPath); this.closeWrap();}} className="fa fa-cog icon-btn"></i></div>}
						{workdir && theme && <div><span>theme配置({theme}): theme.config.json</span><i onClick={()=>{openFile(path.join(workdir, 'themes', theme, 'theme.config.json')); this.closeWrap();}} className="fa fa-cog icon-btn"></i></div>}
						{workdir && <div><span>静态服务端口</span>: <input type="number" defaultValue={staticPort} onChange={(e)=>{setParState({staticPort: e.target.value}); db.set('moka_staticport', e.target.value);}}/></div>}
						{workdir && <div><span>动态服务端口</span>: <input type="number" defaultValue={serverPort} onChange={(e)=>{setParState({serverPort: e.target.value}); db.set('moka_serverport', e.target.value)}}/></div>}
						{workdir && <div><span>博客地址</span>: <input type="text" defaultValue={address} onChange={(e)=>{setParState({address: e.target.value}); db.set('moka_address', e.target.value)}}/></div>}
						<div className="center">
						</div>
					</div>
				</div>
			)
		}
	}

	newArticle() {
		const {input} = this.refs;
		const {workdir, setParState, newArticle} = this.props;
		var val = input.value.trim()
		newArticle(val);
		setParState({_new: false})
	}
	closeWrap(e) {
		const {setParState} = this.props;
		setParState({setting: false, _new: false, openWindow: false})
	}

	setDir() {
		const {dialog} = require('electron').remote
		const {workdir, setParState} = this.props;
		var rlt = dialog.showOpenDialog({properties: ['openDirectory']});
		if(rlt && rlt.length>0) {
			setParState({workdir: rlt[0]})
		}
	}
}

export default Wrap;
