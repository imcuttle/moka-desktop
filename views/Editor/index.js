'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var db = require('../../db');
var path = require('path');

var _require = require('electron'),
    remote = _require.remote;

var Menu = remote.Menu,
    MenuItem = remote.MenuItem;

var editorMenu = new Menu();
var previewMenu = new Menu();

var Editor = function (_React$Component) {
	_inherits(Editor, _React$Component);

	function Editor(props) {
		_classCallCheck(this, Editor);

		var _this = _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, props));

		_this.state = {};
		return _this;
	}

	_createClass(Editor, [{
		key: 'componentWillMount',
		value: function componentWillMount() {}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var iframe = this.refs.iframe;

			iframe.contentWindow.handelContextmenu = this.contextMenu.bind(this);
			iframe.contentWindow.handelPreviewContextmenu = this.previewContextmenu.bind(this);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(newProps) {}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(newProps, newState, newContext) {
			return !this.props.src === newProps.src;
		}
	}, {
		key: 'componentWillUpdate',
		value: function componentWillUpdate(newProps, newState, newContext) {}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(oldProps, oldState, oldContext) {}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {}
	}, {
		key: 'render',
		value: function render() {
			var props = _objectWithoutProperties(this.props, []);

			return _react2.default.createElement('iframe', _extends({ ref: 'iframe' }, props));
		}
	}, {
		key: 'previewContextmenu',
		value: function previewContextmenu(e) {
			var iframe = this.refs.iframe;

			var win = iframe.contentWindow;
			var editor = win.editor;
			if (!editor || !editor._themes) {
				return;
			}
			if (previewMenu.items.length == 0) {
				previewMenu.append(new MenuItem({
					label: '实时预览',
					click: function (menuItem, browserWindow, event) {
						editor.closePreview = !editor.closePreview;
					}.bind(this),
					type: 'checkbox',
					checked: !editor.closePreview
				}));
			}
			e.stopPropagation();
			e.preventDefault();
			previewMenu.popup(remote.getCurrentWindow());
		}
	}, {
		key: 'contextMenu',
		value: function contextMenu(e) {
			var _this2 = this;

			var iframe = this.refs.iframe;

			var win = iframe.contentWindow;
			var editor = win.editor;
			if (!editor || !editor._themes) {
				return;
			}
			if (editorMenu.items.length == 0) {
				editor._themes.forEach(function (fulltheme) {
					editorMenu.append(new MenuItem({
						label: path.basename(fulltheme),
						click: function (menuItem, browserWindow, event) {
							editor.setTheme(fulltheme);
							db.set('editor_theme', fulltheme);
						}.bind(_this2),
						type: 'radio',
						checked: editor.getTheme() === fulltheme
					}));
				});
			}
			e.stopPropagation();
			e.preventDefault();
			editorMenu.popup(remote.getCurrentWindow());
		}
	}]);

	return Editor;
}(_react2.default.Component);

Editor.defaultProps = {};
Editor.propTypes = {};
exports.default = Editor;