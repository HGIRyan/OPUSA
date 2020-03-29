import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
	Layout1,
	LoadingWrapper,
	LargeContentHolder,
	ReportTable,
	MapTR,
	DefaultLink,
	pagination,
	LoadingWrapperSmall,
	Infobox,
} from './../../utilities/index';
import Moment from 'moment';
import { Select, Modal } from 'react-materialize';
// import GenInfo from './components/GenInfo';
import simString from 'string-similarity';
import { debounce } from 'lodash';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import ReactToolTip from 'react-tooltip';
import { DateRangePicker } from 'react-dates';

class Dash extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			customer: [],
			bus: [{ company_name: '' }],
			showFilter: false,
			SearchBy: 'first_name',
			refresh: 1,
			info: [],
			og: [],
			selected: [],
			sel: false,
			msg: '',
			order: 0,
			current: 1,
			perPage: 20,
			orderBool: { one: false, two: false, three: false, four: false, five: false, six: false, seven: false, eight: false },
			deleting: false,
			service: 'reviews',
			type: { subject: 's_subject', email: 's' },
			emailSent: null,
			smsSent: null,
			promoters: null,
			demoters: null,
			filters: [],
			filteredTotal: 0,
			autoAmt: '0',
			autoPaused: false,
			startDate: Moment('2005-05-05'),
			endDate: Moment(),
			customDates: true,
			lastUpdated: '',
		};
		this.Search = debounce(
			() => {
				this.Searchval();
			},
			300,
			{
				leading: false,
				trailing: true,
			},
		);
		this.getCust = this.getCust.bind(this);
	}
	async componentDidMount() {
		this.setState({ loc: this.props.location.pathname });
		let { client_id } = this.props.match.params;
		this.axiosCancelSource = axios.CancelToken.source();
		if (Array.isArray(this.props.location.state.info)) {
			let item = this.props.location.state.info.filter(item => item.c_id === parseInt(client_id));
			if (item[0]) {
				this.setState({ bus: item });
				if (Array.isArray(this.props.location.state.focus_cust) ? this.props.location.state.focus_cust.filter(e => e.c_id === parseInt(client_id))[0] : false) {
					let info = this.props.location.state.focus_cust.filter(e => e.c_id === parseInt(client_id));
					let lastThirty = Moment()
						.subtract(31, 'days')
						.format('YYYY-MM-DD');
					let monthlyEmailSend = info.filter(e => e.last_sent >= lastThirty && (e.source === 'Email' || e.source === null)).length;
					let promoters = info.filter(e => e.rating > 3 && e.rating !== null).length;
					let demoters = info.filter(e => e.rating < 3 && e.rating !== null).length;
					let responses = info.filter(e => e.rating !== null).length;
					let lastUpdated = '';
					if (info[0]) {
						lastUpdated = info.sort((a, b) => (a.date_added < b.date_added ? 1 : -1))[0].date_added;
						info = info.sort((a, b) =>
							Moment(a.activity.active[a.activity.active.length - 1].date).format('x') <
							Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
								? 1
								: -1,
						);
					}
					this.setState({
						og: info,
						info,
						emailSent: monthlyEmailSend,
						smsSent: 0,
						promoters,
						demoters,
						responses,
						autoAmt: item[0].auto_amt.amt.toString(),
						autoPaused: item[0].auto_amt.pause ? item[0].auto_amt.pause : false,
						lastUpdated,
					});
				} else {
					let { cor_id } = item[0];
					await this.getCust(cor_id, item);
				}
			} else {
				await this.GetInfo();
			}
		} else {
			await this.GetInfo();
		}
		await this.setState({ loading: false });
	}
	componentWillUnmount() {
		this.axiosCancelSource.cancel('Component unmounted.');
	}
	async getCust(cor_id, info) {
		let { client_id } = this.props.match.params;
		// this.setState({ info: info, og: info, bus: info });
		await axios.get(`/api/indv/customers/${cor_id}`, { cancelToken: this.axiosCancelSource.token }).then(res => {
			res = res.data;
			if (res.msg === 'GOOD') {
				if (res.info[0]) {
					if (res.info.filter(e => e.c_id === parseInt(client_id))[0]) {
						this.props.location.state.focus_cust = res.info;
						this.props.history.replace(this.props.location.pathname, this.props.location.state);
					} else {
						this.setState({ info: [{ cus_id: 0, first_name: 'No', last_name: 'Customer', active: true, activity: { active: [{ type: 'NO CUSTOMERS' }] } }] });
					}
				} else {
					this.setState({ info: [{ cus_id: 0, first_name: 'No', last_name: 'Customer', active: true, activity: { active: [{ type: 'NO CUSTOMERS' }] } }] });
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
	async GetInfo() {
		alert('ERROR: REDIRECTING TO LOG IN PAGE');
		this.props.history.push('/');
	}

	async Searchval() {
		let { og, searchValue } = this.state;
		if (this.state.current !== 1) {
			this.setState({ current: 1 });
		}
		let value = await searchValue.toLowerCase();
		if (value.length >= 2) {
			// prettier-ignore
			let similar = await og
				// .filter( e => e.first_name && e.last_name && e.id && e.email_status && e.activity );
				.filter(
					item =>
						(item.last_name && item.first_name) ? (item.first_name + ' ' + item.last_name).toLowerCase().includes(value) : '' ||
						(item.first_name && item.last_name) ? simString.compareTwoStrings(value, (item.first_name + ' ' + item.last_name).toLowerCase()) >= 0.5 : '' ||
						(item.email) ? simString.compareTwoStrings(value, (item.email).toLowerCase()) >= 0.5 : '' ||
						// item.last_name ? simString.compareTwoStrings(value, item.last_name.toLowerCase()) >= 0.5 : '' ||
						item.id ? simString.compareTwoStrings( value, item.id.toString().toLowerCase() ) >= 0.5 : '' ||
						// item.rating ? item.rating.toString().includes(value) : ''
						// ||
						item.activity ? item.activity.active[ item.activity.active.length - 1 ].type.toLowerCase().includes(value) : ''
						// simString.compareTwoStrings( value, item.activity.active[ item.activity.active.length - 1 ].type.toLowerCase() ) >= 0.5
						// ||
						// simString.compareTwoStrings(value, item.email_status.toLowerCase()) >= 0.5
						// ||
						// simString.compareTwoStrings(value, item.last_email.toLowerCase()) >= 0.5
				);
			this.setState({ info: similar, filteredTotal: similar.length });
		} else if (value.length <= 1) {
			this.setState({ info: og, filteredTotal: 0 });
		}
	}
	async Filter(value) {
		let { og } = this.state;
		let activity = await og.filter(item => item.activity[item.activity.length - 1].type.includes(value));
		this.setState({ info: activity });
	}
	GetCustomerInfo(info) {
		info = info.sort((a, b) => (a.active > b.active ? -1 : 1)).filter((value, index, self) => self.map(x => x.cus_id).indexOf(value.cus_id) === index);
		let { current, perPage } = this.state;
		let page = pagination(info, current, perPage);
		let { client_id, cor_id } = this.props.match.params;
		let strike = { textDecoration: 'line-through' };
		if (page.arr[0]) {
			return page.arr
				.sort((a, b) => (a.active <= b.active ? 1 : -1))
				.map((info, i) => {
					return (
						<MapTR key={info.cus_id} index={i} style={{ backgroundColor: info.active ? '' : 'rgba(255, 2, 2, 0.25)' }}>
							<td style={{ textAlign: 'center' }}>
								<label>
									<input
										type="checkbox"
										checked={this.state.selected.some(a => a.cus_id === info.cus_id)}
										onChange={() => {
											this.AddToSelected(info);
										}}
									/>
									<span style={!info.active ? strike : null}>{info.active ? '' : 'INACTIVE'}</span>
								</label>
							</td>
							<td
								style={(!info.active ? strike : null, { cursor: 'pointer' })}
								onClick={() => this.props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, this.props.location.state)}
							>
								<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: this.props.location.state }}>
									{info.cus_id}
								</DefaultLink>
							</td>
							<td
								style={(!info.active ? strike : null, { cursor: 'pointer' })}
								onClick={() => this.props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, this.props.location.state)}
							>
								<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: this.props.location.state }}>
									{info.first_name.toProper() + ' ' + info.last_name.toProper()}
								</DefaultLink>
							</td>
							<td
								style={(!info.active ? strike : null, { cursor: 'pointer' })}
								onClick={() => this.props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, this.props.location.state)}
							>
								<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: this.props.location.state }}>
									{info.rating ? info.rating : 'N/A'}
								</DefaultLink>
							</td>
							<td
								style={(!info.active ? strike : null, { cursor: 'pointer' })}
								onClick={() => this.props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, this.props.location.state)}
							>
								<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: this.props.location.state }}>
									{info.feedback_text ? info.feedback_text.slice(0, 30) : 'N/A'}
								</DefaultLink>
							</td>
							<td
								style={(!info.active ? strike : null, { cursor: 'pointer' })}
								onClick={() => this.props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, this.props.location.state)}
							>
								<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: this.props.location.state }}>
									{info.activity.active[info.activity.active.length - 1].type}
								</DefaultLink>
							</td>
							<td
								style={(!info.active ? strike : null, { cursor: 'pointer' })}
								onClick={() => this.props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, this.props.location.state)}
							>
								<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: this.props.location.state }}>
									{info.last_email ? info.last_email : 'NOT SENT'}
								</DefaultLink>
							</td>
							<td
								style={(!info.active ? strike : null, { cursor: 'pointer' })}
								onClick={() => this.props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, this.props.location.state)}
							>
								<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: this.props.location.state }}>
									{info.service}
								</DefaultLink>
							</td>
							<td
								style={(!info.active ? strike : null, { cursor: 'pointer' })}
								onClick={() => this.props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, this.props.location.state)}
							>
								<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: this.props.location.state }}>
									{info.activity.active[info.activity.active.length - 1].date < '2016-05-25'
										? 'NOT SENT'
										: Moment(info.activity.active[info.activity.active.length - 1].date).format('MMM Do, YY')}
								</DefaultLink>
							</td>
						</MapTR>
					);
				});
		}
	}
	async AddToSelected(info) {
		let { selected, og } = this.state;
		if (selected.some(a => parseInt(a.cus_id) === parseInt(info.cus_id))) {
			let ind = selected.findIndex(a => parseInt(a.cus_id) === parseInt(info.cus_id));
			if (ind !== -1) {
				selected.splice(ind, 1);
			} else {
				alert('ERROR: PLEASE REFRESH PAGE');
			}
			await this.setState({ selected });
			await this.GetCustomerInfo(og);
		} else {
			selected.push(info);
			await this.setState({ selected: selected });
			await this.GetCustomerInfo(og);
		}
	}
	async AddAllSelected() {
		let { info, selected, sel, perPage, current } = this.state;
		if (!sel) {
			await info.slice(current * perPage - perPage, current * perPage).map(i => {
				if (!selected.some(a => a.cus_id === i.cus_id)) {
					selected.push(i);
				}
				return null;
			});
			this.setState({ sel: true });
			await this.GetCustomerInfo(info);
		} else {
			this.setState({ sel: false, selected: [] });
			await this.GetCustomerInfo(info);
		}
	}
	async SendRequest() {
		let { selected, bus, og, type } = this.state;
		if (selected[0]) {
			this.setState({ sending: true });
			bus = Array.isArray(bus) ? bus[0] : bus;
			await axios.post('/api/request/send', { selected, bus, type }).then(async res => {
				if (res.data.msg === 'GOOD') {
					this.setState({ msg: `Sent ${res.data.sent} email${res.data.sent > 1 ? 's' : ''}`, selected: [], sending: false });
					await this.GetCustomerInfo(og);
				} else {
					alert(res.data.msg);
					this.setState({ sending: false });
				}
			});
		}
	}
	async delete() {
		this.setState({ deleting: true });
		let { selected } = this.state;
		await axios.post('/api/indv/dash/delete-customer', { selected, og: this.state.bus[0] }).then(res => {
			if (res.data.msg === 'GOOD') {
				if (Array.isArray(res.data.cust)) {
					this.props.location.state.focus_cust = res.data.cust;
				}
				console.log(res.data.cust);
				this.props.history.replace(this.props.location.pathname, this.props.location.state);
				this.setState({ deleting: false });
			} else {
				alert(res.data.msg);
			}
		});
	}
	async orderCust(num, order) {
		let { orderBool, info } = this.state;
		let og;
		switch (true) {
			case num === 1:
				og = orderBool[order] ? await info.sort((a, b) => (a.id < b.id ? 1 : -1)) : await info.sort((a, b) => (a.id > b.id ? 1 : -1));
				break;
			case num === 2:
				og = orderBool[order]
					? await info.sort((a, b) => (a.first_name < b.first_name ? 1 : -1))
					: await info.sort((a, b) => (a.first_name > b.first_name ? 1 : -1));
				break;
			case num === 3:
				og = orderBool[order] ? await info.sort((a, b) => (a.rating > b.rating ? 1 : -1)) : await info.sort((a, b) => (a.rating < b.rating ? 1 : -1));
				break;
			case num === 4:
				og = orderBool[order]
					? await info.sort((a, b) => (a.feedback_text > b.feedback_text ? 1 : -1))
					: await info.sort((a, b) => (a.feedback_text < b.feedback_text ? 1 : -1));
				break;
			case num === 5:
				og = orderBool[order]
					? await info.sort((a, b) =>
							Moment(a.activity.active[a.activity.active.length - 1].date).format('x') <
							Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
								? 1
								: -1,
					  )
					: await info.sort((a, b) =>
							Moment(a.activity.active[a.activity.active.length - 1].date).format('x') >
							Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
								? 1
								: -1,
					  );
				break;
			case num === 6:
				og = orderBool[order]
					? await info.sort((a, b) => (a.last_email > b.last_email ? 1 : -1))
					: await info.sort((a, b) => (a.last_email < b.last_email ? 1 : -1));
				break;
			case num === 7:
				og = orderBool[order] ? await info.sort((a, b) => (a.id > b.id ? 1 : -1)) : await info.sort((a, b) => (a.id > b.id ? 1 : -1));
				break;
			case num === 8:
				og = orderBool[order]
					? await info.sort((a, b) =>
							Moment(a.activity.active[a.activity.active.length - 1].date).format('x') <
							Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
								? 1
								: -1,
					  )
					: await info.sort((a, b) =>
							Moment(a.activity.active[a.activity.active.length - 1].date).format('x') >
							Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
								? 1
								: -1,
					  );
				break;
			default:
				break;
		}
		orderBool[order] = !orderBool[order];
		if (!this.state.filters.some(e => e === 'inactive')) {
			og = await og.sort((a, b) => (a.active > b.active ? -1 : 1));
		}
		this.setState({ orderBool });
		this.GetCustomerInfo(og);
	}
	async chanegPage(num) {
		let { current, info, perPage } = this.state;
		let pages = Math.ceil(info.length / perPage);
		if (num !== '-1' && num !== '+1') {
			this.setState({ current: num });
		} else {
			if (num === '+1' && current !== pages) {
				this.setState({ current: current + 1 });
			} else if (num === '-1' && current !== 1) {
				this.setState({ current: current - 1 });
			}
		}
	}
	async addFilters() {
		let { og, filters, startDate, endDate } = this.state;
		let all = [];
		if (filters[0]) {
			filters.forEach(el => {
				if (el === 'dem') {
					all.push(og.filter(e => e.rating === 1 || e.rating === 2));
				} else if (el === 'pass') {
					all.push(og.filter(e => e.rating === 3));
				} else if (el === 'prom') {
					all.push(og.filter(e => e.rating === 4 || e.rating === 5));
				} else if (el === 'feed') {
					all.push(og.filter(e => e.feedback_text !== 'N/A' && e.f_id));
				} else if (el === 'open') {
					all.push(og.filter(e => e.f_id && e.opened_time));
				} else if (el === 'sent') {
					all.push(
						og
							.filter(e => e.f_id && Array.isArray(e.activity.active))
							.filter(e => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('first')),
					);
				} else if (el === 'sr') {
					all.push(
						og
							.filter(e => e.f_id && Array.isArray(e.activity.active))
							.filter(e => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('second')),
					);
				} else if (el === 'or') {
					all.push(
						og
							.filter(e => e.f_id && Array.isArray(e.activity.active))
							.filter(e => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('opened reminder')),
					);
				} else if (el === 'pr') {
					all.push(
						og
							.filter(e => e.f_id && Array.isArray(e.activity.active))
							.filter(e => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('positive reminder')),
					);
				} else if (el === 'spr') {
					all.push(
						og
							.filter(e => e.f_id && Array.isArray(e.activity.active))
							.filter(e => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('second positive')),
					);
				} else if (el === 'added') {
					all.push(
						og
							.filter(e => e.f_id && Array.isArray(e.activity.active))
							.filter(e => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('added')),
					);
				} else if (el === 'click') {
					all.push(og.filter(e => e.f_id && Array.isArray(e.activity.active)).filter(e => e.click));
				} else if (el === 'active') {
					all.push(og.filter(e => e.active));
				} else if (el === 'inactive') {
					all.push(og.filter(e => !e.active));
				} else if (el === 'last_sent') {
					all.push(
						og.filter(e => {
							let last = Moment(e.last_sent).format('x');
							return last >= startDate.format('x') && last <= endDate.format('x');
						}),
					);
				}
			});
			let inf = all.flat().uniq();
			this.setState({ info: inf, filteredTotal: inf.length });
		} else {
			this.setState({ info: og, filteredTotal: 0 });
		}
	}
	async updateAuto(val, type) {
		let { c_id, cor_id } = this.state.bus[0];
		let { bus, autoPaused, autoAmt } = this.state;
		if (type === 'amt') {
			bus[0].auto_amt = { amt: parseInt(val), pause: autoPaused };
			this.setState({ autoAmt: val });
		} else if (type === 'check') {
			bus[0].auto_amt = { amt: parseInt(autoAmt), pause: val };
			this.setState({ autoPaused: val });
		}
		let amt = bus[0].auto_amt;
		await axios.post('/api/update/auto', { amt, c_id, cor_id }).then(res => {
			if (res.data.msg === 'GOOD') {
				this.props.location.state.info.splice(
					this.props.location.state.info.findIndex(e => parseInt(e.c_id) === parseInt(c_id)),
					1,
					bus[0],
				);
				this.props.history.replace(this.props.location.pathname, this.props.location.state);
			} else {
				alert(res.data.msg);
			}
		});
	}
	async removeFilters() {}
	render() {
		let { loc } = this.props.match.params;
		let { promoters, demoters, responses, smsSent, emailSent } = this.state;
		// let address = bus ? (bus[0] ? bus[0].address : {}) : {};
		// let p = { margin: '0' };
		// let h5 = { marginTop: '1vh' };
		let { info, current, perPage } = this.state;
		let width = window.innerWidth;
		let pages = info[0] ? (
			<div
				style={{
					// width: `${width >= 1500 ? '' : '90vw'}`,
					// minWidth: '50%',
					display: 'flex',
					alignItems: 'center',
					// justifyContent: 'space-around',
					marginLeft: `${width >= 1500 ? '2vw' : '12.5%'}`,
					// position: 'fixed',
					borderBottom: 'solid gray 1px',
					paddingBottom: '.5%',
				}}
			>
				<button className={`btn ${current === 1 ? 'secondary-color' : 'primary-color primary-hover'}`} onClick={() => this.chanegPage('-1')}>
					<i className="material-icons">arrow_back_ios </i>
				</button>
				{pagination(info, current, perPage)
					.pages.slice(current <= 4 ? current - 1 : current - 5, current + 4)
					.map(number => {
						return (
							<button
								key={number}
								id={number}
								onClick={() => this.chanegPage(number)}
								style={{ margin: '0 2.5%' }}
								className={`btn ${current === number ? 'secondary-color' : 'primary-color primary-hover'}`}
							>
								{number === current - 4 ? '...' : ''}
								{number}
								{number === current + 4 ? '...' : ''}
							</button>
						);
					})}
				<button
					className={`btn ${current === Math.ceil(info.length / perPage) ? 'secondary-color' : 'primary-color primary-hover'}`}
					onClick={() => this.chanegPage('+1')}
				>
					<i className="material-icons">arrow_forward_ios</i>
				</button>
			</div>
		) : null;
		// let customers =
		let permission = this.props.location.state.permissions;
		let filterStyle = {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			justifyContent: 'flex-start',
			minHeight: '20vh',
			// border: 'solid black',
		};
		let p = { margin: '0' };
		let h5 = { marginTop: '1vh' };
		let nps = ((promoters / responses - demoters / responses) * 100).toFixed(0);
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: this.state.bus, loc }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<div
						style={{
							height: '12vh',
							width: width >= 1500 ? '100%' : '105%',
							// border: 'solid black',
							marginLeft: width >= 1500 ? '5vw' : '12.5vw',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<div>
							<h1 style={{ marginTop: '5%' }}>{`${this.state.bus[0].company_name}'s Dashboard`}</h1>
						</div>
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
												value={this.state.autoAmt}
												className="no-border"
												onChange={e => this.updateAuto(e.target.value, 'amt')}
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
											<label
												style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%', marginTop: '2.5%' }}
											>
												<input type="checkbox" checked={this.state.autoPaused} onChange={e => this.updateAuto(!this.state.autoPaused, 'check')} />
												<span className="tab"></span>
											</label>
										</div>
										<br />
										<p style={{ marginTop: '-10%' }}>Pause Auto</p>
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
										<h4 style={(p, { marginTop: '-1%' })}>
											{this.state.og
												.filter(e => e.active)
												.length.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
											/
											{this.state.og
												.filter(e => !e.active)
												.length.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										</h4>
										<h6 style={(p, { marginTop: '-25%' })}>Total: {this.state.og.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>
									</Infobox>
								</Infobox>
								<ReactToolTip id="last_sent" type="dark" effect="float" place="bottom">
									<span>
										Active Contacts / Inactive Contacts
										<br />
										Total Contacts
										<br />
										Date of last List Upload: {this.state.lastUpdated.split('T')[0]}
									</span>
								</ReactToolTip>
							</Infobox>
						</div>
					</div>
					{/* <hr /> */}
					<LargeContentHolder width={width >= 1500 ? '100%' : '105%'} left={width >= 1500 ? '5vw' : '12.5vw'}>
						{this.state.msg ? <h4 style={{ margin: '0 0 2.5% 0', padding: '0' }}>{this.state.msg}</h4> : ''}
						{/* <GenInfo
							style={{ width: '80%', height: '12vh', backgroundColor: 'rgb(245, 245, 245)', cursor: 'default', left: '-2.5vw', display: 'flex', top: '-2.5vh' }}
							bus={bus}
							promoters={this.state.promoters}
							responses={this.state.responses}
							demoters={this.state.demoters}
							smsSent={this.state.smsSent}
							emailSent={this.state.emailSent}
							length={this.state.og.length}
							location={this.props.location}
							history={this.props.history}
						/> */}
						<div className="row valign-wrapper" style={{ width: '100%', marginTop: '-2.5vh' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div className="col s8" style={{ marginLeft: '0%', width: '15vw', display: 'flex', alignItems: 'center', marginRight: '10%' }}>
									<i className="material-icons" style={{ marginLeft: '-5%' }}>
										search
									</i>
									<input
										id="search"
										type="search"
										placeholder="Search"
										className="validate"
										autoFocus
										style={{ color: 'black', fontSize: '2em', width: '15vw', margin: '0', marginLeft: '-5%' }}
										onChange={e => {
											this.setState({ searchValue: e.target.value });
											this.Search();
										}}
									/>
								</div>
								<Modal
									style={{ outline: 'none', padding: '0', minHeight: this.state.customDates ? '' : '70vh' }}
									header="Filter Customers"
									options={{
										dismissible: true,
										endingTop: '10%',
										inDuration: 250,
										onCloseEnd: null,
										onCloseStart: null,
										onOpenEnd: null,
										onOpenStart: null,
										opacity: 0.5,
										outDuration: 250,
										preventScrolling: true,
										startingTop: '4%',
									}}
									trigger={
										<button className="btn primary-color primary-hover" style={{ margin: '5%', display: 'flex', justifyContent: 'center', width: '25%' }}>
											Filter
										</button>
									}
								>
									<div style={{ outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
										<div style={filterStyle}>
											<h5>Rating</h5>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'dem')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'dem')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'dem') });
														} else {
															await this.setState({ filters: this.state.filters.concat('dem') });
														}
														await this.addFilters();
													}}
												/>
												<span>Detractors (1 & 2)</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'pass')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'pass')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'pass') });
														} else {
															await this.setState({ filters: this.state.filters.concat('pass') });
														}
														await this.addFilters();
													}}
												/>
												<span>Passives (3)</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'prom')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'prom')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'prom') });
														} else {
															await this.setState({ filters: this.state.filters.concat('prom') });
														}
														await this.addFilters();
													}}
												/>
												<span>Promoters (4 & 5)</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'feed')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'feed')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'feed') });
														} else {
															await this.setState({ filters: this.state.filters.concat('feed') });
														}
														await this.addFilters();
													}}
												/>
												<span>Left Feedback</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'active')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'active')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'active') });
														} else {
															await this.setState({ filters: this.state.filters.concat('active') });
														}
														await this.addFilters();
													}}
												/>
												<span>Active</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'inactive')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'inactive')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'inactive') });
														} else {
															await this.setState({ filters: this.state.filters.concat('inactive') });
														}
														await this.addFilters();
													}}
												/>
												<span>Inactive</span>
											</label>
											<div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
												{/* <label data-tip data-for="last_sent">
													<input
														type="checkbox"
														checked={this.state.filters.some(e => e === 'last_sent')}
														onChange={async () => {
															if (this.state.filters.some(e => e === 'last_sent')) {
																await this.setState({ filters: this.state.filters.filter(e => e !== 'last_sent') });
															} else {
																await this.setState({ filters: this.state.filters.concat('last_sent') });
															}
															await this.addFilters();
														}}
													/>
													<span></span>
												</label> */}
												{this.state.customDates ? (
													<div className="input-field noselect">
														<label style={{ margin: '0' }}>
															{this.state.startDate.format('YYYY-MM-DD') === '2005-05-05' ? '' : this.state.startDate.format('YYYY-MM-DD')}
														</label>
														<Select
															value={this.state.startDate.format('YYYY-MM-DD')}
															onChange={async e => {
																e.target.value === 'custom'
																	? this.setState({ customDates: false, startDate: Moment().subtract(7, 'days') })
																	: this.setState({ startDate: Moment(e.target.value) });
																if (e.target.value !== Moment('2005-05-05').format('YYYY-MM-DD')) {
																	await this.setState({ filters: this.state.filters.concat('last_sent') });
																} else {
																	await this.setState({ filters: this.state.filters.filter(e => e !== 'last_sent') });
																}
																await this.addFilters();
															}}
															style={{ margin: '0', padding: '0', height: '1vh' }}
														>
															<option value={Moment('2005-05-05').format('YYYY-MM-DD')}>All Time</option>
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
													<div>
														<DateRangePicker
															startDate={this.state.startDate} // momentPropTypes.momentObj or null,
															startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
															endDate={this.state.endDate} // momentPropTypes.momentObj or null,
															endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
															onDatesChange={async ({ startDate, endDate }) => {
																await this.setState({ startDate, endDate });
																await this.addFilters();
															}} // PropTypes.func.isRequired,
															focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
															onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
															isOutsideRange={() => false}
														/>
														<button
															className="btn primary-color primary-hover"
															onClick={async () => {
																await this.setState({
																	customDates: true,
																	startDate: Moment('2005-05-05'),
																	filters: this.state.filters.filter(e => e !== 'last_sent'),
																});
																await this.addFilters();
															}}
														>
															All Time
														</button>
													</div>
												)}
											</div>
											<ReactToolTip id="last_sent" type="dark" effect="float" place="bottom">
												<span>
													Filters through to get customers where <br />
													last sent date is within parameters
												</span>
											</ReactToolTip>
										</div>
										<div style={filterStyle}>
											<h5>Activity</h5>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'open')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'open')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'open') });
														} else {
															await this.setState({ filters: this.state.filters.concat('open') });
														}
														await this.addFilters();
													}}
												/>
												<span>Opened</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'sent')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'sent')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'sent') });
														} else {
															await this.setState({ filters: this.state.filters.concat('sent') });
														}
														await this.addFilters();
													}}
												/>
												<span>Sent</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'sr')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'sr')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'sr') });
														} else {
															await this.setState({ filters: this.state.filters.concat('sr') });
														}
														await this.addFilters();
													}}
												/>
												<span>Second Reminder</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'or')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'or')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'or') });
														} else {
															await this.setState({ filters: this.state.filters.concat('or') });
														}
														await this.addFilters();
													}}
												/>
												<span>Opened Reminder</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'pr')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'pr')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'pr') });
														} else {
															await this.setState({ filters: this.state.filters.concat('pr') });
														}
														await this.addFilters();
													}}
												/>
												<span>Positive Reminder</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'spr')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'spr')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'spr') });
														} else {
															await this.setState({ filters: this.state.filters.concat('spr') });
														}
														await this.addFilters();
													}}
												/>
												<span>Second Positive Reminder</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'click')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'click')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'click') });
														} else {
															await this.setState({ filters: this.state.filters.concat('click') });
														}
														await this.addFilters();
													}}
												/>
												<span>Clicked Review Site</span>
											</label>
											<label>
												<input
													type="checkbox"
													checked={this.state.filters.some(e => e === 'added')}
													onChange={async () => {
														if (this.state.filters.some(e => e === 'added')) {
															await this.setState({ filters: this.state.filters.filter(e => e !== 'added') });
														} else {
															await this.setState({ filters: this.state.filters.concat('added') });
														}
														await this.addFilters();
													}}
												/>
												<span>Customer Added - Not Sent</span>
											</label>
										</div>
									</div>
								</Modal>
								{this.state.filteredTotal !== 0 ? <p style={{ margin: '0', padding: '0' }}> {this.state.filteredTotal} Total Results</p> : null}
							</div>
							<div
								className="col s6 right-align valign-wrapper center-align"
								style={{
									marginRight: width >= 1500 ? '.5%' : '.5%',
									display: 'flex',
									justifyContent: 'space-between',
									padding: '0',
									width: width >= 1500 ? '49%' : '59%',
								}}
							>
								<LoadingWrapperSmall
									loading={this.state.sending}
									style={{
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
										width: '12.5vw',
										// marginRight: '2.5',
									}}
								>
									{permission === 'admin' ? (
										<Modal
											className="scrollNone"
											trigger={
												<button
													node="button"
													className={`btn ${this.state.selected[0] ? 'primary-color primary-hover' : 'secondary-color secondary-hover'}`}
													disabled={!this.state.selected[0] ? 'disabled' : ''}
												>
													{window.innerWidth >= 1500 ? 'Send Request' : 'Send'}
												</button>
											}
											style={{ outline: 'none', paddingBottom: '8vh' }}
										>
											<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
												<h6>Send Feedback Request</h6>
												<p>
													To view or edit email templates, visit the{' '}
													<DefaultLink
														style={{ color: 'blue', textDecoration: 'underline' }}
														to={{
															pathname: `/client-dash/${this.props.match.params.cor_id}/emails/reviews/${this.props.match.params.client_id}`,
															state: this.props.location.state,
														}}
													>
														Email Editor Page
													</DefaultLink>
												</p>
												<p>Sending Emails To:</p>
												{this.state.selected.map(e => (
													<div
														style={{ margin: '0', padding: '1%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '60%' }}
														key={e.cus_id}
													>
														<p style={{ margin: '0', padding: '0' }}>• {`${e.first_name} ${e.last_name}  ( ${e.email} ) `}</p>
														<p style={{ margin: '0', padding: '0' }}>{`Last Sent ${e.last_sent === '2005-05-25' ? '----' : e.last_sent}`}</p>
													</div>
												))}
												<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0 0 1% 0' }}>
													<Select
														style={{ border: 'solid black', width: '50vw !important' }}
														value={this.state.type.email}
														onChange={e => this.setState({ type: { subject: `${e.target.value}_subject`, email: e.target.value } })}
														options={{
															dropdownOptions: {},
														}}
													>
														<option value="s">Standard First Send</option>
														<option value="fr">First Reminder</option>
														<option value="sr">Second Reminder</option>
														<option value="or">Opened Reminder</option>
														<option value="pr">Positive Feedback Reminder</option>
														<option value="spr">Second Positive Reminder</option>
													</Select>
												</div>
												<button
													className={`btn ${this.state.selected[0] ? 'primary-color primary-hover' : 'secondary-color secondary-hover'}`}
													onClick={this.state.selected[0] ? () => this.SendRequest() : null}
												>
													Send Request
												</button>
											</div>
										</Modal>
									) : null}
								</LoadingWrapperSmall>
								{this.state.selected[0] ? 'or' : null}
								<LoadingWrapperSmall loading={this.state.deleting}>
									{permission === 'admin' ? (
										<button
											className={`btn ${this.state.selected[0] ? 'primary-color primary-hover' : 'secondary-color secondary-hover'}`}
											onClick={this.state.selected[0] ? () => this.delete() : null}
											disabled={!this.state.selected[0] ? 'disabled' : ''}
										>
											Delete
										</button>
									) : null}
								</LoadingWrapperSmall>
								{['10', '20', '50', '75', '100', '200', '300', '400', '500'].some(e => e === this.state.perPage.toString()) ? (
									<div className="input-field noselect">
										<label style={{ margin: '0' }}>Showing:</label>
										<Select
											value={this.state.perPage.toString()}
											onChange={e => this.setState({ perPage: parseInt(e.target.value), current: 1 })}
											style={{ margin: '0', padding: '0', height: '1vh' }}
										>
											<option value="10">10</option>
											<option value="20">20</option>
											<option value="50">50</option>
											<option value="75">75</option>
											<option value="100">100</option>
											<option value="200">200</option>
											<option value="300">300</option>
											<option value="400">400</option>
											<option value="500">500</option>
										</Select>
									</div>
								) : (
									<div className="input-field">
										<label style={{ margin: '0' }}>Showing:</label>
										<Select
											value={this.state.perPage.toString()}
											onChange={e => this.setState({ perPage: parseInt(e.target.value), current: 1 })}
											style={{ margin: '0', padding: '0', height: '1vh' }}
										>
											<option value={this.state.perPage.toString()}>{this.state.perPage}</option>
										</Select>
									</div>
								)}
								<LoadingWrapperSmall loading={this.state.deleting}>
									<button
										className={`btn primary-color primary-hover`}
										onClick={() => this.props.history.push(`/indv-customer/new/${this.state.og[0].cor_id}/${this.state.og[0].c_id}`, this.props.location.state)}
									>
										Add Contact
									</button>
								</LoadingWrapperSmall>
							</div>
						</div>
					</LargeContentHolder>
					<LoadingWrapper loading={this.state.loading}>
						<ReportTable className="header responsive-table" style={{ marginLeft: width >= 1500 ? '5vw' : '12.5vw', width: width >= 1500 ? '100%' : '105%' }}>
							<thead className="theader">
								<tr style={{ paddingLeft: '5%' }}>
									<th style={{ borderRadius: '0', width: '5%', marginLeft: '5%', textAlign: 'center' }} data-tip data-for="all_select">
										<label>
											<input type="checkbox" checked={this.state.sel} onChange={() => this.AddAllSelected()} />
											<span style={{ color: 'white' }}></span>
										</label>
									</th>
									<th
										style={{ borderRadius: '0', width: '7.5%' }}
										onClick={() => {
											this.orderCust(1, 'one');
										}}
									>
										Customer ID
									</th>
									<th
										style={{ borderRadius: '0', width: '25%' }}
										onClick={() => {
											this.orderCust(2, 'two');
										}}
									>
										Name
									</th>
									<th
										style={{ borderRadius: '0', width: '5%' }}
										onClick={() => {
											this.orderCust(3, 'three');
										}}
									>
										Rating
									</th>
									<th
										style={{ borderRadius: '0', width: '15%' }}
										onClick={() => {
											this.orderCust(4, 'four');
										}}
									>
										Feedback
									</th>
									<th
										style={{ borderRadius: '0', width: '15%' }}
										onClick={() => {
											this.orderCust(5, 'five');
										}}
									>
										Activity
									</th>
									<th
										style={{ borderRadius: '0', width: '5%' }}
										onClick={() => {
											this.orderCust(6, 'six');
										}}
									>
										Source
									</th>
									<th
										style={{ borderRadius: '0', width: '5%' }}
										onClick={() => {
											this.orderCust(7, 'seven');
										}}
									>
										Service
									</th>
									<th
										style={{ borderRadius: '0', width: '10%' }}
										onClick={() => {
											this.orderCust(8, 'eight');
										}}
									>
										Last Activity
									</th>
								</tr>
							</thead>
							<tbody>
								{info[0] ? (
									this.GetCustomerInfo(info)
								) : (
									<tr>
										<td>No Contacts</td>
									</tr>
								)}
							</tbody>
						</ReportTable>
						<ReactToolTip id="all_select" type="dark" effect="float" place="bottom">
							<span>Select All On Current Page</span>
						</ReactToolTip>
						<div style={{ marginTop: '1vh', width: '80%', display: 'flex', justifyContent: 'center' }}>{pages}</div>
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Dash);
