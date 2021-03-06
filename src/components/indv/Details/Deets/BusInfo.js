import React, { Component } from 'react';
import moment from 'moment';
import { Select } from 'react-materialize';
import { NoDiv, LoadingWrapperSmall } from '../../../../utilities/index';
import axios from 'axios';

class BusInfo extends Component {
	constructor() {
		super();

		this.state = {
			edit: false,
			googleRes: [],
		};
	}
	componentDidMount() {
		let { og } = this.props;
		this.setState({ og });
		this.settingState(og);
	}
	async settingState(info) {
		let { company_name, place_id, address, geo, phone, utc_offset, owner_name, email, active_prod, c_api } = info;
		if (process.env.REACT_APP_SF_SECURITY_TOKEN) {
			c_api.salesforce.accountManager.name = c_api.salesforce.accountManager.name ? c_api.salesforce.accountManager.name : '';
			c_api.internal = c_api.internal ? c_api.internal : '';
		}
		this.setState({
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
			og: info,
			googleRes: [],
			searching: false,
			sf_id: process.env.REACT_APP_SF_SECURITY_TOKEN ? c_api.salesforce.sf_id : '',
			am: process.env.REACT_APP_SF_SECURITY_TOKEN ? c_api.salesforce.accountManager.name : '',
			business_id: c_api.gatherup.business_id,
			client_id: c_api.gatherup.client_id,
			agent_id: c_api.internal,
		});
	}
	async Update() {
		let state = this.state;
		this.setState({ saving: true });
		await axios.post('/api/update/business_details', { state }).then(async (res) => {
			if (res.data.msg === 'GOOD') {
				this.setState({ edit: false, saving: false });
				this.settingState(res.data.info);
				if (Array.isArray(this.props.location.state)) {
					await this.props.history.replace(
						this.props.location.state.map((item, i) => {
							if (item.c_id === res.data.info.c_id) {
								this.props.location.state.splice(i, 1, res.data.info);
							}
							return null;
						}),
					);
				}
				this.props.location.state.info.map((e) => (e = parseInt(e.c_id) === parseInt(res.data.info.c_id) ? res.data.info : e));
				this.props.location.state.info.splice(
					this.props.location.state.info.findIndex((e) => parseInt(e.c_id) === parseInt(res.data.info.c_id)),
					1,
					res.data.info,
				);
				this.props.history.replace(this.props.location.pathname, this.props.location.state);
				// await window.location.reload();
			}
		});
	}
	async GoogleLookup(searchTerm) {
		this.setState({ searching: true });
		await axios.post('/api/google/place/search', { searchTerm }).then((res) => {
			res = res.data;
			if (res.msg === 'GOOD') {
				this.setState({ googleRes: res.data, searching: false });
			}
		});
	}
	async GoogleDetails(placeId) {
		this.setState({ searching: true });
		await axios.post('/api/google/place/placeid/details', { placeId }).then((res) => {
			console.log(res.data);
			if (res.data.msg === 'GOOD') {
				if (res.data.data) {
					let { og } = this.state;
					let data = res.data.data;
					let address = data.formatted_address.split(',');
					let street = address[0];
					let country = 'United States';
					let state = address[2].split(' ')[1];
					let city = address[1];
					let zip = address[2].split(' ')[2];
					let geo = { lat: data.geometry.location.lat, lng: data.geometry.location.lng };
					let timezone = data.utc_offset;
					og.utc_offset = timezone;
					og.company_name = data.name;
					let phone = data.international_phone_number;
					og.address = { street, city, state, country, zip };
					og.phone.phone.splice(0, 1, phone);
					og.geo = geo;
					og.place_id = placeId;
					this.settingState(og);
				}
			}
		});
	}
	async activate() {
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
	}
	render() {
		let { edit } = this.state;
		let { cor_id, client_id } = this.props.match.params;
		let permission = this.props.location.state.permissions;
		edit = permission === 'admin' ? edit : false;

		return this.state.og ? (
			<>
				<NoDiv just="flex-start" width="50%" align="center">
					<h3
						style={{ right: '30%', position: 'relative', cursor: edit ? 'pointer' : null }}
						onClick={() =>
							edit && permission === 'admin' && process.env.REACT_APP_SF_SECURITY_TOKEN
								? this.props.history.replace(`/client-dash/${cor_id}/business-details/${client_id}/business-keys`, this.props.location.state)
								: null
						}
						className="noselect"
					>
						Business Details
					</h3>
					{permission === 'admin' ? (
						edit ? (
							<NoDiv>
								<button className="btn primary-color primary-hover" onClick={() => window.location.reload()} style={{ marginRight: '5%' }}>
									Revert
								</button>
								<LoadingWrapperSmall loading={this.state.saving}>
									<button className="btn primary-color primary-hover" onClick={() => this.Update()}>
										Update/Save
									</button>
								</LoadingWrapperSmall>
							</NoDiv>
						) : (
							<button className="btn primary-color primary-hover" onClick={() => this.setState({ edit: true })}>
								Edit
							</button>
						)
					) : null}
					{edit ? (
						<div style={{ marginLeft: '20%', padding: '0', color: 'red !important', boxShadow: `10px 0px 10px ${this.state.og.active ? 'red' : 'green'}` }}>
							<LoadingWrapperSmall loading={this.state.activating}>
								<button className="btn primary-color primary-hover" onClick={() => this.activate()}>
									{this.state.og.active ? 'DeActivate' : 'Activate'}
								</button>
							</LoadingWrapperSmall>
						</div>
					) : null}
				</NoDiv>
				<hr style={{ marginBottom: '5vh' }} />
				{permission === 'admin' ? (
					<div style={{ width: '65vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', margin: '0', marginTop: '-4.5vh' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', width: '40%' }}>
							<button
								className="btn primary-color primary-hover"
								onClick={() => this.props.history.replace(`/client-dash/${cor_id}/business-details/${client_id}/add-user`, this.props.location.state)}
							>
								Add New User
							</button>
							<button
								className="btn primary-color primary-hover"
								onClick={() => {
									this.props.history.replace(`/client-dash/${cor_id}/business-details/${client_id}/view-users`, this.props.location.state);
								}}
							>
								View All Users
							</button>
						</div>
					</div>
				) : null}

				<div style={{ display: 'flex', width: '65vw' }} className="card">
					<div style={{ display: 'flex', flexDirection: 'column', width: '45%', alignItems: 'center', marginRight: '5%' }}>
						<h5>Business Info</h5>
						<hr />
						<div className="input-field" style={{ width: '70%' }}>
							<h2 style={{ margin: '0' }}>
								<input
									id="bussiness_name"
									type="text"
									className="validate"
									value={this.state.businessName}
									onChange={(e) => this.setState({ businessName: e.target.value })}
									disabled={edit ? '' : 'disabled'}
								/>
								<button
									className="btn primary-color primary-hover"
									disabled={edit ? '' : 'disabled'}
									onClick={() => this.GoogleLookup(this.state.businessName)}
								>
									Search
								</button>
							</h2>
							<label htmlFor="business_name">Business Name:</label>
							<LoadingWrapperSmall loading={this.state.searching}>
								<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
									{this.state.googleRes.map((e, i) => (
										<div
											onClick={() => this.GoogleDetails(e.place_id)}
											key={i}
											className="card hoverable"
											style={{
												width: '100%',
												minHeight: '5vh',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'flex-start',
												margin: '1.5% 0',
												cursor: 'pointer',
											}}
										>
											{e.description}
										</div>
									))}
								</div>
							</LoadingWrapperSmall>
						</div>
						<div className="input-field" style={{ width: '70%' }}>
							<h2 style={{ margin: '0' }}>
								<input
									id="street"
									type="text"
									className="validate"
									value={this.state.street}
									onChange={(e) => this.setState({ street: e.target.value })}
									disabled={edit ? '' : 'disabled'}
								/>
							</h2>
							<label htmlFor="street">Street Address: </label>
						</div>
						<div className="input-field" style={{ width: '70%' }}>
							<h2 style={{ margin: '0' }}>
								<input
									id="city"
									type="text"
									className="validate"
									value={this.state.city}
									onChange={(e) => this.setState({ city: e.target.value })}
									disabled={edit ? '' : 'disabled'}
								/>
							</h2>
							<label htmlFor="city">City: </label>
						</div>
						<div style={{ display: 'flex', alignItems: 'flex-start', width: '70%', justifyContent: 'space-between' }}>
							<div className="input-field">
								<Select name="state" onChange={(e) => this.setState({ state: e.target.value })} value={this.state.state} disabled={edit ? false : true}>
									<option value="AL">Alabama</option>
									<option value="AK">Alaska</option>
									<option value="AZ">Arizona</option>
									<option value="AR">Arkansas</option>
									<option value="CA">California</option>
									<option value="CO">Colorado</option>
									<option value="CT">Connecticut</option>
									<option value="DE">Delaware</option>
									<option value="DC">District Of Columbia</option>
									<option value="FL">Florida</option>
									<option value="GA">Georgia</option>
									<option value="HI">Hawaii</option>
									<option value="ID">Idaho</option>
									<option value="IL">Illinois</option>
									<option value="IN">Indiana</option>
									<option value="IA">Iowa</option>
									<option value="KS">Kansas</option>
									<option value="KY">Kentucky</option>
									<option value="LA">Louisiana</option>
									<option value="ME">Maine</option>
									<option value="MD">Maryland</option>
									<option value="MA">Massachusetts</option>
									<option value="MI">Michigan</option>
									<option value="MN">Minnesota</option>
									<option value="MS">Mississippi</option>
									<option value="MO">Missouri</option>
									<option value="MT">Montana</option>
									<option value="NE">Nebraska</option>
									<option value="NV">Nevada</option>
									<option value="NH">New Hampshire</option>
									<option value="NJ">New Jersey</option>
									<option value="NM">New Mexico</option>
									<option value="NY">New York</option>
									<option value="NC">North Carolina</option>
									<option value="ND">North Dakota</option>
									<option value="OH">Ohio</option>
									<option value="OK">Oklahoma</option>
									<option value="OR">Oregon</option>
									<option value="PA">Pennsylvania</option>
									<option value="RI">Rhode Island</option>
									<option value="SC">South Carolina</option>
									<option value="SD">South Dakota</option>
									<option value="TN">Tennessee</option>
									<option value="TX">Texas</option>
									<option value="UT">Utah</option>
									<option value="VT">Vermont</option>
									<option value="VA">Virginia</option>
									<option value="WA">Washington</option>
									<option value="WV">West Virginia</option>
									<option value="WI">Wisconsin</option>
									<option value="WY">Wyoming</option>
								</Select>
								<label>State</label>
							</div>
							<div className="input-field" style={{ height: '5vh', marginTop: '2.5%' }}>
								<h2 style={{ margin: '0' }}>
									<input value={this.state.zip} onChange={(e) => this.setState({ zip: e.target.value })} disabled={edit ? '' : 'disabled'} />
								</h2>
								<label>Zip Code</label>
							</div>
						</div>
						<div className="input-field" style={{ width: '70%' }}>
							<label style={{ margin: '0' }}>Country</label>
							<Select name="country" onChange={(e) => this.setState({ country: e.target.value })} value={this.state.country} disabled={edit ? false : true}>
								<option value="Select Country">Select Country</option>
								<option value="United States">United States</option>
								<option value="Canada">Canada</option>
							</Select>
						</div>
						<div style={{ display: 'flex', width: '70%', justifyContent: 'space-between' }}>
							<div className="input-field">
								<h2 style={{ margin: '0' }}>
									<input value={this.state.phone} onChange={(e) => this.setState({ phone: e.target.value })} disabled={edit ? '' : 'disabled'} />
								</h2>
								<label>Phone Number</label>
							</div>
							<div className="input-field">
								<h2 style={{ margin: '0' }}>
									<input value={this.state.website} onChange={(e) => this.setState({ website: e.target.value })} readOnly disabled="disabled" />
								</h2>
								<label>Website</label>
							</div>
						</div>
						<h5>Technicals</h5>
						<hr />
						<div className="input-field" style={{ width: '70%' }}>
							<h2 style={{ margin: '0' }}>
								<input value={this.state.UTC} onChange={(e) => this.setState({ UTC: e.target.value })} readOnly disabled="disabled" />
							</h2>
							<label> UTC Offset</label>
						</div>
						<div style={{ width: '70%' }}>
							<div style={{ display: 'flex' }}>
								<div className="input-field">
									<h2 style={{ margin: '0' }}>
										<input value={this.state.lat} onChange={(e) => this.setState({ lat: e.target.value })} readOnly disabled="disabled" />
									</h2>
									<label>LAT</label>
								</div>
								<div className="input-field">
									<h2 style={{ margin: '0' }}>
										<input value={this.state.lng} onChange={(e) => this.setState({ lat: e.target.value })} readOnly disabled="disabled" />
									</h2>
									<label>LNG</label>
								</div>
							</div>
							<div className="input-field" style={{ width: '70%' }}>
								<h2 style={{ margin: '0' }}>
									<input value={this.state.placeId} onChange={(e) => this.setState({ placeId: e.target.value })} readOnly disabled="disabled" />
									<a
										className="btn primary-color primary-hover"
										target="_blank"
										rel="noopener noreferrer"
										href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${this.state.placeId}`}
									>
										Google.com
									</a>
								</h2>
								<label>Place ID</label>
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', width: '45%', marginLeft: '5%', alignItems: 'center' }}>
						<h5>Owner Info</h5>
						<h5 style={{ color: 'gray', margin: '0', padding: '0' }}>Business Added: {moment(this.state.og.created).format('MMM Do, YY')}</h5>
						<hr />
						<div style={{ display: 'flex', width: '70%', justifyContent: 'space-between' }}>
							<div className="input-field">
								<h2 style={{ margin: '0' }}>
									<input value={this.state.ownerFirst} onChange={(e) => this.setState({ ownerFirst: e.target.value })} disabled={edit ? '' : 'disabled'} />
								</h2>
								<label> Owner First Name</label>
							</div>
							<div className="input-field">
								<h2 style={{ margin: '0' }}>
									<input value={this.state.ownerLast} onChange={(e) => this.setState({ ownerLast: e.target.value })} disabled={edit ? '' : 'disabled'} />
								</h2>
								<label> Owner Last Name</label>
							</div>
						</div>
						<div className="input-field" style={{ width: '70%' }}>
							<h2 style={{ margin: '0' }}>
								<input value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} disabled={edit ? '' : 'disabled'} />
							</h2>
							<label> Owner Email</label>
						</div>
						<h5>Purchased Products</h5>
						<hr />
						<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%', marginTop: '2.5%' }}>
							<input
								type="checkbox"
								checked={this.state.reviews}
								onChange={() => this.setState({ reviews: !this.state.reviews })}
								disabled={edit ? '' : 'disabled'}
							/>
							<span className="tab">Review Gen</span>
						</label>
						<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
							<input
								type="checkbox"
								checked={this.state.winbacks}
								onChange={() => this.setState({ winbacks: !this.state.winbacks })}
								disabled={edit ? '' : 'disabled'}
							/>
							<span className="tab">Winbacks</span>
						</label>
						<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
							<input
								type="checkbox"
								checked={this.state.leadgen}
								onChange={() => this.setState({ leadgen: !this.state.leadgen })}
								disabled={edit ? '' : 'disabled'}
							/>
							<span className="tab">Lead Gen</span>
						</label>
						<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
							<input
								type="checkbox"
								checked={this.state.cross_sell}
								onChange={() => this.setState({ cross_sell: !this.state.cross_sell })}
								disabled={edit ? '' : 'disabled'}
							/>
							<span className="tab">Cross Sell</span>
						</label>
						<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
							<input type="checkbox" checked={this.state.ref} onChange={() => this.setState({ ref: !this.state.ref })} disabled={edit ? '' : 'disabled'} />
							<span className="tab">Referral Gen</span>
						</label>
					</div>
				</div>
			</>
		) : null;
	}
}

export default BusInfo;
