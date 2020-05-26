import React from 'react';
import { BoxSplit } from '../../../../utilities/index';
import Moment from 'moment';
let sunday = Moment().day(0).format('YYYY-MM-DD');

function ActionStats(props) {
	let { sentStats, info } = props;
	let newReviews, totalReviews;
	if (Array.isArray(info)) {
		info = info.filter((e) => e.reviews.reviews.filter((dat) => dat.date === sunday)[0]?.newReviews >= 0);
		newReviews = info.map((e) => parseInt(e.reviews.reviews.filter((dat) => dat.date === sunday)[0]?.newReviews)).reduce((tot, n) => tot + parseFloat(n));
		totalReviews = info.map((e) => parseInt(e.reviews.reviews.filter((dat) => dat.date === sunday)[0]?.totalReviews)).reduce((tot, n) => tot + parseFloat(n));
	}
	let width = window.innerWidth;
	let statusBox = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: width >= 1500 ? '75%' : '90%' };
	return (
		<BoxSplit width="25%" padding="0" align="flex-start" className="card">
			<h4 style={{ margin: '0 0 0 5%', padding: '0' }} className="left-align">
				Total Actions
			</h4>
			<div style={{ width: '100%', height: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
				<div style={statusBox}>
					<h6>Sent</h6>
					{<h6>{sentStats.sent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>}
				</div>
				<div style={statusBox}>
					<h6>Opened</h6>
					<h6>{sentStats.opened.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>
				</div>
				<div style={statusBox}>
					<h6>Received</h6>
					<h6>{sentStats.received.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>
				</div>
				<div style={statusBox}>
					<h6>Clicked</h6>
					<h6>{sentStats.clicked.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>
				</div>
				{/* <div style={statusBox}>
					<h6>{''}</h6>
				</div>
				<div style={statusBox}>
					<h6>{''}</h6>
				</div>
				<div style={statusBox}>
					<h6>{''}</h6>
				</div> */}
			</div>
			<h4 style={{ margin: '2.5% 0 0 5%', padding: '0' }} className="left-align">
				Reviews
			</h4>
			{Array.isArray(info) ? (
				<div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
					<div style={statusBox}>
						<h6>Total Reviews</h6>
						<h6>{totalReviews.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>
					</div>
					<div style={statusBox}>
						<h6>Last Weeks Reviews</h6>
						<h6>{newReviews.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>
					</div>
				</div>
			) : null}
		</BoxSplit>
	);
}

export default ActionStats;
