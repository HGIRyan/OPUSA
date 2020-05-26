import React from 'react';
import SentStatsGraph from '../../components/SentStatsGraph';

function SentStats(props) {
	let { open, sent, click, responses } = props;
	let def = { padding: '0', margin: '0', display: 'flex', alignItems: 'center' };
	return (
		<div style={(def, { display: 'flex', flexDirection: 'column', width: '30%', height: '35vh' })} className="card">
			<h4 style={{ width: '100%', paddingLeft: '5%' }} className="left-align">
				Sent Stats
			</h4>
			<div style={{ display: 'flex', height: '90%', width: '100%' }}>
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '30%' }}>
					<SentStatsGraph height="90%" width="60%" sent={sent} open={open} feedback={responses} click={click} />
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						height: '100%',
						width: '60%',
					}}
				>
					<div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1% 0' }}>
						<h4 style={{ margin: '0', padding: '0' }}>Sent</h4>
						<div style={{ display: 'flex', width: '40%', justifyContent: 'space-between' }}>
							<p>{sent}</p>
							<p></p>
						</div>
					</div>
					<div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1% 0' }}>
						<h4 style={{ margin: '0', padding: '0' }}>Open</h4>
						<div style={{ display: 'flex', width: '40%', justifyContent: 'space-between' }}>
							<p>{open}</p>
							<p>{((open / sent) * 100).toFixed(0)}%</p>
						</div>
					</div>
					<div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1% 0' }}>
						<h4 style={{ margin: '0', padding: '0' }}>Feedback</h4>
						<div style={{ display: 'flex', width: '40%', justifyContent: 'space-between' }}>
							<p>{responses}</p>
							<p>{((responses / sent) * 100).toFixed(0)}%</p>
						</div>
					</div>
					<div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1% 0' }}>
						<h4 style={{ margin: '0', padding: '0' }}>Clicks</h4>
						<div style={{ display: 'flex', width: '40%', justifyContent: 'space-between' }}>
							<p>{click}</p>
							<p>{((click / sent) * 100).toFixed(0)}%</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SentStats;
