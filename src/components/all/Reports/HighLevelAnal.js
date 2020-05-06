import React, { Component } from 'react';
import { connect } from 'react-redux';
// import axios from 'axios';
import { Layout1 } from '../../../utilities/index';

class HighLevelAnal extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		return (
			<Layout1 view={{ sect: 'all', sub: 'reports', type: 'reviews' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				High Level Anal
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(HighLevelAnal);
