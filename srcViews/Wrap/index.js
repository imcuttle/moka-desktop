
import React from 'react'
import {Map} from 'immutable'
const path = require('path')
const fs = require('fs')
const db = require('../../db')
const qn = require('../../api/qiniu')

class Wrap extends React.Component {
	constructor(props) {
		super(props)
		this.qnIptChange = this.qnIptChange.bind(this)
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
		return !Map(this.props).equals(Map(newProps))||!Map(this.state).equals(Map(newState))
	}
	componentWillUpdate(newProps, newState, newContext) {

	}
	componentDidUpdate(oldProps, oldState, oldContext) {
		const {activeIndex} = this.state
		if(activeIndex !== oldState.activeIndex) {
			const {suggest} = this.refs;
			let activeLi = suggest.querySelectorAll('li')[activeIndex]
			// console.log(activeIndex>oldState.activeIndex?false:true)
			activeLi.scrollIntoView(false)
		}
	}
	componentWillUnmount() {}
	static defaultProps = {}
    state = {
    	searchVal: '',
    	activeIndex: -1
    }
    static propTypes = {

    }
    getSearchMatch() {
    	const {searchVal} = this.state;
    	if(searchVal==='') {
    		return []
    	}
    	const {children} = this.props;
    	const clone = Object.assign([], children);
    	let keys = searchVal.split(/[\s\+]+/);
    	let out = []
    	keys.forEach(k => {
    		let regS = new RegExp(k, "gi");
    		for (var i = 0; i < clone.length; i++) {
    			if(regS.test(clone[i])) {
    				out.push(clone[i])
    				clone.splice(i--, 1);
    			}
    		}
    	})
    	return out;
    }
    keyDown(e, words) {
    	const activeIndex = this.state.activeIndex
    	const {openFile, workdir} = this.props;
    	if(e.keyCode === 38) {//up
	    	if(activeIndex>0) {
	    		this.setState({activeIndex: activeIndex-1})
	    	}
	    	e.preventDefault()
	    } else if(e.keyCode === 40) {
	    	if(activeIndex>=-1 && activeIndex<words.length-1) {
	    		this.setState({activeIndex: activeIndex+1})
	    	}
	    	e.preventDefault()
	    } else if(e.keyCode === 13 && !!words[activeIndex]) {
	    	this.closeWrap();
	    	openFile(path.join(workdir, 'source', '_articles', words[activeIndex]))
	    }
    }
	render() {
		const {
			workdir='', children, openWindow, searchPosts, _new, setParState,
			address, setting, openFile, staticPort, serverPort, 
			qnAK, qnSK, qnOrigin, qnBucket, smmsChecked
		} = this.props;
		const {activeIndex} = this.state;
		if(searchPosts) {
			var matcher = this.getSearchMatch();
			return (
				<div id="wrap" className="animated fadeIn">
					<div className="messagebox">
						<h1 className="center"> <i className="fa fa-search"></i>搜索文章<i onClick={this.closeWrap.bind(this)}className="pointer fa fa-close right"></i></h1>
						<div className="center">
							<div style={{width: '90%'}} style={{position: 'relative'}}>
								<input style={{width: '100%', 'boxSizing': 'border-box', height: 30}} ref="inputSearch" autoFocus={true} onChange={(e)=>{
									this.setState({'searchVal': e.target.value.trim(), activeIndex: -1})
								}} onKeyDown={(e) => this.keyDown.call(this, e, matcher)}/>
								{
									<ul ref="suggest" className="suggest" style={{width: '100%', 'display': matcher.length==0&&'none'}}>
									{
										matcher.map((name, i)=>
											<li onClick={e=>{
												this.closeWrap();
	    										openFile(path.join(workdir, 'source', '_articles', matcher[i]));
											}} className={activeIndex===i && 'active'} key={name}>{name}</li>	
										)
									}
									</ul>	
								}
							</div>
						</div>
					</div>
				</div>
			)
		}
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
						<div className="center inputgroup">
						<input ref="input" defaultValue="new" />
						<span className="addon" onClick={this.newArticle.bind(this)}>创建</span>
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
						<hr style={{marginTop: 10, marginBottom: 8}}/>
						<center style={{marginBottom: 8}}>以下关于七牛存储的配置，若存在一项空，则使用smms或保存本地</center>
						<div><span>AccessKey</span>: <input type="text" defaultValue={qnAK} onChange={(e)=>{this.qnIptChange('qnAK', e.target.value.trim(), 'qn_ak');}}/></div>
						<div><span>SecretKey</span>: <input type="text" defaultValue={qnSK} onChange={(e)=>{this.qnIptChange('qnSK', e.target.value.trim(), 'qn_sk');}}/></div>
						<div><span>存储空间名</span>: <input type="text" defaultValue={qnBucket} onChange={(e)=>{this.qnIptChange('qnBucket', e.target.value.trim(), 'qn_bucket');}}/></div>
						<div><span>外链URL</span>: <input type="text" defaultValue={qnOrigin} onChange={(e)=>{this.qnIptChange('qnOrigin', e.target.value.trim(), 'qn_origin');}}/></div>
						<center style={{marginBottom: 8, marginTop: 10}}>sm.ms免费图床配置（开启后，小于5MB图片使用smms, 否则使用七牛）</center>
						<div><span>开关</span>: <input type="checkbox" value={smmsChecked} checked={smmsChecked}
							onChange={(e)=>{setParState({smmsChecked: !smmsChecked}); db.set('smms_checked', !smmsChecked) }}
						/></div>
					</div>
				</div>
			)
		}
	}

	qnIptChange(key, value, db_key) {
		const {setParState, qnAK, qnSK, qnOrigin, qnBucket} = this.props;
		const obj = {};
		obj[key] = value;
		setParState(obj);
		qn.setClient(qnAK, qnSK, qnBucket, qnOrigin);
		db.set(db_key, value);
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
		setParState({setting: false, _new: false, openWindow: false, searchPosts: false})
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
