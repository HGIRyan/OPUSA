import React, { useState } from 'react';
import { NoDiv, LoadingWrapperSmall } from '../../../../utilities/index';
import axios from 'axios';

function BusKeys(props) {
	let { og } = props;
	const [saving, setSave] = useState(false);
	const [activating, setActive] = useState(false);
	const [sf_id, setSF] = useState(() => og.c_api.salesforce.sf_id);
	const [am, setAm] = useState(() => og.c_api.salesforce.accountManager.name);
	const [cor_id, setCor_id] = useState(() => og.cor_id);
	let Update = async () => {
		setSave(true);
		let { company_name, place_id, address, geo, phone, utc_offset, owner_name, email, active_prod, c_api } = og;
		let state = {
			NAState: address.state,
			country: 'United States',
			businessName: company_name,
			street: address.street,
			city: address.city,
			zip: address.zip,
			state: address.state,
			phone: phone.phone[0],
			ownerFirst: owner_name.first,
			ownerLast: owner_name.last,
			email: email.email[0] ? email.email[0] : '',
			UTC: utc_offset,
			lat: geo.lat ? geo.lat.toFixed(2) : '',
			lng: geo.lng ? geo.lng.toFixed(2) : '',
			placeId: place_id,
			reviews: active_prod.reviews,
			winbacks: active_prod.winback,
			leadgen: active_prod.leadgen,
			cross_sell: active_prod.cross_sell,
			ref: active_prod.referral,
			og,
			googleRes: [],
			searching: false,
			business_id: c_api.gatherup.business_id,
			client_id: c_api.gatherup.client_id,
			agent_id: c_api.internal,
			c_api,
			sf_id,
			am,
		};
		// state.c_api.salesforce.sf_id = sf_id;
		// state.c_api.salesforce.accountManager.name = am;
		await axios.post('/api/update/business_details', { state }).then(async (res) => {
			console.log(res.data);
			if (res.data.msg === 'GOOD') {
				if (Array.isArray(props.location.state)) {
					await props.history.replace(
						props.location.state.map((item, i) => {
							if (item.c_id === res.data.info.c_id) {
								props.location.state.splice(i, 1, res.data.info);
							}
							return null;
						}),
					);
				}
				props.location.state.info.map((e) => (e = parseInt(e.c_id) === parseInt(res.data.info.c_id) ? res.data.info : e));
				props.location.state.info.splice(
					props.location.state.info.findIndex((e) => parseInt(e.c_id) === parseInt(res.data.info.c_id)),
					1,
					res.data.info,
				);
				props.history.replace(props.location.pathname, props.location.state);
				// await window.location.reload();
			}
		});
	};
	let activate = async () => {
		let { c_id, active } = this.state.og;
		this.setState({ activating: true });
		await axios.post('/api/set-active', { c_id, active }).then((res) => {
			if (res.data.msg === 'GOOD') {
				if (Array.isArray(this.props.location.state.info)) {
					// eslint-disable-next-line
					this.props.location.state.info.splice(
						this.props.location.state.info.findIndex((e) => parseInt(e.c_id) === parseInt(res.data.company.c_id)),
						1,
						res.data.company,
					);
					this.props.history.replace(this.props.location.pathname, this.props.location.state);
				}
			} else {
				alert(res.data.msg);
			}
		});
	};
	let syncSF = async () => {
		if (process.env.REACT_APP_SF_SECURITY_TOKEN) {
			let { og } = this.state;
			await axios.post('/api/sync/salesforce', { og }).then((res) => {
				if (res.data.msg === 'GOOD') {
					this.props.location.state.info.splice(
						this.props.location.state.info.findIndex((e) => parseInt(e.c_id) === parseInt(res.data.og.c_id)),
						1,
						res.data.og,
					);
					this.props.history.replace(this.props.location.pathname, this.props.location.state);
				} else {
					alert(res.data.msg);
				}
			});
		}
	};
	let syncInternal = async () => {
		let { og } = this.state;
		if (og.c_api.internal) {
			await axios.post('/api/sync/internal', { og }).then(async (res) => {
				if (res.data.msg === 'GOOD') {
					await axios.get('/api/ll/resetsession').then(async (res) => {
						if (res.data.msg === 'GOOD') {
							this.setState({ reseting: false });
							this.props.history.replace('/home', res.data.session);
							window.location.reload();
						} else {
							alert(res.data.msg);
						}
					});
				} else {
					alert(res.data.msg);
				}
			});
		} else {
			alert('You need to Input and Save Internal Info');
		}
	};
	let syncHGatherup = async () => {
		let { og } = this.state;
		if (og.c_api.gatherup.business_id && og.c_api.gatherup.client_id) {
			await axios.post('/api/sync/gatherup', { og }).then(async (res) => {
				if (res.data.msg === 'GOOD') {
					await axios.get('/api/ll/resetsession').then(async (res) => {
						if (res.data.msg === 'GOOD') {
							this.setState({ reseting: false });
							this.props.history.replace('/home', res.data.session);
							window.location.reload();
						} else {
							alert(res.data.msg);
						}
					});
				} else {
					alert(res.data.msg);
				}
			});
		} else {
			alert('You need to Input and Save Gatherup Info');
		}
	};
	return (
		<>
			<NoDiv just="flex-start" width="50%" align="center">
				<h3 style={{ right: '30%', position: 'relative' }} className="noselect">
					Business Details
				</h3>
				<NoDiv>
					<button className="btn primary-color primary-hover" onClick={() => window.location.reload()} style={{ marginRight: '5%' }}>
						Revert
					</button>
					<LoadingWrapperSmall loading={saving}>
						<button className="btn primary-color primary-hover" onClick={() => Update()}>
							Update/Save
						</button>
					</LoadingWrapperSmall>
				</NoDiv>
				<div
					style={{
						marginLeft: '20%',
						padding: '0',
						color: 'red !important',
						boxShadow: `10px 0px 10px ${og.active ? 'red' : 'green'}`,
					}}
				>
					<LoadingWrapperSmall loading={activating}>
						<button className="btn primary-color primary-hover" onClick={() => activate()}>
							{og.active ? 'DeActivate' : 'Activate'}
						</button>
					</LoadingWrapperSmall>
				</div>
			</NoDiv>
			<hr style={{ marginBottom: '5vh' }} />
			<div style={{ width: '65vw', display: 'flex', flexDirection: 'space-between', alignItems: 'flex-start' }} className="card noselect">
				<div style={{ width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<h4>API Keys/Id's</h4>
					<hr />
					<h6 style={{ textDecoration: 'underline' }}>SalesForce</h6>
					<div className="input-field" style={{ width: '70%' }}>
						<h2 style={{ margin: '0' }}>
							{/* <input id="sf_id" type="text" className="validate" value={sf_id} onChange={(e) => this.setState({ sf_id: e.target.value })} /> */}
							<input id="sf_id" type="text" className="validate" value={sf_id} onChange={(e) => setSF(e.target.value)} />
						</h2>
						<label htmlFor="sf_id">SalesForce ID: </label>
					</div>
					<div className="input-field" style={{ width: '70%' }}>
						<h2 style={{ margin: '0' }}>
							<input id="am" type="text" className="validate" value={am} onChange={(e) => setAm(e.target.value)} />
						</h2>
						<label htmlFor="am">Account Manager: </label>
					</div>
				</div>
				<div style={{ width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<h4>Other</h4>
					<hr />
					<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<div className="input-field" style={{ width: '70%' }}>
							<h2 style={{ margin: '0' }}>
								<input
									id="cor_id"
									type="text"
									className="validate"
									value={cor_id}
									onChange={(e) => (/^\d*$/.test(e.target.value) && e.target.value.length <= 7 ? setCor_id(e.target.value) : null)}
								/>
							</h2>
							<label htmlFor="cor_id">cor_id: </label>
						</div>
						{/* <div
							style={{
								display: 'flex',
								width: '75%',
								flexDirection: 'column',
								alignItems: 'flex-start',
								justifyContent: 'space-around',
								minHeight: '25vh',
							}}
						> */}
						<button className="btn primary-color primary-hover" onClick={() => syncSF()} data-tip data-for="SF">
							Sync W/ SF
						</button>
						{/* <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
								2.
								<button className="btn primary-color primary-hover" onClick={() => syncHGatherup()} data-tip data-for="Gatherup">
									Sync W/ Gatherup
								</button>
							</div>
							<div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
								3.
								<button className="btn primary-color primary-hover" onClick={() => syncInternal()} data-tip data-for="Internal">
									Sync W/ Internal
								</button>
							</div> */}
						{/* </div> */}
					</div>
				</div>
			</div>
		</>
	);
}

export default BusKeys;
