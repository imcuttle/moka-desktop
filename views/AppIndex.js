'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _immutable = require('immutable');

var _utils = require('../api/utils');

var _utils2 = _interopRequireDefault(_utils);

var _shell = require('../api/shell');

var _Editor = require('./Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _Wrap = require('./Wrap');

var _Wrap2 = _interopRequireDefault(_Wrap);

var _Logs = require('./Logs');

var _Logs2 = _interopRequireDefault(_Logs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dialog = require('electron').remote.dialog;

var JsTree = require('../fe-js/tree');
var db = require('../db');
var qn = require('../api/qiniu');
var fs = require('fs');
var path = require('path');

var _require = require('electron'),
    remote = _require.remote;

var Menu = remote.Menu,
    MenuItem = remote.MenuItem;

var menu = new Menu();

var AppIndex = function (_React$Component) {
	_inherits(AppIndex, _React$Component);

	function AppIndex(props) {
		_classCallCheck(this, AppIndex);

		var _this = _possibleConstructorReturn(this, (AppIndex.__proto__ || Object.getPrototypeOf(AppIndex)).call(this, props));

		_this.state = {
			workdir: db.get('work_directory'),
			setting: false,
			logs: '日志记录\n',
			new: false,
			openWindow: false,
			staticPort: parseInt(db.get('moka_staticport')) || 9888,
			serverPort: parseInt(db.get('moka_serverport')) || 9999,
			address: db.get('moka_address') || '',
			qnAK: db.get('qn_ak') || '',
			qnSK: db.get('qn_sk') || '',
			qnBucket: db.get('qn_bucket') || '',
			qnOrigin: db.get('qn_origin') || ''
		};
		_this.vals = {};

		_this.syncTree_Editor.bind(_this);
		_this.openFile.bind(_this);
		return _this;
	}

	_createClass(AppIndex, [{
		key: 'componentWillMount',
		value: function componentWillMount() {}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _state = this.state,
			    workdir = _state.workdir,
			    qnOrigin = _state.qnOrigin,
			    qnBucket = _state.qnBucket,
			    qnSK = _state.qnSK,
			    qnAK = _state.qnAK,
			    setting = _state.setting,
			    searchPosts = _state.searchPosts,
			    _new = _state._new,
			    address = _state.address,
			    openWindow = _state.openWindow,
			    logs = _state.logs,
			    staticPort = _state.staticPort,
			    serverPort = _state.serverPort;

			qn.setClient(qnAK, qnSK, qnBucket, qnOrigin);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(newProps) {}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(newProps, newState, newContext) {
			return !(0, _immutable.Map)(this.props).equals((0, _immutable.Map)(newProps)) || !(0, _immutable.Map)(this.state).equals((0, _immutable.Map)(newState));
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate(newProps, newState, newContext) {}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(oldProps, oldState, oldContext) {
			if (oldState.workdir !== this.state.workdir) {
				this.syncTree_Editor();
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {}
	}, {
		key: 'render',
		value: function render() {
			var props = _objectWithoutProperties(this.props, []);

			var _state2 = this.state,
			    workdir = _state2.workdir,
			    qnOrigin = _state2.qnOrigin,
			    qnBucket = _state2.qnBucket,
			    qnSK = _state2.qnSK,
			    qnAK = _state2.qnAK,
			    setting = _state2.setting,
			    searchPosts = _state2.searchPosts,
			    _new = _state2._new,
			    address = _state2.address,
			    openWindow = _state2.openWindow,
			    logs = _state2.logs,
			    staticPort = _state2.staticPort,
			    serverPort = _state2.serverPort;


			return _react2.default.createElement(
				'div',
				{ id: 'container' },
				_react2.default.createElement(
					'div',
					{ ref: 'head', id: 'head' },
					_react2.default.createElement(
						'span',
						{ ref: 'init', title: '\u53EA\u9700\u8981\u521D\u59CB\u5316\u4E00\u6B21', onClick: this.init.bind(this), className: 'btn btn-prim' },
						'\u521D\u59CB\u5316'
					),
					_react2.default.createElement(
						'span',
						{ ref: 'generate', title: '\u751F\u6210\u9759\u6001\u8D44\u6E90', onClick: this.generate.bind(this), className: 'btn btn-prim' },
						'\u751F\u4EA7'
					),
					_react2.default.createElement(
						'span',
						{ ref: 'server', title: '\u52A8\u6001\u670D\u52A1', onClick: this.server.bind(this), className: 'btn btn-prim' },
						'\u52A8\u6001\u670D\u52A1'
					),
					_react2.default.createElement(
						'span',
						{ ref: 'staticServer', title: '\u9759\u6001\u670D\u52A1', onClick: this.staticServer.bind(this), className: 'btn btn-prim' },
						'\u9759\u6001\u670D\u52A1'
					),
					_react2.default.createElement(
						'span',
						{ ref: 'deploy', title: '\u53D1\u5E03\u81F3\u8FDC\u7AEF', onClick: this.deploy.bind(this), className: 'btn btn-prim' },
						'\u53D1\u5E03'
					),
					_react2.default.createElement(
						'span',
						{ ref: 'bak', title: '\u5907\u4EFD\u81F3\u8FDC\u7AEF', onClick: this.bak.bind(this), className: 'btn btn-prim' },
						'\u5907\u4EFD'
					),
					_react2.default.createElement(
						'span',
						{ ref: 'new', title: '\u65B0\u5EFA\u6587\u7AE0', onClick: this.newFn.bind(this), className: 'btn btn-prim' },
						'\u65B0\u5EFA\u6587\u7AE0'
					),
					_react2.default.createElement(
						'span',
						{ ref: 'shortcut', title: '\u751F\u4EA7=>\u53D1\u5E03=>\u5907\u4EFD', onClick: this.shortcut.bind(this), className: 'btn btn-prim' },
						'\u4E00\u952E\u53D1\u5E03'
					),
					_react2.default.createElement(
						'span',
						{ ref: 'search', title: '\u641C\u7D22', onClick: this.search.bind(this), className: 'btn btn-prim' },
						'\u641C\u7D22'
					),
					_react2.default.createElement(
						'span',
						{ onClick: this.openSetting.bind(this), className: 'btn btn-prim', title: '\u8BBE\u7F6E' },
						_react2.default.createElement('i', { className: 'fa fa-cogs' })
					),
					_react2.default.createElement(
						'span',
						{ onClick: this.open.bind(this), className: 'btn btn-prim', title: 'open' },
						'\u6253\u5F00'
					),
					_react2.default.createElement(
						'span',
						{ className: 'toggle', onClick: this.toggleHead.bind(this) },
						_react2.default.createElement('i', { className: 'fa fa-hand-o-left' })
					)
				),
				_react2.default.createElement(
					'div',
					{ id: 'main' },
					_react2.default.createElement('div', { ref: 'files', id: 'files', onContextMenu: this.treeContextMenu.bind(this), className: 'left' }),
					_react2.default.createElement(
						'div',
						{ id: 'content', className: '' },
						_react2.default.createElement(_Editor2.default, { ref: 'editor', src: './md-editor/index.html', onLoad: this.syncTree_Editor.bind(this) })
					),
					_react2.default.createElement(_Logs2.default, null)
				),
				(!workdir || setting || _new || openWindow || searchPosts) && _react2.default.createElement(_Wrap2.default, {
					address: address, qnOrigin: qnOrigin, qnBucket: qnBucket, qnSK: qnSK, qnAK: qnAK,
					children: !!workdir ? fs.readdirSync(path.join(workdir, 'source', '_articles')) : null,
					searchPosts: searchPosts,
					_new: _new, newArticle: this.newArticle.bind(this), openWindow: openWindow,
					workdir: workdir, openFile: this.openFile.bind(this), setting: setting, setParState: this.setState.bind(this),
					staticPort: staticPort, serverPort: serverPort
				})
			);
		}
	}, {
		key: 'treeContextMenu',
		value: function treeContextMenu(e) {

			menu.items.length === 0 && menu.append(new MenuItem({
				label: 'RefreshTree',
				click: function () {
					var tmp = db.get('current_fpath');
					this.syncTree_Editor();
					db.set('current_fpath', tmp);
				}.bind(this)
			}));
			e.stopPropagation();
			e.preventDefault();
			menu.popup(remote.getCurrentWindow());
		}
	}, {
		key: 'search',
		value: function search() {
			var init = this.refs.init;

			var cwd = db.get('work_directory');
			if (!cwd) {
				dialog.showMessageBox({ type: 'error', message: '\u8BF7\u5148\u9009\u5B9A\u5DE5\u4F5C\u76EE\u5F55', buttons: ['确定'] });
				return;
			}
			this.setState({ searchPosts: true });
		}
	}, {
		key: 'init',
		value: function init() {
			var _this2 = this;

			var init = this.refs.init;

			if (init.classList.contains('disable')) {
				return;
			}
			var n = 3;
			while (0 === dialog.showMessageBox({ type: 'question', message: '\u662F\u5426\u521D\u59CB\u5316\uFF1F\u53EF\u80FD\u4F1A\u8986\u76D6\u60A8\u7684\u4FEE\u6539(\u9700\u786E\u8BA4' + n + '\u6B21)', buttons: ['确定', '取消'] })) {
				n--;
				if (n == 0) {
					init.classList.add('disable');
					var cwd = db.get('work_directory');
					if (cwd) {
						(function () {
							var cp = (0, _shell.spawn)(['i'], cwd, function (error) {
								if (!error) {} else {
									dialog.showErrorBox('init', [error.message].join('\n'));
								}
								cp.kill('SIGINT');
								init.classList.remove('disable');
								_this2.syncTree_Editor();
							});

							cp.stdout.on('data', function (data) {
								data = data.toString();
								console.log(data);
								_utils2.default.logs(data);
							});
							cp.stderr.on('data', function (data) {
								data = data.toString();
								console.log(data);
								_utils2.default.logs(data);
							});
						})();
					}
					break;
				}
			}
		}
	}, {
		key: 'generate',
		value: function generate() {
			var generate = this.refs.generate;

			if (generate.classList.contains('disable')) {
				return;
			}
			generate.classList.add('disable');
			var cwd = db.get('work_directory');
			if (cwd) {
				(function () {
					var cp = (0, _shell.spawn)(['g'], cwd, function (error) {
						if (!error) {} else {
							dialog.showErrorBox('generate', [error.message].join('\n'));
						}
						cp.kill('SIGINT');
						generate.classList.remove('disable');
					});

					cp.stdout.on('data', function (data) {
						data = data.toString();
						console.log(data);
						_utils2.default.logs(data);
						if (data.replace(/\s*$/, '').endsWith('generate static pages done.')) {
							cp.kill('SIGINT');
							generate.classList.remove('disable');
						}
					});
					cp.stderr.on('data', function (data) {
						data = data.toString();
						console.log(data);
						_utils2.default.logs(data);
					});
				})();
			}
		}
	}, {
		key: 'server',
		value: function server() {
			var _this3 = this;

			var server = this.refs.server;
			var _state3 = this.state,
			    logs = _state3.logs,
			    serverPort = _state3.serverPort;

			if (!server.classList.contains('disable')) {
				var cwd = db.get('work_directory');
				if (cwd) {
					(function () {
						var cp = (0, _shell.spawn)(['s', '-p', '' + serverPort], cwd, function (error) {
							if (!error) {
								// window.open(`http://localhost:${serverPort}`)
							} else {
								dialog.showErrorBox('\u52A8\u6001\u670D\u52A1\uFF0C\u7AEF\u53E3' + serverPort, [error.message].join('\n'));
							}
							cp.kill('SIGINT');
							server.classList.remove('disable');
						});

						cp.stdout.on('data', function (data) {
							data = data.toString();
							console.log(data);
							_utils2.default.logs(data);

							if (data.replace(/\s*$/, '').endsWith('http://localhost:' + serverPort)) {
								cp._window = window.open('http://localhost:' + serverPort);
							}
						});
						cp.stderr.on('data', function (data) {
							data = data.toString();
							console.log(data);
							_utils2.default.logs(data);
						});
						_this3.vals.cpServer = cp;
					})();
				}
			} else if (this.vals.cpServer) {
				this.vals.cpServer._window && !this.vals.cpServer._window.closed && this.vals.cpServer._window.close();
				this.vals.cpServer.kill('SIGINT');
			}
			server.classList.toggle('disable');
		}
	}, {
		key: 'staticServer',
		value: function staticServer() {
			var _this4 = this;

			var staticServer = this.refs.staticServer;
			var _state4 = this.state,
			    logs = _state4.logs,
			    staticPort = _state4.staticPort;


			if (!staticServer.classList.contains('disable')) {
				var cwd = db.get('work_directory');
				if (cwd) {
					(function () {
						var cp = (0, _shell.spawn)(['ss', '-p', '' + staticPort], cwd, function (error) {
							if (!error) {
								// cp._window = window.open(`http://localhost:${staticPort}`)
							} else {
								dialog.showErrorBox('\u9759\u6001\u670D\u52A1\uFF0C\u7AEF\u53E3' + staticPort, [error.message].join('\n'));
							}
							staticServer.classList.remove('disable');
							cp.kill('SIGINT');
						});
						_this4.vals.cpStaticServer = cp;
						cp.stdout.on('data', function (data) {
							data = data.toString();
							console.log(data);
							_utils2.default.logs(data);
							if (data.replace(/\s*$/, '').endsWith('http://localhost:' + staticPort)) {
								cp._window = window.open('http://localhost:' + staticPort);
							}
						});
						cp.stderr.on('data', function (data) {
							data = data.toString();
							console.log(data);
							_utils2.default.logs(data);
						});
					})();
				}
			} else if (this.vals.cpStaticServer) {
				this.vals.cpStaticServer._window && !this.vals.cpStaticServer._window.closed && this.vals.cpStaticServer._window.close();
				this.vals.cpStaticServer.kill('SIGINT');
			}

			staticServer.classList.toggle('disable');
		}
	}, {
		key: 'open',
		value: function open() {
			this.setState({ openWindow: true });
		}
	}, {
		key: 'deploy',
		value: function deploy() {
			var deploy = this.refs.deploy;

			if (deploy.classList.contains('disable')) {
				return;
			}
			deploy.classList.add('disable');
			var cwd = db.get('work_directory');
			if (cwd) {
				(function () {
					var cp = (0, _shell.spawn)(['d'], cwd, function (error) {
						if (!error) {} else {
							dialog.showErrorBox('deploy', [error.message].join('\n'));
						}
						cp.kill('SIGINT');
						deploy.classList.remove('disable');
					});

					cp.stdout.on('data', function (data) {
						data = data.toString();
						console.log(data);
						_utils2.default.logs(data);
					});
					cp.stderr.on('data', function (data) {
						data = data.toString();
						console.log(data);
						_utils2.default.logs(data);
					});
				})();
			}
		}
	}, {
		key: 'bak',
		value: function bak() {
			var bak = this.refs.bak;

			if (bak.classList.contains('disable')) {
				return;
			}
			bak.classList.add('disable');
			var cwd = db.get('work_directory');
			if (cwd) {
				(function () {
					var cp = (0, _shell.spawn)(['b'], cwd, function (error) {
						if (!error) {} else {
							dialog.showErrorBox('bak', [error.message].join('\n'));
						}
						cp.kill('SIGINT');
						bak.classList.remove('disable');
					});

					cp.stdout.on('data', function (data) {
						data = data.toString();
						console.log(data);
						_utils2.default.logs(data);
					});
					cp.stderr.on('data', function (data) {
						data = data.toString();
						console.log(data);
						_utils2.default.logs(data);
					});
				})();
			}
		}
	}, {
		key: 'newFn',
		value: function newFn() {
			this.setState({ _new: true });
		}
	}, {
		key: 'newArticle',
		value: function newArticle(val) {
			var _this5 = this;

			var _new = this.refs.new;
			// if(_new.classList.contains('disable')) {
			// 	return;
			// }
			// _new.classList.add('disable')
			var cwd = db.get('work_directory');
			if (cwd) {
				(function () {
					val = val.replace(/\s/g, '-');
					var cp = (0, _shell.spawn)(['n', val], cwd, function (error) {
						if (!error) {
							_this5.openFile(path.join(cwd, 'source', '_articles', val + '.md'));
						} else {
							dialog.showErrorBox('new', [error.message].join('\n'));
						}
						cp.kill('SIGINT');
						_new.classList.remove('disable');
					});

					cp.stdout.on('data', function (data) {
						data = data.toString();
						console.log(data);
						_utils2.default.logs(data);
					});
					cp.stderr.on('data', function (data) {
						data = data.toString();
						console.log(data);
						_utils2.default.logs(data);
					});
				})();
			}
		}
	}, {
		key: 'shortcut',
		value: function shortcut() {
			var shortcut = this.refs.shortcut;

			if (shortcut.classList.contains('disable')) {
				return;
			}
			shortcut.classList.add('disable');
			var cwd = db.get('work_directory');
			if (cwd) {
				var doneNum;

				(function () {
					var cp = (0, _shell.spawn)(['d', '-g', '-b'], cwd, function (error) {
						if (!error) {} else {
							dialog.showErrorBox('shortcut', [error.message].join('\n'));
						}
						cp.kill('SIGINT');
						shortcut.classList.remove('disable');
					});
					doneNum = 0;

					cp.stdout.on('data', function (data) {
						data = data.toString();
						console.log(data);
						_utils2.default.logs(data);
						if (/(Bak|Deploy) Done!$/.test(data.replace(/\s*$/, ''))) {
							doneNum++;
							if (doneNum === 2) {
								cp.kill('SIGINT');
								shortcut.classList.remove('disable');
							}
						}
					});
					cp.stderr.on('data', function (data) {
						data = data.toString();
						console.log(data);
						_utils2.default.logs(data);
					});
				})();
			}
		}
	}, {
		key: 'openSetting',
		value: function openSetting(e) {
			this.setState({ setting: true });
			this.toggleHead();
		}
	}, {
		key: 'toggleHead',
		value: function toggleHead(e) {
			var head = this.refs.head;

			head.classList.toggle('active');
		}
	}, {
		key: 'syncTree_Editor',
		value: function syncTree_Editor() {
			var _refs = this.refs,
			    editor = _refs.editor,
			    files = _refs.files;
			var workdir = this.state.workdir;

			var win = editor.refs.iframe.contentWindow;

			win.nPath = path;
			win.nFs = fs;
			win.Buffer = Buffer;
			win.nRequire = require;
			win.__dirname = __dirname;
			if (!workdir) {
				return;
			}
			var self = this;
			db.set('current_fpath', '');
			db.set('work_directory', workdir);
			var lists = _utils2.default.getDirTreeList(workdir, function fileCallback(fpath) {
				self.openFile(fpath, this);
			});

			files.innerHTML = '';
			files.appendChild(new JsTree(lists));

			// this.vals.watcher && this.vals.watcher.close()
			// this.vals.watcher = fs.watch(workdir, (eventType, filename) => {
			//   console.log(`event type is: ${eventType}`);
			//   if (filename) {
			//     console.log(`filename provided: ${filename}`);
			//   } else {
			//     console.log('filename not provided');
			//   }
			// });
		}
	}, {
		key: 'openFile',
		value: function openFile(fpath, el) {
			var _refs2 = this.refs,
			    editor = _refs2.editor,
			    files = _refs2.files;

			var win = editor.refs.iframe.contentWindow;
			var aceEditor = win.editor;

			var mode = _utils2.default.getFileMimeType(fpath);
			console.info(mode, fpath);
			if (/^(png|gif|ico|icon|jpg|jpeg|pdf)$/i.test(mode)) {
				window.open('file://' + fpath);
				return;
			}
			if (/^(doc|docx|xls|xlsx|eot|ttf|woff|woff2)$/i.test(mode)) {
				return;
			}

			if (!!db.get('current_fpath') && aceEditor.changed && 0 === dialog.showMessageBox({ type: 'question', message: '\u662F\u5426\u4FDD\u5B58\u5BF9' + path.basename(db.get('current_fpath')) + '\u4FEE\u6539?', buttons: ['确定', '取消'] })) {
				aceEditor.save();
			}

			db.set('editor_mode', mode);
			db.set('current_fpath', fpath);
			var string = fs.readFileSync(fpath).toString();

			var newSession = win.ace.createEditSession(string);
			// var oldSession = editor.session
			aceEditor.setSession(newSession);
			aceEditor.getSession().setMode('ace/mode/' + mode);
			aceEditor.getSession().setUseWrapMode(true);
			aceEditor.setValue(string);

			aceEditor.changed = false;

			el = el || document.querySelector('[jstree-key="' + fpath + '"]');
			var self = this;
			self.vals.prev && self.vals.prev.classList.remove('open');
			if (el) {
				el.classList.add('open');
			}
			self.vals.prev = el;
			// db.set('editor_value', aceEditor.getValue())
		}
	}]);

	return AppIndex;
}(_react2.default.Component);

AppIndex.defaultProps = {};
AppIndex.propTypes = {};


(0, _reactDom.render)(_react2.default.createElement(AppIndex, null), document.getElementById('root'));

exports.default = AppIndex;