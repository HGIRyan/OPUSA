import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv, LoadingWrapperSmall } from '../../../utilities/index';
import ReviewEmail from '../../all/function/Email';
import ReviewLanding from '../../all/function/ReviewLanding';
import axios from 'axios';
import { Select } from 'react-materialize';

class ReviewEmails extends Component {
	constructor() {
		super();

		this.state = {
			type: 's',
			email: 's',
			Process: 'Spray',
			from: `no-reply@${process.env.REACT_APP_COMPANY_EXTENSION}.com`,
			format: {},
			activeFormat: { one: '1', two: '1', three: '3' },
			msg: '',
			updating: false,
			rating: 3,
			demoter: { thanks: '', body: '', skip: false },
			passive: { thanks: '', body: '', skip: false },
			positive: { thanks: '', body: '', skip: false },
			updateAllSettings: false,
			testEmail: '',
		};
	}
	async componentDidMount() {
		window.scrollTo({
			top: '10',
			behavior: 'smooth',
		});
		document.title = `Review Email`;
		let { client_id } = this.props.match.params;
		if (Array.isArray(this.props.location.state.info)) {
			let exists = this.props.location.state.info.filter((item) => item.c_id === parseInt(client_id));
			this.setState({ testEmail: this.props.location.state.email });
			if (exists[0]) {
				await this.hasEmail(exists[0]);
			} else {
				await this.getEmail();
			}
		} else {
			await this.getEmail();
		}
	}
	async hasEmail(info) {
		let {
			fr_body,
			fr_subject,
			or_body,
			or_subject,
			pr_body,
			pr_subject,
			s_body,
			s_subject,
			sr_body,
			sr_subject,
			spr_body,
			spr_subject,
			positive_landing,
			passive_landing,
			demoter_landing,
			signature,
		} = info;
		let fr = { fr_body: fr_body.fr, fr_subject };
		let or = { or_body: or_body.or, or_subject };
		let pr = { pr_body: pr_body.pr, pr_subject };
		let s = { s_body: s_body.s, s_subject };
		let sr = { sr_body: sr_body.sr, sr_subject };
		let spr = { spr_body: spr_body.spr, spr_subject };
		let emails = { fr, or, s, pr, sr, spr, signature };
		let format = info.email_format;
		this.setState({
			emails,
			og: info,
			format: {
				s: { one: format.s.toString().split('')[0], two: format.s.toString().split('')[1], three: format.s.toString().split('')[2] },
				fr: { one: format.fr.toString().split('')[0], two: format.fr.toString().split('')[1], three: format.fr.toString().split('')[2] },
				sr: { one: format.sr.toString().split('')[0], two: format.sr.toString().split('')[1], three: format.sr.toString().split('')[2] },
				or: { one: format.or.toString().split('')[0], two: format.or.toString().split('')[1], three: format.or.toString().split('')[2] },
				pr: { one: format.pr.toString().split('')[0], two: format.pr.toString().split('')[1], three: format.pr.toString().split('')[2] },
				spr: { one: format.spr.toString().split('')[0], two: format.spr.toString().split('')[1], three: format.spr.toString().split('')[2] },
				signature,
			},
			activeFormat: { one: format.s.toString().split('')[0], two: format.s.toString().split('')[1], three: format.s.toString().split('')[2] },
			demoter: demoter_landing,
			passive: passive_landing,
			positive: positive_landing,
			// from: info.email.email[0],
			fromName: info.email.fromName,
		});
	}
	async getEmail() {
		let { client_id } = this.props.match.params;
		await axios.get(`/api/get/business_details/${client_id}`).then((res) => {
			if (Array.isArray(this.props.location.state.info)) {
				this.props.location.state.info.push(res.data.info[0]);
			} else {
				this.props.location.state.info = [res.data.info[0]];
			}
			this.props.history.replace(this.props.location.pathname, this.props.location.state);
			// this.hasEmail(res.data.info[0]);
		});
	}
	async changeFormat(val, num) {
		let { type, format } = this.state;
		if (!this.state.updateAllSettings) {
			this.setState((prevState) => ({
				format: { ...prevState.format, [type]: { ...prevState.format[type], [num]: val } },
				activeFormat: { ...prevState.activeFormat, [num]: val },
			}));
		} else {
			format.s[num] = val;
			format.fr[num] = val;
			format.sr[num] = val;
			format.or[num] = val;
			format.pr[num] = val;
			format.spr[num] = val;
			this.setState((prevState) => ({
				activeFormat: { ...prevState.activeFormat, [num]: val },
				format: format,
			}));
		}
	}
	async updateEmail(val, part) {
		let { type } = this.state;
		if (part.includes('body')) {
			part = part.split(',')[1];
			this.setState((prevState) => ({
				emails: { ...prevState.emails, [type]: { ...prevState.emails[type], [`${type}_body`]: { ...prevState.emails[type][`${type}_body`], [part]: val } } },
			}));
		} else {
			this.setState((prevState) => ({ ...prevState.emails, [type]: { ...prevState.emails[type], [part]: val } }));
		}
	}
	async updateSignature(val) {
		this.setState((prevState) => ({
			emails: { ...prevState.emails, signature: val },
		}));
	}
	async updateLanding(val, part) {
		let { rating } = this.state;
		if (rating <= 2) {
			this.setState((prevState) => ({
				demoter: { ...prevState.demoter, [part]: val },
			}));
		} else if (rating === 3) {
			this.setState((prevState) => ({
				passive: { ...prevState.passive, [part]: val },
			}));
		} else if (rating >= 4) {
			this.setState((prevState) => ({
				positive: { ...prevState.positive, [part]: val },
			}));
		}
	}
	async saveEmail() {
		this.setState({ updating: true });
		let { emails, format, og } = this.state;
		let { s, fr, pr, or, sr, spr } = format;
		og.email_format = {
			s: parseInt(s.one + s.two + s.three),
			fr: parseInt(fr.one + fr.two + fr.three),
			or: parseInt(or.one + or.two + or.three),
			pr: parseInt(pr.one + pr.two + pr.three),
			sr: parseInt(sr.one + sr.two + sr.three),
			spr: parseInt(spr.one + spr.two + spr.three),
		};
		// og.from_email = from;
		og.s_body = { s: emails.s.s_body };
		og.s_subject = emails.s.s_subject;
		og.or_body = { or: emails.or.or_body };
		og.or_subject = emails.or.or_subject;
		og.pr_body = { pr: emails.pr.pr_body };
		og.pr_subject = emails.pr.pr_subject;
		og.fr_body = { fr: emails.fr.fr_body };
		og.fr_subject = emails.fr.fr_subject;
		og.sr_body = { sr: emails.sr.sr_body };
		og.sr_subject = emails.sr.sr_subject;
		og.spr_body = { spr: emails.spr.spr_body };
		og.spr_subject = emails.spr.spr_subject;
		og.signature = emails.signature;
		og.email.fromName = this.state.fromName;
		await axios.post('/api/indv/review-email/update', { og }).then((res) => {
			if (res.data.msg === 'GOOD') {
				this.setState({ updating: false });
				if (this.props.location.state.info) {
					this.props.location.state.info.splice(
						this.props.location.state.info.findIndex((e) => parseInt(e.c_id) === parseInt(og.c_id)),
						1,
						og,
					);
					this.props.history.replace(this.props.location.pathname, this.props.location.state);
				} else {
					window.location.reload();
				}
			} else {
				alert(res.data.msg);
				this.setState({ updating: false });
			}
		});
	}
	async saveLandingPage() {
		let { og, positive, passive, demoter } = this.state;
		this.setState({ updating: true });
		og.passive_landing = passive;
		og.positive_landing = positive;
		og.demoter_landing = demoter;
		await axios.post('/api/update/review/landingpage', { og }).then((res) => {
			this.setState({ updating: false });
			if (res.data.msg === 'GOOD') {
				if (this.props.location.state.info) {
					this.props.location.state.info.splice(
						this.props.location.state.info.findIndex((e) => parseInt(e.c_id) === parseInt(og.c_id)),
						1,
						og,
					);
					this.props.history.replace(this.props.location.pathname, this.props.location.state);
				} else {
					window.location.reload();
				}
			} else {
				alert(`Something went Wrong ${res.data.msg}`);
			}
		});
	}
	async updateReviewSubject(val) {
		let { type } = this.state;
		this.setState((prevState) => ({
			emails: {
				...prevState.emails,
				[type]: { ...prevState.emails[type], [`${type}_subject`]: val },
			},
		}));
	}
	checkSkip() {
		let { rating, demoter, positive, passive } = this.state;
		if (rating <= 2) {
			return demoter.skip ? '1' : '0';
		} else if (rating === 3) {
			return passive.skip ? '1' : '0';
		} else {
			return positive.skip ? '1' : '0';
		}
	}
	async updateSkip(val) {
		let { rating } = this.state;
		if (rating <= 2) {
			this.setState((prevState) => ({ demoter: { ...prevState.demoter, skip: val === '1' ? true : false } }));
		} else if (rating === 3) {
			this.setState((prevState) => ({ passive: { ...prevState.passive, skip: val === '1' ? true : false } }));
		} else {
			this.setState((prevState) => ({ positive: { ...prevState.positive, skip: val === '1' ? true : false } }));
		}
	}
	async testEmail() {
		let selected = [
			{
				first_name: 'Ryan',
				email: this.state.testEmail,
				activity: { active: [] },
				cus_id: parseInt(process.env.REACT_APP_CUS_ID),
				f_id: parseInt(process.env.REACT_APP_F_ID),
			},
		];
		let bus = this.state.og;
		let type = { email: this.state.type, subject: `${this.state.type}_subject` };
		this.setState({ sending: true });
		await axios.post('/api/request/send', { selected, bus, type }).then(async (res) => {
			if (res.data.msg === 'GOOD') {
				this.setState({ msg: `Sent ${res.data.sent} email${res.data.sent > 1 ? 's' : ''}`, selected: [], sending: false });
				// await this.GetCustomerInfo(og);
			} else {
				alert(res.data.msg);
				this.setState({ sending: false });
			}
		});
	}
	render() {
		let { type, from, emails, og, format } = this.state;
		let perm = this.props.location.state.permissions;
		let width = window.innerWidth;
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: this.state.og }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						{perm === 'admin' ? (
							<LoadingWrapperSmall loading={this.state.updating} text="UPDATING">
								<button
									className="btn primary-color primary-hover"
									style={{ marginBottom: '-5%', marginTop: '.5%', marginLeft: '-70vw' }}
									onClick={() => this.saveEmail()}
								>
									Update
								</button>
							</LoadingWrapperSmall>
						) : null}
						<NoDiv width="95%" margin={width >= 1500 ? '0 0 2.5% 0' : '0 0 2.5% 10%'}>
							<NoDiv direction="column" width="40%">
								<h3>Feedback Request Settings</h3>
								<hr style={{ marginLeft: '.25%', width: '80%' }} />
								<div style={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
									<label htmlFor="email" style={{ marginRight: '-3.5vw', marginTop: '-4vh' }}>
										From Email:{' '}
									</label>
									<div className="input-field" style={{ marginBottom: '-5%' }}>
										<i className="material-icons prefix" style={{ marginTop: '5%' }}>
											email
										</i>
										<input
											id="email"
											type="text"
											className="validate"
											value={from}
											onChange={(e) => this.setState({ from: e.target.value })}
											autoFocus
											disabled={perm !== 'admin'}
										/>
										<span className="helper-text" data-error="Invalid Email Format" data-success="" />
									</div>
								</div>
								{/* <hr style={{ marginLeft: '.25%', width: '80%' }} /> */}
								<h5>From Name</h5>
								<div style={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<label>
										<input
											type="checkbox"
											checked={this.state.fromName === 'businessName'}
											onChange={async () => this.setState({ fromName: 'businessName' })}
											disabled={perm !== 'admin'}
										/>
										<span>Business Name</span>
									</label>
									<label>
										<input
											type="checkbox"
											checked={this.state.fromName === 'firstLast' || this.state.fromName !== 'businessName'}
											onChange={async () => this.setState({ fromName: 'firstLast' })}
											disabled={perm !== 'admin'}
										/>
										<span>First + Last Name</span>
									</label>
								</div>
								<hr style={{ marginLeft: '.25%', width: '80%' }} />
								<div style={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
									<label style={{ marginTop: '5%' }}>
										<input
											type="checkbox"
											checked={this.state.updateAllSettings}
											onChange={async () => this.setState({ updateAllSettings: !this.state.updateAllSettings })}
											disabled={perm !== 'admin'}
										/>
										<span>Change All Email Settings</span>
									</label>
								</div>
								<div style={{ width: '80%' }} className="input-field">
									<h5>Email Type</h5>
									<Select value={type} onChange={(e) => this.setState({ type: e.target.value, activeFormat: format[e.target.value] })}>
										<option value="s">Standard First Send</option>
										<option value="fr">First Reminder</option>
										<option value="sr">Second Reminder</option>
										<option value="or">Opened Reminder</option>
										<option value="pr">Positive Feedback Reminder</option>
										<option value="spr">Second Positive Reminder</option>
									</Select>
								</div>
								<div style={{ height: '30%', width: '80%' }} className="input-field">
									<h5>Header</h5>
									<Select value={this.state.activeFormat.one} onChange={(e) => this.changeFormat(e.target.value, 'one')} disabled={perm !== 'admin'}>
										<option value="1">Logo Header</option>
										<option value="2">No Logo</option>
										{/* <option value="3">3</option> */}
									</Select>
								</div>
								<div style={{ height: '30%', width: '80%' }} className="input-field">
									<h5>Feedback</h5>
									<Select value={this.state.activeFormat.two} onChange={(e) => this.changeFormat(e.target.value, 'two')} disabled={perm !== 'admin'}>
										<option value="1" disabled={type === 'pr'}>
											1 - 5 Feedback
										</option>
										<option value="2">Direct Feedback</option>
										{/* <option value="3">3</option> */}
									</Select>
								</div>
								<div style={{ height: '30%', width: '80%' }} className="input-field">
									<h5>Signature</h5>
									<Select value={this.state.activeFormat.three} onChange={(e) => this.changeFormat(e.target.value, 'three')} disabled={perm !== 'admin'}>
										<option value="1">Company Info</option>
										<option value="2">Company Info + Logo</option>
										<option value="3">Custom Signature</option>
										{/* <option value="3">3</option> */}
									</Select>
								</div>
								{/* <h4>Email Process</h4>
								<hr />
								<label style={{ width: '30%' }}>
									<input type="checkbox" checked={Process === 'Spray'} onChange={() => this.setState({ Process: 'Spray' })} />
									<span className="tab">Spray and Pray</span>
								</label>
								<p>Same email will be sent to all clients</p>
								<hr />
								<label style={{ width: '30%' }}>
									<input type="checkbox" checked={Process === 'Tree'} disabled onChange={() => this.setState({ Process: 'Tree' })} />
									<span className="tab">Binary Tree</span>
								</label>
								<p style={{ width: '60%' }}>Different process path for each email depending on information correlated with that email</p> */}
							</NoDiv>
							<NoDiv width="50%" direction="column" just="center">
								<div className="input-field" style={{ minWidth: '50%', marginLeft: '6%', marginBottom: '0' }}>
									<h2 style={{ margin: '0' }}>
										<input
											style={{ margin: '0' }}
											id="subject"
											type="text"
											className="validate"
											value={this.state.emails ? this.state.emails[type][`${type}_subject`] : 'Subject'}
											onChange={(e) => this.updateReviewSubject(e.target.value)}
										/>
										<span className="helper-text" data-error="Invalid Subject" data-success="" />
									</h2>
									<label style={{ margin: '0' }} htmlFor="subject">
										Subject:{' '}
									</label>
								</div>
								{og ? (
									<ReviewEmail
										comp={og}
										type={type}
										format={this.state.activeFormat}
										email={emails}
										updateEmail={this.updateEmail.bind(this)}
										updateSignature={this.updateSignature.bind(this)}
										perm={perm}
										props={this.props}
									/>
								) : null}
								<div style={{ width: '92.5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<div className="input-field" style={{ minWidth: '50%', marginLeft: '6%', marginBottom: '0' }}>
										<h2 style={{ margin: '0' }}>
											<input
												style={{ margin: '0' }}
												id="subject"
												type="text"
												className="validate"
												value={this.state.testEmail}
												onChange={(e) => this.setState({ testEmail: e.target.value })}
											/>
											<span className="helper-text" data-error="Invalid Subject" data-success="" />
										</h2>
										<label style={{ margin: '0' }} htmlFor="subject">
											Send Test Email
										</label>
									</div>
									<LoadingWrapperSmall loading={this.state.sending}>
										<button className="btn primary-color primary-hover" onClick={() => this.testEmail()}>
											Send Test
										</button>
									</LoadingWrapperSmall>
								</div>
							</NoDiv>
							{/* <div style={{ height: '60vh', width: '20vw', margin: '6.5% 0 0 0', marginLeft: '-5%', padding: '2.5%' }} className="card hoverable"></div> */}
						</NoDiv>
						<hr />
						<div style={{ width: '100%', minHeight: '80vh', display: 'flex', marginLeft: width >= 1500 ? 0 : '5%' }}>
							<div
								style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: '2.5%' }}
							>
								<h3>Landing Page Settings</h3>
								<hr style={{ marginLeft: '0' }} />
								<div className="input-field">
									<label style={{ margin: '0' }}>Rating:</label>
									<Select value={this.state.rating.toString()} onChange={(e) => this.setState({ rating: parseInt(e.target.value) })}>
										<option value="2">1-2</option>
										<option value="3">3</option>
										<option value="4">4-5</option>
									</Select>
								</div>
								<div className="input-field">
									<label style={{ margin: '0' }}>Skip Landing:</label>
									<Select value={this.checkSkip()} onChange={(e) => this.updateSkip(e.target.value)} disabled={perm !== 'admin'}>
										<option value="0">Do Not Skip</option>
										<option value="1">Skip</option>
									</Select>
								</div>
								{perm === 'admin' ? (
									<LoadingWrapperSmall loading={this.state.updating} text="UPDATING">
										<button className="btn primary-color primary-hover" onClick={() => this.saveLandingPage()}>
											Update Landing Page
										</button>
									</LoadingWrapperSmall>
								) : null}
							</div>
							<div
								style={{
									width: '60%',
									height: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									// border: 'solid black',
									padding: '2.5% 0',
								}}
							>
								{og ? (
									<ReviewLanding
										og={og}
										rating={this.state.rating}
										updateLanding={this.updateLanding.bind(this)}
										demoter={this.state.demoter}
										passive={this.state.passive}
										positive={this.state.positive}
										perm={perm}
										props={this.props}
									/>
								) : null}
							</div>
						</div>
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(ReviewEmails);
