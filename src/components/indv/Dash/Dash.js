import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, LargeContentHolder, ReportTable, pagination, LoadingWrapperSmall } from '../../../utilities/index';
import Moment from 'moment';
import { Select } from 'react-materialize';
import simString from 'string-similarity';
import { debounce } from 'lodash';
import 'react-dates/lib/css/_datepicker.css';
import { KnowledgeCard, Pages, CustomerList, orderCusts, addFilter, Header, ManualRequest, FilterOptions } from './DashComp';
import 'react-dates/initialize';
import ReactToolTip from 'react-tooltip';
const { detect } = require('detect-browser');
const browser = detect();
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
		if (browser.name === 'chrome') {
			if (Array.isArray(this.props.location.state.info)) {
				let item = this.props.location.state.info.filter((item) => item.c_id === parseInt(client_id));
				if (item[0]) {
					this.setState({ bus: item });
					if (
						Array.isArray(this.props.location.state.focus_cust) ? this.props.location.state.focus_cust.filter((e) => e.c_id === parseInt(client_id))[0] : false
					) {
						let info = this.props.location.state.focus_cust.filter((e) => e.c_id === parseInt(client_id));
						document.title = `${item[0].company_name}`;
						await this.settingState(item, info);
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
		} else {
			await this.notChrome();
			await this.setState({ loading: false });
		}
	}
	componentWillUnmount() {
		this.axiosCancelSource.cancel('Component unmounted.');
	}
	async notChrome() {
		let { client_id, cor_id } = this.props.match.params;
		let getCust = async (comp) => {
			let cust = await axios.get(`/api/indv/comp/customers/${client_id}`, { cancelToken: this.axiosCancelSource.token });
			if (cust.data.msg === 'GOOD') {
				await this.settingState(comp, cust.data.info);
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
			let item = this.props.location.state.info.filter((e) => e.c_id === parseInt(client_id));
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
	async settingState(comp, cust) {
		let info = cust;
		let item = comp;
		let lastThirty = Moment().subtract(31, 'days').format('YYYY-MM-DD');
		let monthlyEmailSend = info.filter((e) => e.last_sent >= lastThirty && (e.source === 'Email' || e.source === null)).length;
		let promoters = info.filter((e) => e.rating > 3 && e.rating !== null).length;
		let demoters = info.filter((e) => e.rating < 3 && e.rating !== null).length;
		let responses = info.filter((e) => e.rating !== null).length;
		let lastUpdated = '';
		if (info[0]) {
			lastUpdated = info.sort((a, b) => (a.date_added < b.date_added ? 1 : -1))[0].date_added;
			info = info.sort((a, b) =>
				Moment(a.activity.active[a.activity.active.length - 1].date).format('x') < Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
					? 1
					: -1,
			);
		}
		this.setState({
			bus: item,
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
	}
	async getCust(cor_id, info) {
		let { client_id } = this.props.match.params;
		this.setState({ autoPaused: true });
		// this.setState({ info: info, og: info, bus: info });
		await axios.get(`/api/indv/customers/${cor_id}`, { cancelToken: this.axiosCancelSource.token }).then((res) => {
			res = res.data;
			if (res.msg === 'GOOD') {
				if (res.info[0]) {
					if (res.info.filter((e) => e.c_id === parseInt(client_id))[0]) {
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
			let similar = await og
				.filter((e) => e.email && e.first_name && e.last_name && e.id && e.activity.active)
				.filter(
					(item) =>
						item.email.toLowerCase().includes(value) ||
						(item.first_name + ' ' + item.last_name).toLowerCase().includes(value) ||
						simString.compareTwoStrings(value, (item.first_name + ' ' + item.last_name).toLowerCase()) >= 0.5 ||
						item.id.toString().toLowerCase().includes(value) ||
						item.activity.active[item.activity.active.length - 1].type.toLowerCase().includes(value),
				);
			this.setState({ info: similar, filteredTotal: similar.length });
		} else if (value.length <= 1) {
			this.setState({ info: og, filteredTotal: 0 });
		}
	}
	async Filter(value) {
		let { og } = this.state;
		let activity = await og.filter((item) => item.activity[item.activity.length - 1].type.includes(value));
		this.setState({ info: activity });
	}
	updateState(type, val) {
		if (Array.isArray(type)) {
			type.forEach((e) => {
				let { t, v } = e;
				this.setState({ [t]: v });
			});
		} else {
			this.setState({ [type]: val });
		}
	}
	GetCustomerInfo(info) {
		info = info.sort((a, b) => (a.active > b.active ? -1 : 1)).filter((value, index, self) => self.map((x) => x.cus_id).indexOf(value.cus_id) === index);
		let { current, perPage } = this.state;
		let page = pagination(info, current, perPage);

		if (page.arr[0]) {
			return page.arr
				.sort((a, b) => (a.active <= b.active ? 1 : -1))
				.map((info, i) => {
					return <CustomerList info={info} i={i} key={i} {...this.props} state={this.state} AddToSelected={this.AddToSelected.bind(this)} />;
				});
		}
	}
	async AddToSelected(info) {
		let { selected, og } = this.state;
		if (selected.some((a) => parseInt(a.cus_id) === parseInt(info.cus_id))) {
			let ind = selected.findIndex((a) => parseInt(a.cus_id) === parseInt(info.cus_id));
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
			await info.slice(current * perPage - perPage, current * perPage).map((i) => {
				if (!selected.some((a) => a.cus_id === i.cus_id)) {
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
			console.log(type);
			await axios.post('/api/request/send', { selected, bus, type }).then(async (res) => {
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
		await axios.post('/api/indv/dash/delete-customer', { selected, og: this.state.bus[0] }).then((res) => {
			if (res.data.msg === 'GOOD') {
				if (Array.isArray(res.data.cust)) {
					this.props.location.state.focus_cust = res.data.cust;
				}
				this.props.history.replace(this.props.location.pathname, this.props.location.state);
				this.setState({ deleting: false });
			} else {
				alert(res.data.msg);
			}
		});
	}
	async orderCust(num, order) {
		let { orderBool, info } = this.state;
		let og = await orderCusts({ num, order, orderBool, info });
		orderBool[order] = !orderBool[order];
		if (!this.state.filters.some((e) => e === 'inactive')) {
			og = await og.sort((a, b) => (a.active > b.active ? -1 : 1));
		}
		this.setState({ orderBool, current: 1 });
		this.GetCustomerInfo(og);
	}

	async addFilters() {
		let { og, filters, startDate, endDate, bus } = this.state;
		if (filters[0]) {
			let inf = await addFilter({ og, filters, startDate, endDate, bus });
			this.setState({ info: inf, filteredTotal: inf.length, current: 1 });
		} else {
			this.setState({ info: og, filteredTotal: 0 });
		}
	}
	async removeFilters() {}
	render() {
		let { loc } = this.props.match.params;
		let { promoters, demoters, responses, smsSent, emailSent } = this.state;
		let { info, current, perPage } = this.state;
		let width = window.innerWidth;
		let pages = info[0] ? <Pages info={info} current={current} perPage={perPage} updateState={this.updateState.bind(this)} /> : null;
		// let customers =
		// let permission = this.props.location.state.permissions;

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
							<h1 style={{ marginTop: '5%' }}>{`${
								this.state.bus[0].company_name.length > 25 ? this.state.bus[0].company_name.substring(0, 25) : this.state.bus[0].company_name
							}'s Dashboard`}</h1>
						</div>
						<KnowledgeCard {...this.props} nps={nps} state={this.state} updateState={this.updateState.bind(this)} emailSent={emailSent} smsSent={smsSent} />
					</div>
					{/* <hr /> */}
					<LargeContentHolder width={width >= 1500 ? '100%' : '105%'} left={width >= 1500 ? '5vw' : '12.5vw'}>
						{this.state.msg ? <h4 style={{ margin: '0 0 2.5% 0', padding: '0' }}>{this.state.msg}</h4> : ''}
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
										onChange={(e) => {
											this.setState({ searchValue: e.target.value });
											this.Search();
										}}
									/>
								</div>
								<FilterOptions state={this.state} updateState={this.updateState.bind(this)} {...this.props} addFilters={this.addFilters.bind(this)} />
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
									<ManualRequest state={this.state} {...this.props} SendRequest={this.SendRequest.bind(this)} updateState={this.updateState.bind(this)} />
								</LoadingWrapperSmall>
								{this.state.selected[0] ? 'or' : null}
								<LoadingWrapperSmall loading={this.state.deleting}>
									<button
										className={`btn ${this.state.selected[0] ? 'primary-color primary-hover' : 'secondary-color secondary-hover'}`}
										onClick={this.state.selected[0] ? () => this.delete() : null}
										disabled={!this.state.selected[0] ? 'disabled' : ''}
									>
										Delete
									</button>
								</LoadingWrapperSmall>
								{['10', '20', '50', '75', '100', '200', '300', '400', '500'].some((e) => e === this.state.perPage.toString()) ? (
									<div className="input-field noselect">
										<label style={{ margin: '0' }}>Showing:</label>
										<Select
											value={this.state.perPage.toString()}
											onChange={(e) => this.setState({ perPage: parseInt(e.target.value), current: 1 })}
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
											onChange={(e) => this.setState({ perPage: parseInt(e.target.value), current: 1 })}
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
							<Header state={this.state} {...this.props} AddAllSelected={this.AddAllSelected.bind(this)} orderCust={this.orderCust.bind(this)} />
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
