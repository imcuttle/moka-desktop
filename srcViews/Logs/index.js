
import React from 'react'
import {Map} from 'immutable'


class Logs extends React.Component {
	constructor(props) {
		super(props)
	}
	componentWillMount() {}
	componentDidMount() {}
	componentWillReceiveProps(newProps) {}
	shouldComponentUpdate(newProps, newState, newContext) {
		return false;
	}
	componentWillUpdate(newProps, newState, newContext) {}
	componentDidUpdate(oldProps, oldState, oldContext) {}
	componentWillUnmount() {}
	static defaultProps = {}
    state = {}
    static propTypes = {}
	render() {
		const {...props} = this.props

		return (
			<div id="logs" ref="logs">
			  	<span className="toggle" onClick={this.toggleLogs.bind(this)}><i className="fa fa-hand-o-right"></i></span>
				<div><p>日志</p></div>
			</div>
		)
	}
	toggleLogs(e) {
		const {logs} = this.refs
		logs.classList.toggle('active');
	}
}

export default Logs;
