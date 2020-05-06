import React from 'react';
import { Infobox } from '../../../../utilities/index';
import { Select } from 'react-materialize';
import ReactToolTip from 'react-tooltip';
import axios from 'axios';

function KnowledgeCard(props) {
	let p = { margin: '0' };
	let h5 = { marginTop: '1vh' };
	let width = window.innerWidth;
	let { nps, smsSent, emailSent, updateState } = props;
	let { autoAmt, autoPaused, og, bus, lastUpdated } = props.state;
	let updateAuto = async (val, type) => {
		let { c_id, cor_id } = bus[0];
		if (type === 'amt') {
			bus[0].auto_amt = { amt: parseInt(val), pause: autoPaused };
			updateState('autoAmt', val);
		} else if (type === 'check') {
			bus[0].auto_amt = { amt: parseInt(autoAmt), pause: val };
			updateState('autoPaused', val);
		}
		let amt = bus[0].auto_amt;
		await axios.post('/api/update/auto', { amt, c_id, cor_id }).then((res) => {
			if (res.data.msg === 'GOOD') {
				props.location.state.info.splice(
					props.location.state.info.findIndex((e) => parseInt(e.c_id) === parseInt(c_id)),
					1,
					bus[0],
				);
				props.history.replace(props.location.pathname, props.location.state);
			} else {
				alert(res.data.msg);
			}
		});
	};
	return (
		<div style={{ display: 'flex', width: width >= 1500 ? '50%' : '60%', justifyContent: 'space-around', height: '100%' }}>
			<Infobox width="10%" height="80%" className="card">
				<h1
					style={
						(p,
						{
							margin: '7.5% 0 0 0',
							fontWeight: 'bold',
							color: nps <= 0 ? '#ea4335' : nps <= 30 ? '#fbbc05' : nps <= 70 ? '#0396a6' : '#34a853',
						})
					}
				>
					{nps.toString()}
				</h1>
				<br />
				<p style={{ marginTop: '0vh' }}>NPS</p>
			</Infobox>
			<Infobox width="25%" height="80%" className="card">
				<div style={{ display: 'flex' }}>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
						<div className="input-field" style={{ margin: '-15% 0 0 0', padding: '0', width: '50%' }}>
							<Select
								value={autoAmt}
								className="no-border"
								onChange={(e) => updateAuto(e.target.value, 'amt')}
								style={{ margin: '0 !important', padding: '0 !important' }}
							>
								<option value="0">Pause</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
								<option value="15">15</option>
							</Select>
						</div>
						<br />
						<p style={{ marginTop: '-10%' }}>Auto AMT</p>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
						<div className="" style={{ padding: '0', width: '50%', margin: '15% 0 0 0' }}>
							<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%', marginTop: '2.5%' }}>
								<input type="checkbox" checked={autoPaused} onChange={(e) => updateAuto(!autoPaused, 'check')} />
								<span className="tab"></span>
							</label>
						</div>
						<br />
						<p style={{ marginTop: '-10%' }}>Manual Override</p>
					</div>
				</div>
			</Infobox>
			<Infobox width="30%" className="card" height="80%">
				<p style={(h5, { padding: '0' })}>Monthly Sends</p>
				<Infobox direction="row" width="100%" margin="-2.5% 0 0 0">
					<Infobox width="50%">
						<h4 style={p}>{smsSent}</h4>
						<h6 style={p}>SMS</h6>
					</Infobox>
					<Infobox width="50%">
						<h4 style={p}>{emailSent}</h4>
						<h6 style={p}>email</h6>
					</Infobox>
				</Infobox>
			</Infobox>
			<Infobox width="30%" height="80%" className="card" data-tip data-for="last_sent">
				<p style={(h5, { padding: '0' })}>Total Customer Profiles</p>
				<Infobox margin="-2.5% 0 0 0">
					<Infobox width="100%">
						<h4 style={(p, { marginTop: '-15%' })}>
							{og
								.filter((e) => e.active)
								.length.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/
							{og
								.filter((e) => !e.active)
								.length.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						</h4>
						{props.location.state.permissions === 'admin' ? (
							<h6 style={(p, { marginTop: '-45%' })}>
								Remaining:{' '}
								{bus[0].c_id ? bus[0].customers.reviews[bus[0].customers.reviews.length - 1].remaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0}
							</h6>
						) : null}
						<h6 style={(p, { marginTop: '-25%' })}>Total: {og.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>
					</Infobox>
				</Infobox>
				<ReactToolTip id="last_sent" type="dark" effect="float" place="bottom">
					<span>
						Active Contacts / Inactive Contacts
						<br />
						{props.location.state.permissions === 'admin' ? 'Total Names Remaining To Send Requests' : ''}
						<br />
						Total Contacts
						<br />
						Date of last List Upload: {lastUpdated.split('T')[0]}
					</span>
				</ReactToolTip>
			</Infobox>
		</div>
	);
}

export default KnowledgeCard;
