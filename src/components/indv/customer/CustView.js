import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv, LoadingWrapperSmall } from './../../../utilities/index';
import axios from 'axios';
const { detect } = require('detect-browser');
const browser = detect();

class CustView extends Component {
	constructor() {
		super();

		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			activity: [],
			edit: false,
			ogInfo: {},
			og: {},
			bus: { c_id: 24, owner_name: { first: 'Boi' }, company_name: process.env.REACT_APP_COMPANY_NAME },
			loading: true,
			saving: false,
			process: false,
			feedback_text: '',
			rating: 0,
		};
	}

	async componentDidMount() {
		this.axiosCancelSource = axios.CancelToken.source();
		let { cust_id, client_id, cor_id } = this.props.match.params;
		let item = this.props.location.state.info.filter(item => item.c_id === parseInt(client_id));
		if (item[0]) {
			this.setState({ bus: item[0] });
			if (browser.name !== 'chrome') {
				this.notChrome();
			} else {
				if (this.props.location.state.focus_cust[0]) {
					if (this.props.location.state.focus_cust[0].cor_id === parseInt(cor_id)) {
						let cust = this.props.location.state.focus_cust.filter(e => e.cus_id === parseInt(cust_id));
						if (cust[0]) {
							let { first_name, last_name, email, phone, activity, rating } = cust[0];
							this.settingState({ first_name, last_name, email, phone, activity, rating, item, cust });
						} else {
							// GET CUSTOMERS
							console.log('Get');
							await this.getCust(parseInt(cor_id));
						}
					} else {
						console.log('Get 1');
						// GET CUSTOMERS
						await this.getCust(parseInt(cor_id));
					}
				} else {
					console.log('Get 2');
					// GET CUSTOMERS
					await this.getCust(parseInt(cor_id));
				}
			}
		}
	}
	async notChrome() {
		let { client_id, cor_id } = this.props.match.params;
		let getCust = async comp => {
			let cust = await axios.get(`/api/indv/comp/customers/${client_id}`, { cancelToken: this.axiosCancelSource.token });
			if (cust.data.msg === 'GOOD') {
				let cus = cust.data.info.filter(e => e.cus_id === parseInt(this.props.match.params.cust_id));
				console.log(cus[0]);
				if (cus[0]) {
					let { first_name, last_name, email, phone, activity, rating } = cus[0];
					await this.settingState({ item: comp, cust: cus, first_name, last_name, email, phone, activity, rating });
				}
			} else {
				await this.settingState(comp, []);
			}
		};
		let getComp = async () => {
			let comp = await axios.get(`/api/home/info/${cor_id}`, { cancelToken: this.axiosCancelSource.token });
			this.props.location.state.info = comp.data.info;
			this.props.history.replace(this.props.location.pathname, this.props.location.state);
		};
		if (Array.isArray(this.props.location.state.info)) {
			let item = this.props.location.state.info.filter(e => e.c_id === parseInt(client_id));
			if (item[0]) {
				// GET CUSTOMERS
				this.setState({ bus: item });
				await getCust(item);
			} else {
				// GET COMPANY
				await getComp();
			}
		} else {
			await getComp();
		}
	}
	settingState({ first_name, last_name, email, phone, activity, rating, item, cust }) {
		document.title = `${first_name} ${last_name} - ${item[0].company_name}`;
		phone = phone ? phone : 'N/A';
		this.setState({
			firstName: first_name.toProper(),
			lastName: last_name.toProper(),
			email: email.toProper(),
			phone,
			rating,
			feedback_text: cust[0].feedback_text,
			activity: activity.active,
			ogInfo: cust[0],
			loading: false,
		});
	}
	componentWillUnmount() {
		this.axiosCancelSource.cancel('Component unmounted.');
	}
	async getCust(cor_id) {
		await axios.get(`/api/indv/customers/${cor_id}`, { cancelToken: this.axiosCancelSource.token }).then(res => {
			res = res.data;
			if (res.msg === 'GOOD') {
				if (res.info[0]) {
					this.props.location.state.focus_cust = res.info;
					this.props.history.replace(this.props.location.pathname, this.props.location.state);
				} else {
					// this.setState({ info: [{ cus_id: 0, first_name: 'No', last_name: 'Customer', active: true, activity: { active: [{ type: 'NO CUSTOMERS' }] } }] });
				}
			} else {
				if (res.msg === 'NO SESSION') {
					res.msg = 'You Have Been Disconnected From The Server';
				}
				alert(res.msg + ' Click "OK" To Be Redirected To Login');
				this.props.history.push('/');
			}
		});
	}
	async revert() {
		let { edit, ogInfo } = this.state;
		if (edit) {
			let { first_name, last_name, email, phone } = ogInfo;
			phone = phone ? phone : 'N/A';
			this.setState({ firstName: first_name, lastName: last_name, email, phone, edit: false });
		} else {
			this.setState({ edit: true });
		}
	}
	async update() {
		this.setState({ saving: true });
		let { firstName, lastName, email, phone } = this.state;
		let { cust_id } = this.props.match.params;
		await axios.post('/api/update/customerinfo', { firstName, lastName, email, phone, cust_id }).then(async res => {
			if (res.data.msg === 'GOOD') {
				let { updated } = res.data;
				let { first_name, last_name, email, phone, activity } = res.data.updated;
				phone = phone ? phone : 'N/A';
				this.setState({
					firstName: first_name,
					lastName: last_name,
					email,
					phone,
					activity: activity.active,
					ogInfo: res.data.updated,
					edit: false,
					saving: false,
				});
				this.props.location.state.focus_cust.splice(
					this.props.location.state.focus_cust.findIndex(e => e.cust_id === cust_id),
					1,
					updated,
				);
				// await this.props.history.replace(this.props.location.pathname, this.props.location.state);
				// await history.replace({ ...history.location.state, updated });
			} else {
				alert('Something Went Wrong');
			}
		});
	}
	async SendRequest() {
		this.setState({ process: true });
		let { bus } = this.state;
		let type = { subject: 's_subject', email: 's' };
		bus = Array.isArray(bus) ? bus[0] : bus;
		let selected = [this.state.ogInfo];
		await axios.post('/api/request/send', { selected, bus, type }).then(async res => {
			if (res.data.msg === 'GOOD') {
				this.setState({ process: false });
				alert(`Sent ${res.data.sent} email${res.data.sent > 1 ? 's' : ''}`);
			} else {
				alert(res.data.msg);
			}
		});
	}
	async unsubscribe() {
		this.setState({ unsubing: true });
		let { cor_id, cust_id, client_id } = this.props.match.params;
		// MARK UNSUB
		await axios.post('/api/unsubscribe', { cor_id, cust_id, client_id }).then(res => {
			if (res.data.msg === 'GOOD') {
				this.props.history.location.state.focus_cust.splice(
					this.props.history.location.state.focus_cust.indexOf(e => e.cust_id === parseInt(cust_id)),
					1,
					res.data.info,
				);
				this.props.history.replace(this.props.location.pathname, this.props.location.state);
				this.setState({ ogInfo: res.data.info, unsubing: false });
			} else {
				alert(res.data.msg);
			}
		});
	}
	render() {
		let { activity, edit, feedback_text, ogInfo, rating } = this.state;
		return (
			<>
				<Layout1 match={this.props.match ? this.props.match.params : null} view={{ sect: 'indv', data: this.state.bus }} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<NoDiv width="75%" direction="column" className="card hoverable">
							<NoDiv just="space-between" width="90%" align="center" margin="0 5%">
								<h3 style={{ color: !ogInfo.active ? 'red' : '' }}>Customer Profile</h3>
								<div style={{ display: 'flex', width: edit ? '80%' : '50%', justifyContent: 'flex-end' }}>
									<LoadingWrapperSmall loading={this.state.process} style={{ width: '40%' }}>
										<button className="btn primary-color primary-hover" style={{ marginRight: '5%' }} onClick={() => this.SendRequest()}>
											Send Request
										</button>
									</LoadingWrapperSmall>
									<button className="btn primary-color primary-hover" style={edit ? { marginRight: '5%' } : null} onClick={() => this.revert()}>
										{!edit ? 'Edit' : 'Revert'}
									</button>
									{edit ? (
										<div style={{ width: '40%', display: 'flex', justifyContent: 'space-between' }}>
											<LoadingWrapperSmall loading={this.state.unsubing}>
												<button className="btn primary-color primary-hover" onClick={() => this.unsubscribe()}>
													Unsubscribe
												</button>
											</LoadingWrapperSmall>
											<LoadingWrapperSmall loading={this.state.saving}>
												<button className="btn primary-color primary-hover" onClick={() => this.update()}>
													Save
												</button>
											</LoadingWrapperSmall>
										</div>
									) : null}
								</div>
							</NoDiv>
							{/* <hr /> */}
							<NoDiv width="100%">
								<NoDiv width="50%" direction="column" padding="0 2.5%" height="100%">
									<blockquote>
										<h5>Name</h5>
									</blockquote>
									<NoDiv margin="0 0 2.5% 0" align="center">
										<i className="material-icons prefix">account_circle</i>
										<div className="input-field" style={{ marginRight: '5%' }}>
											<h2 style={{ margin: '0' }}>
												<input
													id="first_name"
													type="text"
													className="validate"
													value={this.state.firstName}
													onChange={e => this.setState({ firstName: e.target.value })}
													disabled={!edit}
												/>
											</h2>
											<label htmlFor="first_name">First Name: </label>
										</div>
										<div className="input-field">
											<h2 style={{ margin: '0' }}>
												<input
													id="last_name"
													type="text"
													className="validate"
													value={this.state.lastName}
													onChange={e => this.setState({ lastName: e.target.value })}
													disabled={!edit}
												/>
											</h2>
											<label htmlFor="last_name">Last Name: </label>
										</div>
									</NoDiv>
									<blockquote>
										<h5>Contact Info</h5>
									</blockquote>
									<NoDiv align="center">
										<i className="material-icons prefix">email</i>
										<div className="input-field" style={{ width: '20vw' }}>
											<h2 style={{ margin: '0' }}>
												<input
													disabled={!edit}
													id="email"
													type="email"
													className="validate"
													value={this.state.email}
													onChange={e => this.setState({ email: e.target.value })}
												/>
											</h2>
											<label htmlFor="email">Email: </label>
											<span className="helper-text" data-error="Invalid Email Format" data-success="" />
										</div>
									</NoDiv>
									<br />
									<NoDiv align="center" padding="-5%">
										<i className="material-icons prefix">phone</i>
										<div className="input-field" style={{ width: '20vw' }}>
											<h2 style={{ margin: '0' }}>
												<input
													disabled={!edit}
													id="icon_telephone"
													type="tel"
													className="validate"
													value={this.state.phone}
													onChange={e => this.setState({ phone: e.target.value })}
												/>
											</h2>
											<label htmlFor="icon_telephone">Phone: </label>
										</div>
									</NoDiv>
								</NoDiv>
								<NoDiv direction="column" width="40%">
									{rating !== 0 && rating !== null ? (
										<blockquote>
											<h5 style={{ textAlign: 'center' }}>
												Rating:<b style={{ color: 'black', marginLeft: '15%' }}>{rating}</b>
											</h5>
										</blockquote>
									) : null}
									<blockquote>
										<h5>Feedback History</h5>
									</blockquote>
									<div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxHeight: '18vh', paddingTop: '5%' }}>
										<div style={{ overflow: 'scroll', maxHeight: '20vh', width: '95%' }} className="scrollNone">
											{activity
												.sort((a, b) => (a.date >= b.date ? 1 : -1))
												.map((activity, i) => {
													return (
														<NoDiv key={i} margin="" width="100%" just="space-between">
															<h6>{activity.type}</h6>
															<h6>{activity.date.split('T')[0]}</h6>
														</NoDiv>
													);
												})}
										</div>
										<div style={{ border: 'solid black 1px', height: '20vh' }} />
										{/* <hr /> */}
									</div>
									{feedback_text !== 'N/A' && typeof feedback_text !== 'undefined' && feedback_text !== 'NA' && feedback_text !== null ? (
										<div style={{ width: '30vw', marginTop: '10%' }} className="noOverFlow">
											<blockquote>
												<h5>Direct Feedback</h5>
											</blockquote>
											<h6 className="noOverFlow" style={{ width: '30vw' }}>{`- "${feedback_text}"`}</h6>
										</div>
									) : null}
								</NoDiv>
							</NoDiv>
						</NoDiv>
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}
function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(CustView);
