import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Layout1, LoadingWrapper, ThreeSplit, BoxSplit } from '../../../utilities/index';
import { OReviews, FeedDonut, NPSBreakdown, SentStats, RevGrowth, FeedList, RangeSelect, ExportReport, ReviewsGraph } from './RevReport';
import Moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { saveAs } from 'file-saver';
const { detect } = require('detect-browser');
const browser = detect();
class ReviewReport extends Component {
	constructor() {
		super();

		this.state = {
			RatingIndex: -1,
			checklist: [
				{ item: 'Google GMB Access', active: false, date: Moment().format('LL'), activity: { lastUpdated: Moment().format('LL'), who: 'account manager' } },
			],
			checklistItem: '',
			newItem: '',
			address: {},
			email_format: {},
			auto_amt: {},
			customers: {},
			reviews: {},
			bus: {
				address: {},
				company_name: process.env.REACT_APP_COMPANY_NAME,
				auto_amt: {},
				customers: { reviews: [{ size: 5, remaining: 10 }] },
				reviews: { reviews: [] },
			},
			og: { address: {}, company_name: process.env.REACT_APP_COMPANY_NAME, auto_amt: {}, customers: { reviews: [{ size: 5, remaining: 10 }] } },
			live: { loaded: false, stats: {} },
			recent: 30,
			adding: false,
			emailSent: null,
			smsSent: null,
			promoters: [],
			passives: [],
			demoters: [],
			ratings: { gRating: 0, llRating: 0 },
			showAll: false,
			dateFilter: '',
			customDates: false,
			customDate: true,
			startDate: Moment().subtract(1, 'month'),
			endDate: Moment(),
			emailReport: false,
			csv: false,
			emailTo: '',
			emailMessage: `Attached is your ${process.env.REACT_APP_COMPANY_NAME} Performance report for your review.\nPlease let me know if you have any questions.\nThank you.`,
			generatingReport: false,
			reportType: '',
			exportType: true,
			filter: 'everything',
		};
	}
	async componentDidMount() {
		document.title = `Review Report`;
		let { client_id } = this.props.match.params;
		this.axiosCancelSource = axios.CancelToken.source();
		if (Array.isArray(this.props.location.state.info)) {
			// Has In State
			let exists = this.props.location.state.info.filter((item) => item.c_id === parseInt(client_id));
			if (exists[0]) {
				this.setState({ bus: exists });
				if (
					Array.isArray(this.props.location.state.focus_cust) ? this.props.location.state.focus_cust.filter((e) => e.c_id === parseInt(client_id))[0] : false
				) {
					this.setState({ allTimeTot: this.props.location.state.focus_cust.filter((e) => e.c_id === parseInt(client_id) && e.rating !== null).length });
					this.settingState({ exists });
				} else {
					let { cor_id } = exists[0];
					await this.getCust(cor_id, exists);
				}
			} else {
				// Get From Server
				await this.getInfo();
			}
		} else {
			// Get From Server
			await this.getInfo();
		}
		await this.Start();
		this.setState({ loading: false });
	}
	async getCust(cor_id, info) {
		await axios.get(`/api/indv/customers/${cor_id}`, { cancelToken: this.axiosCancelSource.token }).then((res) => {
			res = res.data;
			if (res.msg === 'GOOD') {
				if (res.info[0]) {
					if (browser.name === 'chrome') {
						this.props.location.state.focus_cust = res.info;
						this.props.history.replace(this.props.location.pathname, this.props.location.state);
					} else {
						this.setState({ custs: res.info });
						this.settingState({ exists: info });
					}
				} else {
					alert('There is No Customers');
					this.props.history.replace(`/client-dash/${cor_id}/${this.props.match.params.client_id}`, this.props.location.state);
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
	async settingState({ exists, change, customDates, startDate }) {
		if (change) {
			this.setState({ customDates, startDate });
		}
		startDate = startDate ? startDate : this.state.startDate;
		exists = exists ? exists : this.state.bus;
		let { client_id } = this.props.match.params;
		let info = [];
		let all = [];
		if (browser.name === 'chrome') {
			info = this.props.location.state.focus_cust.filter((e) => e.c_id === parseInt(client_id));
			all = info;
		} else {
			console.log('Hey Yo Wassup', this.state.custs);
			info = [...this.state.custs];
			all = info;
		}

		let { customDate, endDate } = this.state;
		if ((customDate || change) && startDate) {
			info = info.filter((e) => Moment(e.last_sent).format('x') >= startDate.format('x') && Moment(e.last_sent).format('x') <= endDate.format('x'));
		}
		let rat = await info
			.filter((e) => e.rating !== null)
			.sort((a, b) =>
				Moment(a.activity.active[a.activity.active.length - 1].date).format('x') <= Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
					? 1
					: -1,
			); //.sort((a,b) => MutationEvent(a.last_sent));
		let monthlyEmailSend = info.filter(
			(e) => Moment(e.last_sent).format('x') >= Moment().subtract(1, 'month').format('x') && (e.source === 'Email' || e.source === null),
		).length;
		let promoters = await rat.filter((e) => e.rating >= 4 && e.rating !== null);
		let passives = await rat.filter((e) => e.rating === 3 && e.rating !== null);
		let demoters = await rat.filter((e) => e.rating <= 2 && e.rating !== null);
		let responses = info.filter((e) => e.rating && e.last_sent !== '2004-05-25').length;
		let length = info.length;
		let open = info.filter((e) => e.opened_time !== null && e.last_sent !== '2004-05-25').length;
		let sent = info.filter((e) => e.last_sent !== '2004-05-25').length;
		let click = info.filter((e) => e.click && e.last_sent !== '2004-05-25').length;
		this.setState({
			info,
			all,
			emailSent: monthlyEmailSend,
			smsSent: 0,
			promoters,
			demoters,
			passives,
			responses,
			length,
			open,
			sent,
			click,
			emailTo: exists[0].email.email[0],
			dateFilter: Moment().format('YYYY-MM-DD'),
		});
		let { address, auto_amt, customers, reviews, checklist } = exists[0];
		this.setState({ address, auto_amt, reviews: reviews.reviews, customers, checklist, og: exists[0] });
	}

	style(cust) {
		let { showAll } = this.state;
		if (typeof cust[0] !== 'undefined') {
			if (!showAll) {
				cust = cust.slice(0, 10);
			}
			let type = cust[0].rating >= 4 ? 'promoter' : cust[0].rating <= 2 ? 'demoter' : 'passive';
			let { client_id, cor_id } = this.props.match.params;
			return cust.map((e, i) => {
				let name = `${e.first_name} ${e.last_name}`;
				return (
					<div
						className="card "
						style={{
							width: '80%',
							height: '5vh',
							marginBottom: '1vh',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '0 2.5%',
							cursor: 'pointer',
						}}
						onClick={() => this.props.history.push(`/indv-customer/${cor_id}/${e.cus_id}/${client_id}`, this.props.location.state)}
						key={i}
					>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<div
								style={{
									height: '2.5vh',
									width: '3vh',
									border: 'solid black 1px',
									borderRadius: '3vh 3vh',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: type === 'promoter' ? 'rgba(52, 168, 83, 1)' : type === 'demoter' ? 'rgba(234, 67, 53, 1)' : '#fbbc05',
								}}
							>
								{e.rating}
							</div>
							<h6 style={{ margin: '0', padding: '0', marginLeft: '2.5%' }}>{name.slice(0, 25)}</h6>
							{e.feedback_text !== 'N/A' &&
							e.feedback_text !== '' &&
							typeof e.feedback_text !== 'undefined' &&
							e.feedback_text !== 'NA' &&
							e.feedback_text !== null ? (
								<p style={{ marginLeft: '2.5%' }}>
									<i className="material-icons md-18">feedback</i>
								</p>
							) : null}
						</div>
						<h6 className="right-align">{Moment(e.activity.active[e.activity.active.length - 1].date).format('MMM Do, YY')}</h6>
					</div>
				);
			});
		}
	}

	async getInfo() {
		let { client_id } = this.props.match.params;
		await axios.get(`/api/indv/customers&business/${client_id}`).then((res) => {
			this.props.location.state.focus_cust = res.data.info;
			this.props.history.replace(this.props.location.pathname, this.props.location.state);
		});
	}
	async Start() {
		let sort = (custs) => {
			let promoters = [];
			let passives = [];
			let demoters = [];
			custs.map((cust) => {
				let { rating } = cust;
				if (parseInt(rating) <= 2) {
					demoters.push(cust);
				} else if (parseInt(rating) === 3) {
					passives.push(cust);
				} else if (parseInt(rating) >= 4) {
					promoters.push(cust);
				}
				return '';
			});
		};
		if (Array.isArray(this.props.location.state.focus_cust)) {
			sort(this.props.location.state.focus_cust);
		}
	}
	async getLive() {
		// HAVE ENDPOINT GET ALL UPDATED INFO FOR REPORT PAGE
		// Fake DATA
		let data = {
			rating: 3.5,
			sends: { email: 321, sms: 0 },
			customers: { total: 3000, remaining: 1400 },
			stats: { sent: 321, opened: 256, recieved: 190, click: 20 }, //Grab All but only Dates to lower download size
			reviews: [{}],
			loaded: true,
		};
		this.setState({ live: data });
	}
	async generateReport() {
		let { company_name } = this.state.og;
		// prettier-ignore
		let { emailReport, emailTo, emailMessage, promoters, demoters, passives, reviews, responses, og, startDate, endDate, reportType, all, filter } = this.state;
		all = [...all];
		if (startDate.format('YYYY-MM-DD') !== Moment('2005-05-05').format('YYYY-MM-DD') && reportType === 'csv') {
			all = all.filter((e) => Moment(e.last_sent).format('x') >= startDate.format('x') && Moment(e.last_sent).format('x') <= endDate.format('x'));
		}
		if (filter && reportType === 'csv') {
			all = this.filterAll(all);
		}
		if (reportType === 'csv') {
			all = all.sort((a, b) => (a.active > b.active ? -1 : 1));
		}
		if (all[0] || reportType !== 'csv') {
			this.setState({ generatingReport: true });
			let name = company_name.replace(/ /g, '_');
			let genRes = await axios.post('/api/doc/gen/indv/reviewreport', {
				promoters,
				demoters,
				passives,
				reviews,
				responses,
				og,
				startDate,
				endDate,
				reportType,
				all: reportType === 'csv' ? all : [],
			});
			if (!emailReport) {
				if (genRes.data.msg === 'GOOD') {
					await axios.get(`/api/doc/get/indv/reviewReport/${reportType}`, { responseType: 'blob' }).then((res) => {
						if (!res.data.msg) {
							this.setState({ reportModal: false, generatingReport: false, exportType: true });
							if (reportType === 'pdf') {
								const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
								saveAs(pdfBlob, `${name}_review_report.pdf`);
							} else if (reportType === 'csv') {
								const csvBlob = new Blob([res.data], { type: 'csv' });
								saveAs(csvBlob, `${name}_review_report.csv`);
							}
						}
					});
				}
			} else {
				// Send API Request
				axios.post('/api/doc/email/indv/reviewReport', { og: this.state.og, emailTo, emailMessage, reportType }).then((res) => {
					if (res.data.msg === 'GOOD') {
						this.setState({ reportModal: false, generatingReport: false });
					}
				});
			}
		} else {
			alert('No Customers To Export');
		}
	}
	filterAll(all) {
		let { filter } = this.state;
		switch (filter) {
			case 'everything':
				return all;
			case 'allfeed':
				return all.filter((e) => e.rating);
			case 'promoter':
				return all.filter((e) => e.rating >= 4 && e.rating);
			case 'passive':
				return all.filter((e) => e.rating === 3 && e.rating);
			case 'detractor':
				return all.filter((e) => e.rating <= 2 && e.rating);
			case 'NoRating':
				return all.filter((e) => !e.rating);
			case 'unsubscribe':
				return all.filter((e) => !e.active);
			case 'sent':
				return all.filter((e) => e.last_sent !== '2005-05-25' && e.f_id);
			case 'NotSent':
				return all.filter((e) => e.last_sent === '2005-05-25' && !e.f_id);
			default:
				console.log('There has been an error', all, filter);
				return all;
		}
	}

	render() {
		let { promoters, passives, demoters, og, responses } = this.state;
		let perm = this.props.location.state.permissions;
		let width = window.innerWidth;
		let nps = 100;
		let tot = 0;
		let promPerc = Math.floor((promoters.length / responses) * 100);
		let demPerc = Math.floor((demoters.length / responses) * 100);
		let passPerc = Math.floor((passives.length / responses) * 100);
		if (promPerc + demPerc + passPerc !== 100) {
			let num = Math.abs(promPerc + demPerc + passPerc - 100);
			if (promPerc + demPerc + passPerc > 100) {
				promPerc = promPerc - num;
			} else {
				promPerc = promPerc + num;
			}
		}
		if (Array.isArray(promoters) && Array.isArray(passives) && Array.isArray(demoters)) {
			tot = promoters.length + passives.length + demoters.length;
			nps = promPerc - demPerc;
		}

		let bus = Array.isArray(this.state.bus) ? this.state.bus[0] : this.state.bus;
		let facebook = bus.reviews.reviews.filter((e) => e.facebook);
		return (
			<Layout1 view={{ sect: 'indv', data: this.state.bus }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				<LoadingWrapper loading={this.state.loading}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: width >= 1500 ? '90%' : '105%',
							marginTop: '-2.5vh',
							marginLeft: width >= 1500 ? '' : '12.5vw',
						}}
					>
						<div style={{ width: '100%', display: 'flex' }}>
							<div
								style={{
									width: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									marginLeft: '2.5vw',
									height: '10vh',
									margin: '0',
									padding: '0',
								}}
							>
								<h2 style={{ fontSize: '2em' }}>Reviews Report</h2>
								<div style={{ display: 'flex', width: !this.state.customDates ? '30%' : '40%', justifyContent: 'space-between', alignItems: 'center' }}>
									<RangeSelect
										{...this.props}
										state={this.state}
										updateState={(t, v) => this.setState({ [t]: v })}
										settingState={this.settingState.bind(this)}
									/>
									<ExportReport
										{...this.props}
										updateState={(t, v) => this.setState({ [t]: v })}
										state={this.state}
										generateReport={this.generateReport.bind(this)}
									/>
								</div>
							</div>
						</div>
						<ThreeSplit height="25vh" just="space-between" padding="0">
							{og.reviews ? <OReviews site={'Google'} og={og} state={this.state} {...this.props} /> : null}
							{og.reviews ? (
								<OReviews site={'1st'} og={og} state={this.state} {...this.props} promoters={promoters} demoters={demoters} passives={passives} />
							) : null}
							{og.reviews ? <OReviews site={'3rd'} og={og} state={this.state} {...this.props} facebook={facebook} /> : null}
						</ThreeSplit>
						<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' }}>
							{Array.isArray(promoters) ? (
								<FeedDonut nps={nps} og={og} promoters={promoters} demoters={demoters} tot={tot} {...this.props} passives={passives} />
							) : null}
							{Array.isArray(promoters) ? (
								<NPSBreakdown
									nps={nps}
									og={og}
									promoters={promoters}
									demoters={demoters}
									tot={tot}
									{...this.props}
									passives={passives}
									promPerc={promPerc}
									demPerc={demPerc}
								/>
							) : null}
							{perm === 'admin' && this.state.info ? (
								<SentStats
									{...this.props}
									info={this.state.info}
									open={this.state.open}
									sent={this.state.sent}
									click={this.state.click}
									responses={this.state.responses}
								/>
							) : null}
						</div>
						{this.state.og.c_id ? (
							this.state.og.reviews.reviews.length >= 5 &&
							Math.abs(this.state.og.reviews.reviews[0].totalReviews - this.state.og.reviews.reviews[this.state.og.reviews.reviews.length - 1].totalReviews) >=
								5 ? (
								<ReviewsGraph og={this.state.og} {...this.props} />
							) : null
						) : null}
						<ThreeSplit height="auto" align="flex-start" padding="0" just="space-between">
							<BoxSplit width="30%" height="auto">
								<h5 style={{ margin: '0', padding: '0' }}>Promoters</h5>
								<p style={{ margin: '0', padding: '0', fontSize: '.8em' }}>{promPerc}% of Feedback</p>
								<hr />
								{this.style(promoters)}
								{promoters.length >= 10 ? (
									<p onClick={() => this.setState({ showAll: !this.state.showAll })} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
										Show {!this.state.showAll ? 'ALL' : 'LESS'} Responses
									</p>
								) : null}
							</BoxSplit>
							<BoxSplit width="30%" height="auto">
								<h5 style={{ margin: '0', padding: '0' }}>Passives</h5>
								<p style={{ margin: '0', padding: '0', fontSize: '.8em' }}>{passPerc}% of Feedback</p>
								<hr />
								{this.style(passives)}
								{passives.length >= 10 ? (
									<p onClick={() => this.setState({ showAll: !this.state.showAll })} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
										Show {!this.state.showAll ? 'ALL' : 'LESS'} Responses
									</p>
								) : null}
							</BoxSplit>
							<BoxSplit width="30%" height="auto">
								<h5 style={{ margin: '0', padding: '0' }}>Detractors</h5>
								<p style={{ margin: '0', padding: '0', fontSize: '.8em' }}>{demPerc}% of Feedback</p>
								<hr />
								{this.style(demoters)}
								{demoters.length >= 10 ? (
									<p onClick={() => this.setState({ showAll: !this.state.showAll })} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
										Show {!this.state.showAll ? 'ALL' : 'LESS'} Responses
									</p>
								) : null}
							</BoxSplit>
						</ThreeSplit>
					</div>
				</LoadingWrapper>
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(ReviewReport);
