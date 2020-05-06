import React, { Component } from 'react';
import { BoxSplit } from '../../../../utilities/index';

class StatusStats extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let { statuses } = this.props;
		let width = window.innerWidth;
		let statusBox = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: width >= 1500 ? '75%' : '90%' };
		return (
			<BoxSplit width="35%" className="card" align="flex-start">
				<h4 style={{ margin: '0 0 0 5%', padding: '0' }} className="left-align">
					Status %
				</h4>
				<div style={{ width: '100%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
					<div style={statusBox}>
						<h6>Critical %</h6>
						{statuses ? <p>{((statuses.critical / statuses.total) * 100).toFixed(0)}%</p> : null}
					</div>
					<div style={statusBox}>
						<h6>URGENT %</h6>
						{statuses ? <p>{((statuses.urgent / statuses.total) * 100).toFixed(0)}%</p> : null}
					</div>
					<div style={statusBox}>
						<h6>Average Google Rating</h6>
						{statuses ? <p>{statuses.avgGRating} Stars</p> : null}
					</div>
					<div style={statusBox}>
						<h6>Average LL Rating</h6>
						{statuses ? <p>{statuses.avgLLRating} Stars</p> : null}
					</div>
					<div style={statusBox}>
						<h6>Average Rating Difference</h6>
						{statuses ? <p>{Math.abs(statuses.avgLLRating - statuses.avgGRating).toFixed(2)} Stars</p> : null}
					</div>
				</div>
			</BoxSplit>
		);
	}
}

export default StatusStats;
