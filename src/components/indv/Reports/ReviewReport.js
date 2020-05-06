import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { Layout1, LoadingWrapper, LoadingWrapperSmall, ThreeSplit, BoxSplit } from '../../../utilities/index';
import moment from 'moment';
// import GenInfo from './components/GenInfo';
import Moment from 'moment';
import { Select, Modal } from 'react-materialize';
// import DatePicker from 'react-materialize/lib/DatePicker';
import SentStatsGraph from '../components/SentStatsGraph';
import { Doughnut } from 'react-chartjs-2';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import { saveAs } from 'file-saver';
import { Line } from 'react-chartjs-2';
const { detect } = require('detect-browser');
const browser = detect();
class ReviewReport extends Component {
	constructor() {
		super();

		this.state = {
			RatingIndex: -1,
			checklist: [
				{ item: 'Google GMB Access', active: false, date: moment().format('LL'), activity: { lastUpdated: moment().format('LL'), who: 'account manager' } },
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
			let exists = this.props.location.state.info.filter(item => item.c_id === parseInt(client_id));
			if (exists[0]) {
				this.setState({ bus: exists });
				if (Array.isArray(this.props.location.state.focus_cust) ? this.props.location.state.focus_cust.filter(e => e.c_id === parseInt(client_id))[0] : false) {
					this.setState({ allTimeTot: this.props.location.state.focus_cust.filter(e => e.c_id === parseInt(client_id) && e.rating !== null).length });
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
		// this.setState({ info: info, og: info, bus: info });
		await axios.get(`/api/indv/customers/${cor_id}`, { cancelToken: this.axiosCancelSource.token }).then(res => {
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
			info = this.props.location.state.focus_cust.filter(e => e.c_id === parseInt(client_id));
			all = info;
		} else {
			console.log('Hey Yo Wassup', this.state.custs);
			info = [...this.state.custs];
			all = info;
		}
		let { customDate, endDate } = this.state;
		if ((customDate || change) && startDate) {
			info = info.filter(e => Moment(e.last_sent).format('x') >= startDate.format('x') && Moment(e.last_sent).format('x') <= endDate.format('x'));
		}
		let rat = await info
			.filter(e => e.rating !== null)
			.sort((a, b) =>
				Moment(a.activity.active[a.activity.active.length - 1].date).format('x') <= Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
					? 1
					: -1,
			); //.sort((a,b) => MutationEvent(a.last_sent));
		// await console.log(info);
		let monthlyEmailSend = info.filter(
			e =>
				Moment(e.last_sent).format('x') >=
					Moment()
						.subtract(1, 'month')
						.format('x') &&
				(e.source === 'Email' || e.source === null),
		).length;
		let promoters = await rat.filter(e => e.rating >= 4 && e.rating !== null);
		let passives = await rat.filter(e => e.rating === 3 && e.rating !== null);
		let demoters = await rat.filter(e => e.rating <= 2 && e.rating !== null);
		let responses = info.filter(e => e.rating && e.last_sent !== '2004-05-25').length;
		let length = info.length;
		let open = info.filter(e => e.opened_time !== null && e.last_sent !== '2004-05-25').length;
		let sent = info.filter(e => e.last_sent !== '2004-05-25').length;
		let click = info.filter(e => e.click && e.last_sent !== '2004-05-25').length;
		let llRating = 0;
		info.filter(e => e.rating).map(e => (llRating = e.rating + llRating));
		llRating = (llRating / responses).toFixed(1);
		let ratings = { gRating: exists[0].reviews.reviews[exists[0].reviews.reviews.length - 1].rating, llRating };
		this.setState({
			og: info,
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
			ratings,
			emailTo: exists[0].email.email[0],
			dateFilter: Moment().format('YYYY-MM-DD'),
			// allTimeTot: rat.length,
		});
		await this.hasInfo(exists[0]);
	}

	style(cust) {
		let { showAll } = this.state;
		if (typeof cust[0] !== 'undefined') {
			// cust.sort((a, b) => (a.activity.active[a.activity.active.length - 1].date >= b.activity.active[b.activity.active.length - 1].date ? 1 : -1));
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
	async Ratings() {
		let { promoters, passives, demoters } = this.state.info;
		promoters = await promoters.map((cust, i) => this.style(cust, i, 'promoter'));
		passives = await passives.map((cust, i) => this.style(cust, i, 'passsive'));
		demoters = await demoters.map((cust, i) => this.style(cust, i, 'demoter'));
		await this.setState({ promoters, passives, demoters });
	}
	async hasInfo(info) {
		// let { client_id, loc } = this.props.match.params
		let { address, auto_amt, customers, reviews, checklist } = info;
		this.setState({ address, auto_amt, reviews: reviews.reviews, customers, checklist, og: info });
		// Create and get query for total sent, opened, recieved and clicked within certain date. Get 30, 60, 90 and alltime
	}
	async getInfo() {
		let { client_id } = this.props.match.params;
		await axios.get(`/api/indv/customers&business/${client_id}`).then(res => {
			this.props.location.state.focus_cust = res.data.info;
			this.props.history.replace(this.props.location.pathname, this.props.location.state);
			// let { address, email_format, auto_amt, customers, reviews, checklist } = res.data.bus[0]
			// this.setState({ address, email_format, auto_amt, reviews, customers, checklist, og: res.data.bus[0] })
		});
	}
	async Start() {
		let sort = custs => {
			let promoters = [];
			let passives = [];
			let demoters = [];
			custs.map(cust => {
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
		// await axios.post(`/api/reviewreport/indv/data`, { client_id }).then(async res => {
		// 	let dates = res.data.stat.greviews.sort((a, b) => {
		// 		var c = new Date(a.date);
		// 		var d = new Date(b.date);
		// 		return c - d;
		// 	});
		// 	let customers = res.data.info.sort((a, b) => {
		// 		var c = new Date(a.date);
		// 		var d = new Date(b.date);
		// 		return c - d;
		// 	});

		// 	let info = { promoters, passives, demoters };
		// 	await this.setState({ dates, info, stats: res.data.stat });
		// });
	}
	localComma(strnum) {
		if (typeof strnum === 'string' || typeof strnum === 'number') {
			return parseInt(strnum).toLocaleString();
		}
	}
	async checklist(val) {
		if (val.length > 0) {
			this.setState({ adding: true });
			let { client_id } = this.props.match.params;
			let { checklist } = this.state;
			checklist.list.push({ item: val, active: false, history: [{ action: 'created', who: this.props.location.state.userName, date: moment().format('l') }] });
			this.setState({ checklist });
			await axios.post('/api/report/checklist', { checklist, client_id }).then(res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ checklist, adding: false });
					if (Array.isArray(this.props.location.state.info)) {
						let { cor_id } = this.props.match;
						this.props.location.state.info.map(e => (e.cor_id === cor_id ? (e.checklist = checklist) : null));
						this.props.history.replace(this.props.location.pathname, this.props.location.state);
					}
				} else {
					alert('Couldnt Update Checklist');
				}
			});
		}
	}
	async activeItem(i, active) {
		let { client_id } = this.props.match.params;
		let { checklist } = this.state;
		let history = { action: !active ? 'Marked Complete' : 'Marked Incomplete', who: this.props.location.state.userName, date: moment().format('l') };
		checklist.list[i].active = active;
		checklist.list[i].history ? checklist.list[i].history.push(history) : (checklist.list[i].history = [history]);
		this.setState({ checklist });
		await axios.post('/api/report/checklist', { checklist, client_id }).then(res => {
			if (res.data.msg === 'GOOD') {
				this.setState({ checklist });
				if (Array.isArray(this.props.location.state.info)) {
					let { cor_id } = this.props.match;
					this.props.location.state.info.map(e => (e.cor_id === cor_id ? (e.checklist = checklist) : null));
					this.props.history.replace(this.props.location.pathname, this.props.location.state);
				}
			} else {
				alert('Couldnt Update Checklist');
			}
		});
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
		// await axios.get('').then(res => {
		// 	if (res.data.msg === 'GOOD') {
		// 	} else {
		// 		alert('ERROR: ->', res.data.msg);
		// 	}
		// });
	}
	thisMonth(reviews) {
		if (Array.isArray(reviews)) {
			let { startDate } = this.state;
			let range = reviews.filter(e => Moment(e.date).format('x') >= startDate.format('x'));
			if (range[0]) {
				range = range.reduce((a, c) => {
					return { newReviews: a.newReviews + c.newReviews };
				});
				return range.newReviews;
			} else {
				return 0;
			}
		}
	}
	async generateReport() {
		let { company_name } = this.state.og;
		// prettier-ignore
		let { emailReport, emailTo, emailMessage, promoters, demoters, passives, reviews, responses, og, startDate, endDate, reportType, all, filter } = this.state;
		all = [...all];
		if (startDate.format('YYYY-MM-DD') !== Moment('2005-05-05').format('YYYY-MM-DD') && reportType === 'csv') {
			all = all.filter(e => Moment(e.last_sent).format('x') >= startDate.format('x') && Moment(e.last_sent).format('x') <= endDate.format('x'));
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
					await axios.get(`/api/doc/get/indv/reviewReport/${reportType}`, { responseType: 'blob' }).then(res => {
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
				axios.post('/api/doc/email/indv/reviewReport', { og: this.state.og, emailTo, emailMessage, reportType }).then(res => {
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
			case 'promoter':
				return all.filter(e => e.rating >= 4 && e.rating);
			case 'passive':
				return all.filter(e => e.rating === 3 && e.rating);
			case 'detractor':
				return all.filter(e => e.rating <= 2 && e.rating);
			case 'NoRating':
				return all.filter(e => !e.rating);
			case 'unsubscribe':
				return all.filter(e => !e.active);
			case 'sent':
				return all.filter(e => e.last_sent !== '2005-05-25' && e.f_id);
			case 'NotSent':
				return all.filter(e => e.last_sent === '2005-05-25' && !e.f_id);
			default:
				console.log('There has been an error', all, filter);
				return all;
		}
	}
	displayStars(rating) {
		if (rating) {
			rating = rating.toString();
			let int = rating.split('.')[0];
			let dec = rating.split('.')[1];
			let stars = [];
			for (let i = 0; i < int; i++) {
				stars.push({ link: process.env.REACT_APP_GOOGLE_STAR, type: 'int' });
			}
			if (dec !== '0') {
				stars.push({ link: process.env.REACT_APP_GOOGLE_STAR, type: 'dec' });
			}
			return stars.map((e, i) => (
				<img
					src={e.link}
					alt="Star Ratings"
					style={{
						// margin: '0',
						height: '20px',
						width: e.type === 'int' ? '20px' : `${20 * (dec / 10)}px`,
						overflow: 'hidden',
						objectFit: e.type === 'int' ? '' : 'cover',
						objectPosition: e.type === 'int' ? '' : `0`,
						margin: '0 1px',
					}}
					key={i}
				/>
			));
		}
	}
	randomColor() {
		let first = Math.floor(Math.random(50) * Math.floor(255));
		let sec = Math.floor(Math.random(50) * Math.floor(255));
		let third = Math.floor(Math.random(50) * Math.floor(255));
		let fill = Math.floor(Math.random() * (6 - 1) + 1);
		let color = `rgba(${first}, ${sec}, ${third}, .${fill})`;
		return color;
	}
	ReviewsGraph() {
		let chartData = {};
		if (this.state.og.c_id) {
			let arr = this.state.og.reviews.reviews
				.sort((a, b) => (Moment(a.date).format('x') > Moment(b.date).format('x') ? 1 : -1))
				.filter(e => e.totalReviews && e.totalReviews !== 0);
			chartData = {
				labels: arr.map(e => e.date),
				datasets: [
					{
						label: 'Total Reviews',
						data: arr.map(e => e.totalReviews),
						backgroundColor: [this.randomColor()],
						borderColor: [this.randomColor()],
						// fill: false,
					},
				],
			};
			return (
				<Line
					height={5}
					width={20}
					options={{
						maintainAspectRatio: false,
						// responsive: false,
						title: {
							display: false,
							text: 'All Reviews',
							fontSize: 25,
						},
						legend: {
							display: true,
							position: 'top',
						},
						hover: {
							mode: 'nearest',
							intersect: true,
						},
						scales: {
							xAxes: [
								{
									gridLines: {
										color: 'rgba(0, 0, 0, 0)',
									},
								},
							],
							yAxes: [
								{
									gridLines: {
										color: 'rgba(0, 0, 0, 0)',
									},
									ticks: {
										suggestedMin: arr[0].totalReviews - 2 >= 0 ? arr[0].totalReviews - 2 : 0,
										suggestedMax: arr[arr.length - 1].totalReviews + 5,
									},
								},
							],
						},
					}}
					data={chartData}
				/>
			);
		}
	}
	feedbackChart() {
		let { promoters, passives, demoters } = this.state;
		let chartData = {
			labels: ['Promoters', 'Passives', 'Demoters'],
			datasets: [
				{
					data: [promoters.length, passives.length, demoters.length],
					backgroundColor: ['rgba(52, 168, 83, 1)', '#fbbc05', 'rgba(234, 67, 53, 1)'],
					hoverBackgroundColor: ['rgba(52, 168, 83, .5)', 'rgba(251, 188, 5, 0.5)', 'rgba(234, 67, 53, .5)'],
				},
			],
		};
		return (
			<Doughnut
				options={{
					maintainAspectRatio: false,
					title: {
						display: false,
						text: 'Status',
						fontSize: 25,
					},
					legend: {
						display: true,
						position: 'top',
					},
				}}
				data={chartData}
			/>
		);
	}
	render() {
		let { promoters, passives, demoters, og, responses } = this.state;
		let def = { padding: '0', margin: '0', display: 'flex', alignItems: 'center' };
		// let fill = { height: '100%', width: '100%', margin: '0', padding: '0' };
		let reviewTop = { display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '50%' };
		let reviewBottom = { display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '50%' };
		let reviewBot = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '50%' };
		// let cust = og.customers.reviews[og.customers.reviews.length - 1];
		let perm = this.props.location.state.permissions;
		// let center = { display: 'flex', justifyContent: 'center', alignItems: 'center' };
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
		let currentRange = () => {
			let { startDate } = this.state;
			startDate = startDate.format('YYYY-MM-DD');
			if (
				startDate ===
				Moment()
					.subtract(7, 'days')
					.format('YYYY-MM-DD')
			) {
				return 'Past Week';
			} else if (startDate === Moment('2005-05-05').format('YYYY-MM-DD')) {
				return 'All Time';
			} else if (
				startDate ===
				Moment()
					.subtract(1, 'month')
					.format('YYYY-MM-DD')
			) {
				return 'Past Month';
			} else if (
				startDate ===
				Moment()
					.subtract(3, 'month')
					.format('YYYY-MM-DD')
			) {
				return 'Past Quarter';
			} else if (
				startDate ===
				Moment()
					.subtract(1, 'year')
					.format('YYYY-MM-DD')
			) {
				return 'Past Year';
			} else {
				return 'Range';
			}
		};
		let bus = Array.isArray(this.state.bus) ? this.state.bus[0] : this.state.bus;
		let facebook = bus.reviews.reviews.filter(e => e.facebook);
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
									<div style={{ display: 'flex', alignItems: 'center', height: '5vh' }}>
										{/* <label>
											<input
												type="checkbox"
												checked={this.state.customDate}
												onChange={async () => {
													await this.setState({ customDate: !this.state.customDate });
													this.settingState({});
												}}
											/>
											<span></span>
										</label> */}
										<div style={{ width: '90%', display: 'flex', alignItems: 'center' }}>
											{!this.state.customDates ? (
												<div className="input-field noselect" style={{ width: '12vw' }}>
													<label>
														{this.state.startDate.format('YYYY-MM-DD') === '2005-05-05'
															? ``
															: `${this.state.startDate.format('MMM Do, YY')} - ${this.state.endDate.format('MMM Do, YY')}`}
													</label>
													<Select
														value={this.state.startDate.format('YYYY-MM-DD')}
														onChange={e => {
															if (e.target.value === 'custom') {
																this.setState({ customDates: true, startDate: Moment().subtract(7, 'days') });
															} else {
																this.settingState({ change: true, customDates: e.target.value === 'custom', startDate: Moment(e.target.value) });
															}
														}}
														style={{ margin: '0', padding: '0' }}
													>
														<option value={Moment('2005-01-05').format('YYYY-MM-DD')}>All Time</option>
														<option
															value={Moment()
																.subtract(7, 'days')
																.format('YYYY-MM-DD')}
														>
															Past Week
														</option>
														<option
															value={Moment()
																.subtract(1, 'month')
																.format('YYYY-MM-DD')}
														>
															Past Month
														</option>
														<option
															value={Moment()
																.subtract(3, 'month')
																.format('YYYY-MM-DD')}
														>
															Past Quarter
														</option>
														<option
															value={Moment()
																.subtract(1, 'year')
																.format('YYYY-MM-DD')}
														>
															Past Year
														</option>
														<option value="custom">Custom Range</option>
													</Select>
												</div>
											) : (
												<div style={{ display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'row' }}>
													<div style={{ display: 'flex', alignItems: 'center', width: '20vw', flexDirection: 'row' }}>
														<DateRangePicker
															startDate={this.state.startDate} // momentPropTypes.momentObj or null,
															startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
															endDate={this.state.endDate} // momentPropTypes.momentObj or null,
															endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
															onDatesChange={async ({ startDate, endDate }) => {
																await this.setState({ startDate, endDate });
																await this.settingState({ change: true, customDates: this.state.customDates, startDate: startDate });
															}} // PropTypes.func.isRequired,
															focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
															onFocusChange={focusedInput => {
																this.setState({ focusedInput });
															}} // PropTypes.func.isRequired,
															isOutsideRange={() => false}
														/>
													</div>
												</div>
											)}
										</div>
									</div>
									<Modal
										trigger={<button className="btn primary-color primary-hover">Export Report</button>}
										style={{ outline: 'none' }}
										open={this.state.reportModal}
										onClick={() => this.setState({ reportModal: undefined })}
									>
										{this.state.exportType ? (
											<div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
												<h3>What Kind of Report Do You Want?</h3>
												<div style={{ display: 'flex', width: '30%', justifyContent: 'space-between', marginBottom: '2.5%' }}>
													<label style={{ display: 'flex', justifyContent: 'flex-start' }}>
														<input type="checkbox" checked={this.state.reportType === 'pdf'} onChange={() => this.setState({ reportType: 'pdf' })} />
														<span className="tab">PDF</span>
													</label>
													<label style={{ display: 'flex', justifyContent: 'flex-start' }}>
														<input type="checkbox" checked={this.state.reportType === 'csv'} onChange={() => this.setState({ reportType: 'csv' })} />
														<span className="tab">CSV</span>
													</label>
												</div>
												{this.state.reportType ? (
													<button
														className="btn primary-color primary-hover"
														onClick={() => this.setState({ exportType: false, csv: this.state.reportType === 'csv' })}
													>
														Select
													</button>
												) : null}
											</div>
										) : this.state.csv ? (
											<div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
												<div
													style={{
														display: 'flex',
														flexDirection: 'column',
														alignItems: 'flex-start',
														minHeight: '25vh',
														justifyContent: 'space-between',
														width: '40%',
													}}
												>
													<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
														<input type="checkbox" checked={this.state.filter === 'everything'} onChange={() => this.setState({ filter: 'everything' })} />
														<span className="tab">Export Everything</span>
													</label>
													<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
														<input type="checkbox" checked={this.state.filter === 'promoter'} onChange={() => this.setState({ filter: 'promoter' })} />
														<span className="tab">Export Promoters (4 - 5 Feedback)</span>
													</label>
													<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
														<input type="checkbox" checked={this.state.filter === 'passive'} onChange={() => this.setState({ filter: 'passive' })} />
														<span className="tab">Export Passives (3 Feedback)</span>
													</label>
													<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
														<input type="checkbox" checked={this.state.filter === 'detractor'} onChange={() => this.setState({ filter: 'detractor' })} />
														<span className="tab">Export Detractors (1 - 2 Feedback)</span>
													</label>
													<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
														<input type="checkbox" checked={this.state.filter === 'NoRating'} onChange={() => this.setState({ filter: 'NoRating' })} />
														<span className="tab">Export Customers With No Rating</span>
													</label>
													<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
														<input type="checkbox" checked={this.state.filter === 'unsubscribe'} onChange={() => this.setState({ filter: 'unsubscribe' })} />
														<span className="tab">Export Unsubscribed Customers</span>
													</label>
													<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
														<input type="checkbox" checked={this.state.filter === 'sent'} onChange={() => this.setState({ filter: 'sent' })} />
														<span className="tab">Export Requests Sent</span>
													</label>
													<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
														<input type="checkbox" checked={this.state.filter === 'NotSent'} onChange={() => this.setState({ filter: 'NotSent' })} />
														<span className="tab">Export Customers Not Sent</span>
													</label>
												</div>
												<button className="btn primary-color primary-hover" onClick={() => this.setState({ csv: false })} style={{ marginTop: '2.5%' }}>
													Next
												</button>
											</div>
										) : !this.state.emailReport ? (
											<div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
												<h3>Would you like to Download or Email this Report?</h3>
												<div style={{ width: '50%', display: 'flex', justifyContent: 'space-between', marginBottom: '2.5%' }}>
													<LoadingWrapperSmall loading={this.state.generatingReport}>
														<button className="btn primary-color primary-hover" onClick={() => this.generateReport()}>
															Download
														</button>
													</LoadingWrapperSmall>
													<button className="btn primary-color primary-hover" onClick={() => this.setState({ emailReport: true })}>
														Email
													</button>
												</div>
												<button className="btn primary-color primary-hover" onClick={() => this.setState({ exportType: true })}>
													Back
												</button>
											</div>
										) : (
											<div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
												{/* <h4 style={{ margin: '0', padding: '0', marginLeft: '-70%' }}>To Email</h4> */}
												<div className="input-field" style={{ width: '80%' }}>
													<h2 style={{ margin: '0' }}>
														<input value={this.state.emailTo} onChange={e => this.setState({ emailTo: e.target.value })} />
													</h2>
													<label>To Email</label>
												</div>
												{/* <input value={this.state.emailTo} onChange={e => this.setState({ emailTo: e.target.value })} /> */}
												{/* <textarea value={this.state.emailMessage} onChange={e => this.setState({ emailMessage: e.target.value })} /> */}
												<p style={{ margin: '0', padding: '0', marginLeft: '-72.5%', color: 'gray' }}>Email Text</p>
												<form className="col" style={{ width: '80%', margin: '0', fontSize: ' 1.5em', display: 'flex', justifyContent: 'center' }}>
													<div
														className="input-field feedbacktextarea"
														style={{
															// border: 'solid gray 1px',
															padding: '0 .5%',
															boxShadow: this.state.focus ? '0 8px 12px rgba(0, 0, 0, 0.25)' : '',
															width: '100%',
														}}
													>
														<textarea
															disabled={perm !== 'admin'}
															rows="10"
															style={{ minHeight: '10vh', width: '100%' }}
															id="textarea1"
															className="materialize-textarea"
															placeholder="Please Leave Your Feedback Here"
															value={this.state.emailMessage}
															onChange={e => this.setState({ emailMessage: e.target.value })}
															type="text"
															data-length="2555"
														/>
													</div>
												</form>
												<div style={{ width: '60%', display: 'flex', justifyContent: 'space-around', marginTop: '2.5%' }}>
													<button className="btn primary-color primary-hover" onClick={() => this.setState({ emailReport: false })}>
														back
													</button>
													<LoadingWrapperSmall loading={this.state.generatingReport}>
														<button className="btn primary-color primary-hover" onClick={() => this.generateReport()}>
															Send
														</button>
													</LoadingWrapperSmall>
												</div>
											</div>
										)}
									</Modal>
								</div>
							</div>
						</div>
						<ThreeSplit height="25vh" just="space-between" padding="0">
							<BoxSplit width="30%" padding="0" className="card">
								<BoxSplit width="100%" height="100%" margin="0" className="card-content ">
									<div style={reviewTop}>
										<div style={{ width: '33%', marginRight: '15%' }}>
											<h4>Google</h4>
										</div>
										<div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '1%', minWidth: '50%' }}>
											<p style={{ margin: '0', padding: '0', color: '#e7711b', fontSize: '20px', fontFamily: 'arial,sans-serif', marginRight: '5px' }}>
												{og.reviews ? og.reviews.reviews[og.reviews.reviews.length - 1].rating : null}{' '}
											</p>
											<div>{og.reviews ? this.displayStars(og.reviews.reviews[og.reviews.reviews.length - 1].rating) : null}</div>
										</div>
										<div style={{ width: '33%' }}></div>
									</div>
									<div style={reviewBottom}>
										<div style={reviewBot} data-tip data-for="reviews">
											<h5>+{og.reviews ? og.reviews.reviews[og.reviews.reviews.length - 1].totalReviews - og.reviews.reviews[0].totalReviews : null}</h5>
											<p>Since Joining</p>
										</div>
										<div style={reviewBot} data-tip data-for="reviews">
											<h5>+{og.reviews ? this.thisMonth(og.reviews.reviews) : null}</h5>
											<p>{currentRange()}</p>
										</div>
									</div>
									<ReactTooltip id="reviews" type="dark" effect="float" place="bottom">
										<span>Reviews</span>
									</ReactTooltip>
								</BoxSplit>
							</BoxSplit>
							<BoxSplit width="30%" padding="0" className="card">
								<BoxSplit width="100%" height="100%" margin="0" className="card-content ">
									<div style={reviewTop}>
										<div style={{ width: '33%', marginRight: '15%' }}>
											<h4 style={{ textAlign: 'left' }}>
												1st Party <br />
												Feedback
											</h4>
										</div>
										<div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '1%', minWidth: '50%' }}>
											<p style={{ margin: '0', padding: '0', color: '#e7711b', fontSize: '20px', fontFamily: 'arial,sans-serif', marginRight: '5px' }}>
												{og.reviews ? this.state.ratings.llRating : null}{' '}
											</p>
											<div>{og.reviews ? this.displayStars(this.state.ratings.llRating) : null}</div>
										</div>
										<div style={{ width: '33%' }}></div>
									</div>
									<div style={reviewBottom}>
										<div style={reviewBot} data-tip data-for="reviews">
											<h5>+{this.state.allTimeTot}</h5>
											<p>All Time</p>
										</div>
										<div style={reviewBot} data-tip data-for="reviews">
											<h5>
												+
												{og.reviews
													? Array.isArray(promoters) && Array.isArray(passives) && Array.isArray(demoters)
														? promoters.filter(e => Moment(e.last_sent).format('x') >= this.state.startDate.format('x')).length +
														  passives.filter(e => Moment(e.last_sent).format('x') >= this.state.startDate.format('x')).length +
														  demoters.filter(e => Moment(e.last_sent).format('x') >= this.state.startDate.format('x')).length
														: ''
													: null}
											</h5>
											<p>{currentRange()}</p>
										</div>
									</div>
									<ReactTooltip id="reviews" type="dark" effect="float" place="bottom">
										<span>Reviews</span>
									</ReactTooltip>
								</BoxSplit>
							</BoxSplit>
							<BoxSplit width="30%" padding="0" className="card">
								<BoxSplit width="100%" height="100%" margin="0" className="card-content ">
									<div style={reviewTop}>
										<div style={{ width: '33%', marginRight: '15%' }}>
											<h4 style={{ textAlign: 'left' }}>
												3rd Party <br />
												Feedback
											</h4>
										</div>
										<div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '1%', minWidth: '50%' }}>
											<p style={{ margin: '0', padding: '0', color: '#e7711b', fontSize: '20px', fontFamily: 'arial,sans-serif', marginRight: '5px' }}></p>
										</div>
										<div style={{ width: '33%' }}></div>
									</div>
									<div style={reviewBottom}>
										<div style={reviewBot} data-tip data-for="reviews">
											<h5>+{false ? facebook[facebook.length - 1].facebook.total - facebook[0].facebook.total : 0}</h5>
											<p>All Time</p>
										</div>
										<div style={reviewBot} data-tip data-for="reviews">
											<h5>
												+
												{false
													? facebook[facebook.length - 1].facebook.total -
													  facebook.filter(e => Moment(e.date).format('x') >= this.state.startDate.format('x')).reduce((a, c) => a.facebook.new + c)
													: 0}
											</h5>
											<p>Since Month</p>
										</div>
									</div>
									<ReactTooltip id="reviews" type="dark" effect="float" place="bottom">
										<span>Reviews</span>
									</ReactTooltip>
								</BoxSplit>
							</BoxSplit>
						</ThreeSplit>
						<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' }}>
							<div style={(def, { display: 'flex', flexDirection: 'column', width: '30%', height: '35vh' })} className="card ">
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '5%', paddingBottom: '0' }}>
									<h4 className="left-align" style={{ margin: '0', marginLeft: '-2.5vw' }}>
										Feedback Donut
									</h4>
									<div className="left-align" style={{ display: 'flex', alignItems: 'center', margin: '0', padding: '0' }} data-tip data-for="NPS">
										<h4 style={{ margin: '0', padding: '0' }}>Star Diff:</h4>
										<h4
											style={{
												fontWeight: 'bold',
												margin: '0 0 0 .5vw',
												padding: '0',
												color: nps <= 0 ? '#ea4335' : nps <= 30 ? '#fbbc05' : nps <= 70 ? '#0396a6' : '#34a853',
											}}
										>
											{og.reviews ? Math.abs(this.state.ratings.gRating - this.state.ratings.llRating).toFixed(1) : null}
										</h4>
									</div>
									<ReactTooltip id="NPS" type="dark" effect="float" place="bottom">
										<span>
											{((promoters.length / tot) * 100).toFixed(0)}% - {((demoters.length / tot) * 100).toFixed(0)}% = {nps}
										</span>
										<br />
										<span>Promoters - Detractors = NPS</span>
									</ReactTooltip>
								</div>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '70%' }}>{this.feedbackChart()}</div>
							</div>
							<div style={(def, { display: 'flex', flexDirection: 'column', width: '30%', height: '35vh', alignItems: 'center' })} className="card">
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '5%', paddingBottom: '0' }}>
									<h4 style={{ width: '60%', paddingLeft: '0', margin: '0', padding: '0', marginBottom: '2.5%' }} className="left-align">
										NPS BreakDown
									</h4>
								</div>
								<div style={{ height: '25%', width: '95%', display: 'flex', justifyContent: 'space-between' }}>
									<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90%', width: '30%' }}>
										<h1 style={{ margin: '0', color: 'rgba(52, 168, 83, 1)' }}>{promPerc}%</h1>
										<h6>Promoters</h6>
									</div>
									<h1 style={{ margin: '2.5% 0 0' }}>-</h1>
									<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90%', width: '30%' }}>
										<h1 style={{ margin: '0', color: 'rgba(234, 67, 53, 1)' }}>{demPerc}%</h1>
										<h6>Detractors</h6>
									</div>
									<h1 style={{ margin: '2.5% 0 0' }}>=</h1>
									<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90%', width: '30%' }}>
										<h1 style={{ margin: '0', color: nps <= 0 ? '#ea4335' : nps <= 30 ? '#fbbc05' : nps <= 70 ? '#0396a6' : '#34a853' }}>
											{promoters[0] ? Math.abs(promPerc - demPerc) : 0}
										</h1>
										<h6>NPScore</h6>
									</div>
								</div>
								<hr />
								<div style={{ display: 'flex', flexDirection: 'column', width: '85%' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
										<h5>
											Promoters (4-5) <b>{promoters.length}</b>
										</h5>
										<div className="progress" style={{ width: '50%', marginTop: '5%' }} data-tip data-for="promoter1">
											<div className="determinate" style={{ width: `${(promoters.length / tot) * 100}%`, backgroundColor: 'rgba(52, 168, 83, 1)' }}></div>
										</div>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
										<h5>
											Passives (3) <b>{passives.length}</b>
										</h5>
										<div className="progress" style={{ width: '50%', marginTop: '5%' }} data-tip data-for="passive1">
											<div className="determinate" style={{ width: `${(passives.length / tot) * 100}%`, backgroundColor: 'rgba(255, 241, 153, 1)' }}></div>
										</div>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
										<h5>
											Detractors (1-2) <b>{demoters.length}</b>
										</h5>
										<div className="progress" style={{ width: '50%', marginTop: '5%' }} data-tip data-for="demoter1">
											<div className="determinate" style={{ width: `${(demoters.length / tot) * 100}%`, backgroundColor: 'rgba(234, 67, 53, 1)' }}></div>
										</div>
									</div>
									<ReactTooltip id="promoter1" type="dark" effect="float" place="bottom">
										<span>{((promoters.length / tot) * 100).toFixed(0)}%</span>
									</ReactTooltip>
									<ReactTooltip id="demoter1" type="dark" effect="float" place="bottom">
										<span>{((demoters.length / tot) * 100).toFixed(0)}%</span>
									</ReactTooltip>
									<ReactTooltip id="passive1" type="dark" effect="float" place="bottom">
										<span>{((passives.length / tot) * 100).toFixed(0)}%</span>
									</ReactTooltip>
								</div>
							</div>
							{perm === 'admin' ? (
								<div style={(def, { display: 'flex', flexDirection: 'column', width: '30%', height: '35vh' })} className="card">
									<h4 style={{ width: '100%', paddingLeft: '5%' }} className="left-align">
										Sent Stats
									</h4>
									<div style={{ display: 'flex', height: '90%', width: '100%' }}>
										<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '30%' }}>
											<SentStatsGraph
												height="90%"
												width="60%"
												sent={this.state.sent}
												open={this.state.open}
												feedback={this.state.responses}
												click={this.state.click}
											/>
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
													<p>{this.state.sent}</p>
													<p></p>
												</div>
											</div>
											<div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1% 0' }}>
												<h4 style={{ margin: '0', padding: '0' }}>Open</h4>
												<div style={{ display: 'flex', width: '40%', justifyContent: 'space-between' }}>
													<p>{this.state.open}</p>
													<p>{((this.state.open / this.state.sent) * 100).toFixed(0)}%</p>
												</div>
											</div>
											<div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1% 0' }}>
												<h4 style={{ margin: '0', padding: '0' }}>Feedback</h4>
												<div style={{ display: 'flex', width: '40%', justifyContent: 'space-between' }}>
													<p>{this.state.responses}</p>
													<p>{((this.state.responses / this.state.sent) * 100).toFixed(0)}%</p>
												</div>
											</div>
											<div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1% 0' }}>
												<h4 style={{ margin: '0', padding: '0' }}>Clicks</h4>
												<div style={{ display: 'flex', width: '40%', justifyContent: 'space-between' }}>
													<p>{this.state.click}</p>
													<p>{((this.state.click / this.state.sent) * 100).toFixed(0)}%</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							) : null}
						</div>
						{this.state.og.c_id ? (
							this.state.og.reviews.reviews.length >= 5 &&
							Math.abs(this.state.og.reviews.reviews[0].totalReviews - this.state.og.reviews.reviews[this.state.og.reviews.reviews.length - 1].totalReviews) >=
								2 ? (
								<div style={{ width: '100%', height: '20vh' }} className="card">
									{this.ReviewsGraph()}
								</div>
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
