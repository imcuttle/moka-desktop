'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Logs = function (_React$Component) {
	_inherits(Logs, _React$Component);

	function Logs(props) {
		_classCallCheck(this, Logs);

		var _this = _possibleConstructorReturn(this, (Logs.__proto__ || Object.getPrototypeOf(Logs)).call(this, props));

		_this.state = {};
		return _this;
	}

	_createClass(Logs, [{
		key: 'componentWillMount',
		value: function componentWillMount() {}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(newProps) {}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(newProps, newState, newContext) {
			return false;
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

			return _react2.default.createElement(
				'div',
				{ id: 'logs', ref: 'logs' },
				_react2.default.createElement(
					'span',
					{ className: 'toggle', onClick: this.toggleLogs.bind(this) },
					_react2.default.createElement('i', { className: 'fa fa-hand-o-right' })
				),
				_react2.default.createElement(
					'div',
					null,
					_react2.default.createElement(
						'p',
						null,
						'\u65E5\u5FD7'
					)
				)
			);
		}
	}, {
		key: 'toggleLogs',
		value: function toggleLogs(e) {
			var logs = this.refs.logs;

			logs.classList.toggle('active');
		}
	}]);

	return Logs;
}(_react2.default.Component);

Logs.defaultProps = {};
Logs.propTypes = {};
exports.default = Logs;