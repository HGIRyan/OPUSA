// IMPORTS
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Layout1, LoadingWrapper, ThreeSplit, BoxSplit, RowContainer } from '../../../utilities/index';
import Pagination from '../function/Pagination';
import Moment from 'moment';
import { StatusDonut, ListTable, StatusStats, ActionStats } from './ReportComponents';
let sunday = Moment().day(0).format('YYYY-MM-DD');
class ReviewReport extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			pinfo: '',
			industry: '',
			searchBy: 'industry',
			id: false,
			type: false,
			name: false,
			auto: true,
			listSize: true,
			RemainingList: true,
			status: false,
			rating: 0,
			llrating: 0,
			sentStats: { sent: 0, opened: 0, received: 0, clicked: 0 },
		};
	}
	async componentDidMount() {
		document.title = `${process.env.REACT_APP_COMPANY_NAME} - Review Report`;
		let defaultDate = '2005-04-05';
		await this.setState({ loading: false });
		await this.Start();
		await this.sentStats(defaultDate);
	}
	async sentStats(date) {
		await axios.get(`/api/all-sent-stats/${date}`).then((res) => {
			if (res.data.msg === 'GOOD') {
				let { stats } = res.data;
				this.setState({ sentStats: stats });
			} else {
				alert(res.data.msg);
			}
		});
	}
	async Start() {
		let { industry } = this.state;
		let { info } = this.props.location.state;
		if (!Array.isArray(info)) {
			await axios.post(`/api/reviewreport/data`, { industry }).then(async (res) => {
				await this.startData(res.data.info);
			});
		} else {
			await this.startData(info);
		}
	}
	async startData(og) {
		og = og.sort((a, b) => (a.c_id > b.c_id ? 1 : -1));
		og = og.filter((e) => e.active_prod.reviews && e.active && e.reviews.reviews.some((el) => el.date === sunday));
		let dates = og[0].reviews.reviews.sort((b, a) => {
			var c = new Date(a.date);
			var d = new Date(b.date);
			return d - c;
		});
		await this.setState({ dates });
		await this.List(og);
		let slow = og.filter((e) => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'slow').length;
		let good = og.filter((e) => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'good').length;
		let needattn = og.filter((e) => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'needs attention').length;
		let urgent = og
			.filter((e) => e.reviews.reviews.length >= 4)
			.filter((e) => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'urgent').length;
		let critical = og
			.filter((e) => e.reviews.reviews.length >= 4)
			.filter((e) => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'critical').length;
		let na = og.filter((e) => e.reviews.reviews[e.reviews.reviews.length - 1].status.toLowerCase() === 'new').length;
		let newg = og.filter(
			(e) => e.reviews.reviews.filter((dat) => dat.date === sunday)[0]?.rating && e.reviews.reviews.filter((dat) => dat.date === sunday)[0]?.llrating,
		);
		let total = newg.length;
		let avgGRating = (newg.reduce((tot, n) => tot + parseFloat(n.reviews.reviews.filter((dat) => dat.date === sunday)[0].rating), 0) / total).toFixed(2);
		let avgLLRating = (newg.reduce((tot, n) => tot + parseFloat(n.reviews.reviews.filter((dat) => dat.date === sunday)[0].llrating), 0) / total).toFixed(2);
		this.setState({ og, info: og, statuses: { slow, good, needattn, urgent, critical, na, total, avgGRating, avgLLRating } });
	}
	async search(val) {
		let { info, og } = this.state;
		if (val.length >= 2) {
			let similar = await info.filter(
				(item) =>
					item.company_name.toLowerCase().includes(val.toLowerCase()) ||
					item.industry.toLowerCase().includes(val.toLowerCase()) ||
					item.c_id.toString().toLowerCase().includes(val.toLowerCase()),
			);
			await this.List(similar);
		} else {
			this.List(og);
		}
	}
	async changePage(e) {
		await this.setState({ pageAMT: parseInt(e) });
		this.List(this.state.og);
	}
	async List(pinfo) {
		let { dates } = this.state;
		pinfo = <ListTable dates={dates} pinfo={pinfo} sunday={sunday} Pagination={Pagination} {...this.props} />;
		this.setState({ pinfo });
	}
	Chart() {
		let { statuses } = this.state;
		return <StatusDonut statuses={statuses} />;
	}
	render() {
		let width = window.innerWidth;
		let { dates, statuses, sentStats } = this.state;
		return (
			<>
				<Layout1 view={{ sect: 'all', sub: 'reports', type: 'reviews' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
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
							<h1 className="left-align" style={{ margin: '1% 0', padding: '0' }}>
								Review Report
							</h1>
							<ThreeSplit padding="0" just="space-between">
								<BoxSplit width="30%" align="flex-start" className="card">
									<h4 style={{ margin: '0 0 0 5%', padding: '0' }} className="left-align">
										Status Graph
									</h4>
									<div style={{ width: '100%', height: '80%' }}>{this.Chart()}</div>
								</BoxSplit>
								<StatusStats statuses={statuses} />
								<ActionStats sentStats={sentStats} />
							</ThreeSplit>
							<div style={{ width: '40vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<RowContainer className="input-field" style={{ margin: '0', display: 'flex', alignItems: 'center', width: '40%' }}>
									<i className="material-icons" style={{ margin: '0', padding: '0' }}>
										search
									</i>
									<input
										className=""
										placeholder="Search"
										autoFocus
										onChange={(e) => {
											this.search(e.target.value);
										}}
										style={{ width: '92.5%', margin: '0', padding: '0' }}
									/>
								</RowContainer>
								{/* <button style={{ margin: '0' }} className="btn primary-color primary-hover">
									FILTER
								</button> */}
								{/* FILTER BY STATE, INDUSTRTY, TIMEZONE ETC */}
								{/* <div style={{ width: '40%', display: 'flex', alignItems: 'center' }}>
									<h6 style={{ margin: '0', padding: '0', marginRight: '10%' }}>Limit</h6>
									<div style={{ width: '5vw', display: 'flex', alignItems: 'center' }}>
										<Select value={this.state.pageAMT.toString()} onChange={async e => this.changePage(e.target.value)}>
											<option value="10">10</option>
											<option value="25">25</option>
											<option value="50">50</option>
											<option value="75">75</option>
											<option value="100">100</option>
											<option value="250">250</option>
											<option value="500">500</option>
											<option value="750">750</option>
											<option value="1000">1000</option>
											<option value="1500">1500</option>
											<option value="2000">2000</option>
										</Select>
									</div>
								</div> */}
							</div>
							<div style={{ width: '110%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '-2.5%' }} className="card">
								{dates ? <div style={{ width: '100%' }}>{this.state.pinfo}</div> : null}
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
export default connect(mapStateToProps, {})(ReviewReport);
