import React, { Component } from 'react';
import { BoxSplit } from '../../../../utilities/index';

class ActionStats extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let { sentStats } = this.props;
		let width = window.innerWidth;
		let statusBox = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: width >= 1500 ? '75%' : '90%' };
		return (
			<BoxSplit width="25%" padding="0" align="flex-start" className="card">
				<h4 style={{ margin: '0 0 0 5%', padding: '0' }} className="left-align">
					Total Actions
				</h4>
				<div style={{ width: '100%', height: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
					<div style={statusBox}>
						<h6>Sent</h6>
						{<h6>{sentStats.sent}</h6>}
					</div>
					<div style={statusBox}>
						<h6>Opened</h6>
						<h6>{sentStats.opened}</h6>
						{/* {stats ? <p>{parseInt(stats.Opened).toLocaleString()} </p> : null}
            {stats ? <p>{((stats.Opened / stats.EmailSent) * 100).toFixed(1)} % </p> : null} */}
					</div>
					<div style={statusBox}>
						<h6>Received</h6>
						<h6>{sentStats.received}</h6>

						{/* {stats ? <p>{parseInt(stats.Received).toLocaleString()} </p> : null}
            {stats ? <p>{((stats.Received / stats.EmailSent) * 100).toFixed(1)} % </p> : null}
            {stats ? <p>{((stats.Received / stats.Opened) * 100).toFixed(1)} % </p> : null} */}
					</div>
					<div style={statusBox}>
						<h6>Clicked</h6>
						<h6>{sentStats.clicked}</h6>
						{/* {stats ? <p>{parseInt(stats.Clicked).toLocaleString()} </p> : null}
            {stats ? <p>{((stats.Clicked / stats.EmailSent) * 100).toFixed(1)} % </p> : null}
            {stats ? <p>{((stats.Clicked / stats.Opened) * 100).toFixed(1)} % </p> : null}
            {stats ? <p>{((stats.Clicked / stats.Received) * 100).toFixed(1)} % </p> : null} */}
					</div>
					<div style={statusBox}>
						<h6>{''}</h6>
					</div>
					<div style={statusBox}>
						<h6>{''}</h6>
					</div>
					<div style={statusBox}>
						<h6>{''}</h6>
					</div>
				</div>
			</BoxSplit>
		);
	}
}

export default ActionStats;
