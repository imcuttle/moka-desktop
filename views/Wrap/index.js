'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var path = require('path');
var fs = require('fs');
var db = require('../../db');
var qn = require('../../api/qiniu');

var Wrap = function (_React$Component) {
	_inherits(Wrap, _React$Component);

	function Wrap(props) {
		_classCallCheck(this, Wrap);

		var _this = _possibleConstructorReturn(this, (Wrap.__proto__ || Object.getPrototypeOf(Wrap)).call(this, props));

		_this.state = {
			searchVal: '',
			activeIndex: -1
		};

		_this.qnIptChange = _this.qnIptChange.bind(_this);
		return _this;
	}

	_createClass(Wrap, [{
		key: 'componentWillMount',
		value: function componentWillMount() {}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var input = this.refs.input;

			if (input) {
				input.select();
				input.focus();
			}
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
			var activeIndex = this.state.activeIndex;

			if (activeIndex !== oldState.activeIndex) {
				var suggest = this.refs.suggest;

				var activeLi = suggest.querySelectorAll('li')[activeIndex];
				// console.log(activeIndex>oldState.activeIndex?false:true)
				activeLi.scrollIntoView(false);
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {}
	}, {
		key: 'getSearchMatch',
		value: function getSearchMatch() {
			var searchVal = this.state.searchVal;

			if (searchVal === '') {
				return [];
			}
			var children = this.props.children;

			var clone = Object.assign([], children);
			var keys = searchVal.split(/[\s\+]+/);
			var out = [];
			keys.forEach(function (k) {
				var regS = new RegExp(k, "gi");
				for (var i = 0; i < clone.length; i++) {
					if (regS.test(clone[i])) {
						out.push(clone[i]);
						clone.splice(i--, 1);
					}
				}
			});
			return out;
		}
	}, {
		key: 'keyDown',
		value: function keyDown(e, words) {
			var activeIndex = this.state.activeIndex;
			var _props = this.props,
			    openFile = _props.openFile,
			    workdir = _props.workdir;

			if (e.keyCode === 38) {
				//up
				if (activeIndex > 0) {
					this.setState({ activeIndex: activeIndex - 1 });
				}
				e.preventDefault();
			} else if (e.keyCode === 40) {
				if (activeIndex >= -1 && activeIndex < words.length - 1) {
					this.setState({ activeIndex: activeIndex + 1 });
				}
				e.preventDefault();
			} else if (e.keyCode === 13 && !!words[activeIndex]) {
				this.closeWrap();
				openFile(path.join(workdir, 'source', '_articles', words[activeIndex]));
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var _props2 = this.props,
			    _props2$workdir = _props2.workdir,
			    workdir = _props2$workdir === undefined ? '' : _props2$workdir,
			    children = _props2.children,
			    openWindow = _props2.openWindow,
			    searchPosts = _props2.searchPosts,
			    _new = _props2._new,
			    setParState = _props2.setParState,
			    address = _props2.address,
			    setting = _props2.setting,
			    openFile = _props2.openFile,
			    staticPort = _props2.staticPort,
			    serverPort = _props2.serverPort,
			    qnAK = _props2.qnAK,
			    qnSK = _props2.qnSK,
			    qnOrigin = _props2.qnOrigin,
			    qnBucket = _props2.qnBucket;
			var activeIndex = this.state.activeIndex;

			if (searchPosts) {
				var matcher = this.getSearchMatch();
				return _react2.default.createElement(
					'div',
					{ id: 'wrap', className: 'animated fadeIn' },
					_react2.default.createElement(
						'div',
						{ className: 'messagebox' },
						_react2.default.createElement(
							'h1',
							{ className: 'center' },
							' ',
							_react2.default.createElement('i', { className: 'fa fa-search' }),
							'\u641C\u7D22\u6587\u7AE0',
							_react2.default.createElement('i', { onClick: this.closeWrap.bind(this), className: 'pointer fa fa-close right' })
						),
						_react2.default.createElement(
							'div',
							{ className: 'center' },
							_react2.default.createElement(
								'div',
								_defineProperty({ style: { width: '90%' } }, 'style', { position: 'relative' }),
								_react2.default.createElement('input', { style: { width: '100%', 'boxSizing': 'border-box', height: 30 }, ref: 'inputSearch', autoFocus: true, onChange: function onChange(e) {
										_this2.setState({ 'searchVal': e.target.value.trim(), activeIndex: -1 });
									}, onKeyDown: function onKeyDown(e) {
										return _this2.keyDown.call(_this2, e, matcher);
									} }),
								_react2.default.createElement(
									'ul',
									{ ref: 'suggest', className: 'suggest', style: { width: '100%', 'display': matcher.length == 0 && 'none' } },
									matcher.map(function (name, i) {
										return _react2.default.createElement(
											'li',
											{ onClick: function onClick(e) {
													_this2.closeWrap();
													openFile(path.join(workdir, 'source', '_articles', matcher[i]));
												}, className: activeIndex === i && 'active', key: name },
											name
										);
									})
								)
							)
						)
					)
				);
			}
			if (openWindow) {
				return _react2.default.createElement(
					'div',
					{ id: 'wrap', className: 'animated fadeIn' },
					_react2.default.createElement(
						'div',
						{ className: 'messagebox' },
						_react2.default.createElement(
							'h1',
							{ className: 'center' },
							' ',
							_react2.default.createElement('i', { className: 'fa fa-cog' }),
							'\u6253\u5F00\u65B0\u7A97\u53E3',
							_react2.default.createElement('i', { onClick: this.closeWrap.bind(this), className: 'pointer fa fa-close right' })
						),
						_react2.default.createElement(
							'div',
							{ className: 'center inputgroup' },
							_react2.default.createElement('input', { ref: 'input', defaultValue: address || 'http://localhost:' + serverPort }),
							_react2.default.createElement(
								'span',
								{ className: 'addon', onClick: function onClick() {
										window.open(_this2.refs.input.value);
									} },
								'\u6253\u5F00'
							)
						)
					)
				);
			}
			if (_new) {
				return _react2.default.createElement(
					'div',
					{ id: 'wrap', className: 'animated fadeIn' },
					_react2.default.createElement(
						'div',
						{ className: 'messagebox' },
						_react2.default.createElement(
							'h1',
							{ className: 'center' },
							' ',
							_react2.default.createElement('i', { className: 'fa fa-cog' }),
							'\u65B0\u5EFA\u6587\u7AE0',
							_react2.default.createElement('i', { onClick: this.closeWrap.bind(this), className: 'pointer fa fa-close right' })
						),
						_react2.default.createElement(
							'div',
							{ className: 'center inputgroup' },
							_react2.default.createElement('input', { ref: 'input', defaultValue: 'new' }),
							_react2.default.createElement(
								'span',
								{ className: 'addon', onClick: this.newArticle.bind(this) },
								'\u521B\u5EFA'
							)
						)
					)
				);
			}
			if (!setting || !workdir) {
				return _react2.default.createElement(
					'div',
					{ id: 'wrap', className: 'animated fadeIn' },
					_react2.default.createElement(
						'div',
						{ className: 'messagebox' },
						_react2.default.createElement(
							'h1',
							{ className: 'center' },
							' ',
							_react2.default.createElement('i', { className: 'fa fa-cog' }),
							'\u8BBE\u7F6EMoka\u5DE5\u4F5C\u76EE\u5F55'
						),
						workdir && _react2.default.createElement(
							'span',
							null,
							'\u5F53\u524D\u5DE5\u4F5C\u76EE\u5F55\u4E3A: ',
							workdir
						),
						_react2.default.createElement(
							'div',
							{ className: 'center' },
							_react2.default.createElement(
								'span',
								{ className: 'btn btn-prim', onClick: this.setDir.bind(this) },
								'\u7ACB\u5373\u8BBE\u7F6E'
							)
						)
					)
				);
			} else {
				var _ret = function () {
					var mokaConfigPath = path.join(workdir, 'moka.config.json');
					var mokaConfigExist = fs.existsSync(mokaConfigPath);

					var theme = void 0,
					    mokaConfig = void 0,
					    themeConfig = void 0;
					if (mokaConfigExist) {
						mokaConfig = JSON.parse(fs.readFileSync(mokaConfigPath));
						theme = mokaConfig.theme;
					}

					return {
						v: _react2.default.createElement(
							'div',
							{ id: 'wrap', className: 'animated fadeIn' },
							_react2.default.createElement(
								'div',
								{ className: 'messagebox lg' },
								_react2.default.createElement(
									'h1',
									null,
									' ',
									_react2.default.createElement('i', { className: 'fa fa-cogs' }),
									'\u8BBE\u7F6E',
									_react2.default.createElement('i', { onClick: _this2.closeWrap.bind(_this2), className: 'pointer fa fa-close right' })
								),
								workdir && _react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'span',
										null,
										'\u5F53\u524D\u5DE5\u4F5C\u76EE\u5F55\u4E3A: ',
										workdir
									),
									_react2.default.createElement('i', { onClick: _this2.setDir.bind(_this2), className: 'fa fa-cog icon-btn' })
								),
								workdir && mokaConfigExist && _react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'span',
										null,
										'moka\u914D\u7F6E: moka.config.json'
									),
									_react2.default.createElement('i', { onClick: function onClick() {
											openFile(mokaConfigPath);_this2.closeWrap();
										}, className: 'fa fa-cog icon-btn' })
								),
								workdir && theme && _react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'span',
										null,
										'theme\u914D\u7F6E(',
										theme,
										'): theme.config.json'
									),
									_react2.default.createElement('i', { onClick: function onClick() {
											openFile(path.join(workdir, 'themes', theme, 'theme.config.json'));_this2.closeWrap();
										}, className: 'fa fa-cog icon-btn' })
								),
								workdir && _react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'span',
										null,
										'\u9759\u6001\u670D\u52A1\u7AEF\u53E3'
									),
									': ',
									_react2.default.createElement('input', { type: 'number', defaultValue: staticPort, onChange: function onChange(e) {
											setParState({ staticPort: e.target.value });db.set('moka_staticport', e.target.value);
										} })
								),
								workdir && _react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'span',
										null,
										'\u52A8\u6001\u670D\u52A1\u7AEF\u53E3'
									),
									': ',
									_react2.default.createElement('input', { type: 'number', defaultValue: serverPort, onChange: function onChange(e) {
											setParState({ serverPort: e.target.value });db.set('moka_serverport', e.target.value);
										} })
								),
								workdir && _react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'span',
										null,
										'\u535A\u5BA2\u5730\u5740'
									),
									': ',
									_react2.default.createElement('input', { type: 'text', defaultValue: address, onChange: function onChange(e) {
											setParState({ address: e.target.value });db.set('moka_address', e.target.value);
										} })
								),
								_react2.default.createElement('hr', { style: { marginTop: 10, marginBottom: 8 } }),
								_react2.default.createElement(
									'center',
									{ style: { marginBottom: 8 } },
									'\u4EE5\u4E0B\u5173\u4E8E\u4E03\u725B\u5B58\u50A8\u7684\u914D\u7F6E\uFF0C\u82E5\u5B58\u5728\u4E00\u9879\u7A7A\uFF0C\u5219\u56FE\u7247\u4FDD\u5B58\u81F3\u672C\u5730'
								),
								_react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'span',
										null,
										'AccessKey'
									),
									': ',
									_react2.default.createElement('input', { type: 'text', defaultValue: qnAK, onChange: function onChange(e) {
											_this2.qnIptChange('qnAK', e.target.value.trim(), 'qn_ak');
										} })
								),
								_react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'span',
										null,
										'SecretKey'
									),
									': ',
									_react2.default.createElement('input', { type: 'text', defaultValue: qnSK, onChange: function onChange(e) {
											_this2.qnIptChange('qnSK', e.target.value.trim(), 'qn_sk');
										} })
								),
								_react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'span',
										null,
										'\u5B58\u50A8\u7A7A\u95F4\u540D'
									),
									': ',
									_react2.default.createElement('input', { type: 'text', defaultValue: qnBucket, onChange: function onChange(e) {
											_this2.qnIptChange('qnBucket', e.target.value.trim(), 'qn_bucket');
										} })
								),
								_react2.default.createElement(
									'div',
									null,
									_react2.default.createElement(
										'span',
										null,
										'\u5916\u94FEURL'
									),
									': ',
									_react2.default.createElement('input', { type: 'text', defaultValue: qnOrigin, onChange: function onChange(e) {
											_this2.qnIptChange('qnOrigin', e.target.value.trim(), 'qn_origin');
										} })
								),
								_react2.default.createElement('div', { className: 'center' })
							)
						)
					};
				}();

				if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
			}
		}
	}, {
		key: 'qnIptChange',
		value: function qnIptChange(key, value, db_key) {
			var _props3 = this.props,
			    setParState = _props3.setParState,
			    qnAK = _props3.qnAK,
			    qnSK = _props3.qnSK,
			    qnOrigin = _props3.qnOrigin,
			    qnBucket = _props3.qnBucket;

			var obj = {};
			obj[key] = value;
			setParState(obj);
			qn.setClient(qnAK, qnSK, qnBucket, qnOrigin);
			db.set(db_key, value);
		}
	}, {
		key: 'newArticle',
		value: function newArticle() {
			var input = this.refs.input;
			var _props4 = this.props,
			    workdir = _props4.workdir,
			    setParState = _props4.setParState,
			    newArticle = _props4.newArticle;

			var val = input.value.trim();
			newArticle(val);
			setParState({ _new: false });
		}
	}, {
		key: 'closeWrap',
		value: function closeWrap(e) {
			var setParState = this.props.setParState;

			setParState({ setting: false, _new: false, openWindow: false, searchPosts: false });
		}
	}, {
		key: 'setDir',
		value: function setDir() {
			var dialog = require('electron').remote.dialog;

			var _props5 = this.props,
			    workdir = _props5.workdir,
			    setParState = _props5.setParState;

			var rlt = dialog.showOpenDialog({ properties: ['openDirectory'] });
			if (rlt && rlt.length > 0) {
				setParState({ workdir: rlt[0] });
			}
		}
	}]);

	return Wrap;
}(_react2.default.Component);

Wrap.defaultProps = {};
Wrap.propTypes = {};
exports.default = Wrap;