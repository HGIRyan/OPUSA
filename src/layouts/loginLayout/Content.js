import React, { Component } from 'react';
import { connect } from 'react-redux';
import {} from './../../utilities/index';

class Content extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		return (
			<div className="marketingImgContainer">
				<img src={process.env.REACT_APP_SITE_MARKETING_LOGO} alt="marketing img" className="marketingImg" />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Content);
