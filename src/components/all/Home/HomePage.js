import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { addToUser } from '../../../ducks/User';
import { Layout1, LoadingWrapper, StyledLink, pagination } from '../../../utilities/index';
import simString from 'string-similarity';
import { CompanyList, Pages } from './HomeComponents';
const { detect } = require('detect-browser');
const browser = detect();

class HomePage extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			company: [],
			SearchBy: 'company_name',
			showMore: false,
			specIndustry: '',
			searching: '',
			current: 1,
			perPage: 100,
			pages: '',
			og: [],
			info: [],
		};
		this.changePage = this.changePage.bind(this);
	}
	async componentDidMount() {
		await window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		document.title = `${process.env.REACT_APP_COMPANY_NAME} - Home`;
		let { page } = this.props.match.params;
		this.setState({ current: page });
		if (this.props.location.state) {
			let { info, industry, sub_perm, email } = this.props.location.state;
			if (browser.name !== 'chrome') {
				await this.GetCompanyInfo();
			} else {
				info = info
					.sort((a, b) => a.cor_id - b.cor_id) //Sort to have oldest at top
					.sort((a, b) => b.active - a.active); //SORT TO HAVE INACTIVE ALL LAST
				let og = info;
				if (sub_perm.am && process.env.REACT_APP_SF_SECURITY_TOKEN) {
					info = info.filter((e) => e.c_api?.salesforce?.accountManager?.email === email.toLowerCase());
				}
				let length = info.filter((value, index, self) => self.map((x) => x.cor_id).indexOf(value.cor_id) === index).filter((e) => e.active).length;
				await this.setState({ og, industry: industry, info: info, length });
				this.CompanyInfo(info, { search: true });
			}
		} else {
			await this.GetCompanyInfo();
		}
		await this.setState({ loading: false });
	}
	async Search(value) {
		let { og } = this.state;
		this.setState({ searching: value });
		if (value.length >= 2 && value.length % 2 === 0) {
			value = value.toLowerCase();
			let similar;
			similar = await og
				.filter(
					(item) =>
						simString.compareTwoStrings(value, item.company_name.toLowerCase()) >= 0.6 ||
						item.company_name.toLowerCase().includes(value.toLowerCase()) ||
						item.c_id.toString().toLowerCase().includes(value.toLowerCase()) ||
						item.cor_id.toString().toLowerCase().includes(value.toLowerCase()),
				)
				.sort((a, b) =>
					simString.compareTwoStrings(value, a.company_name.toLowerCase()) > simString.compareTwoStrings(value, b.company_name.toLowerCase()) ? 1 : -1,
				);
			this.setState({ info: similar, current: 1 });
			await this.CompanyInfo(similar, { searched: true });
		} else if (value.length === 0) {
			this.setState({ info: og });
			await this.CompanyInfo(og, { search: true });
		}
	}
	async changePage(num) {
		let { current, info, perPage } = this.state;
		let pages = Math.ceil(info.length / perPage);
		if (num !== '-1' && num !== '+1') {
			await this.setState({ current: num });
		} else {
			if (num === '+1' && current !== pages) {
				await this.setState({ current: current + 1 });
			} else if (num === '-1' && current !== 1) {
				await this.setState({ current: current - 1 });
			}
		}
		await this.CompanyInfo(this.state.og, { search: true });
	}

	async CompanyInfo(info, comp) {
		let { cor_id } = this.props.match.params;
		info = info
			.filter((e) => e.active)
			.sort((a, b) => (a.reviews.reviews[a.reviews.reviews.length - 1].newReviews > b.reviews.reviews[b.reviews.reviews.length - 1].newReviews ? 1 : -1))
			.sort((a, b) => (a.customers.reviews[a.customers.reviews.length - 1].size < b.customers.reviews[b.customers.reviews.length - 1].size ? 1 : -1))
			.sort((a, b) => (a.customers.reviews[a.customers.reviews.length - 1].remaining > b.customers.reviews[b.customers.reviews.length - 1].remaining ? 1 : -1));
		if (cor_id !== '0') {
			info = info.filter((e) => e.cor_id === parseInt(cor_id)).sort((a, b) => (a.c_id > b.c_id ? 1 : -1));
		}
		let { current, perPage } = this.state;
		let page = pagination(info, current, perPage);
		if (!comp.searched && cor_id === '0') {
			// eslint-disable-next-line
			page.arr = page.arr.filter((e) => {
				let totLoc = info.filter((el) => el.cor_id === e.cor_id).sort((a, b) => (a.c_id > b.c_id ? 1 : -1));
				let pos = totLoc.findIndex((el) => el.c_id === e.c_id) + 1;
				if (pos === 1) {
					return e;
				}
			});
		}
		let company = await page.arr.map((e, i) => {
			return <CompanyList key={i} i={i} e={e} info={info} cor_id={cor_id} comp={comp} {...this.props} />;
		});
		this.setState({ company });
	}
	async GetCompanyInfo() {
		await axios.get('/api/home/info').then(async (res) => {
			if (res.data.msg === 'GOOD') {
				let info = res.data.info;
				let industry = res.data.industry;
				let length = info.filter((value, index, self) => self.map((x) => x.cor_id).indexOf(value.cor_id) === index).filter((e) => e.active).length;
				await this.setState({ og: info, industry: industry, info: info, length });
				this.CompanyInfo(info, { search: true });
			} else {
				if (res.data.msg === 'NO SESSION') {
					this.props.history.push('/', {});
				} else {
					// alert('Here');
					// alert(res.data.msg);
				}
			}
		});
	}
	async onEnter() {
		let { info } = this.state;
		if (info[0]) {
			let dat = info[0];
			this.props.history.push(`/client-dash/${dat.cor_id}/${dat.c_id}`, this.props.location.state);
		}
	}
	render() {
		let width = window.innerWidth;
		let { specIndustry, info, current, perPage, company } = this.state;
		return (
			<Layout1 view={{ sect: 'all', sub: 'home', type: 'home' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				<LoadingWrapper loading={this.state.loading}>
					<div className="navbar-fixed" style={{ position: '-webkit-sticky', top: '-8vh' }}>
						<nav className="tertiary-color" style={{ width: '30%', right: `${width >= 1500 ? '10vw' : '8vw'}`, boxShadow: 'none', height: '4vh' }}>
							<div className="nav-wrapper row" style={{ display: 'flex', alignItems: 'center' }}>
								<div className="input-field col s8 left " style={{ display: 'flex', alignItems: 'center', height: '90%' }}>
									<i className="material-icons" style={{ position: 'absolute', marginTop: '.5vh' }}>
										search
									</i>
									<input
										id="search"
										type="search"
										placeholder="Search"
										className="tertiary-color searchB"
										onChange={(e) => this.Search(e.target.value)}
										value={this.state.searching}
										onKeyPress={(e) => (e.key === 'Enter' ? this.onEnter() : null)}
										autoFocus
										style={{
											fontSize: '1.2em',
											padding: '0px 2.5vw',
											margin: '0px',
											marginLeft: '-5%',
											marginTop: '1vh',
										}}
									/>
								</div>
								<div className="col s4 right" style={{ marginLeft: '-5%', marginTop: '1vh' }}>
									<StyledLink
										className="btnn-small primary-color"
										to={{ pathname: `/addbusiness/${specIndustry}`, state: this.props.location.state }}
										style={{ height: '2.5vh', padding: '6px 16px' }}
									>
										<span role="img" aria-label="emoji">
											➕
										</span>
										Business
									</StyledLink>
								</div>
							</div>
						</nav>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							width: '100%',
							marginTop: width >= 1500 ? '-10vh' : '-11.5vh',
							marginLeft: width >= 1500 ? '' : '10vw',
						}}
					>
						<div
							className="card"
							style={{
								position: 'fixed',
								padding: '0',
								lineHeight: 'normal',
								zIndex: '5',
								width: width >= 1500 ? '75vw' : '90vw',
								height: '4vh',
								backgroundColor: 'white',
								color: 'black',
								borderBottom: 'solid lightgray',
								margin: '0',
							}}
						>
							<div
								className="row center-align valign-wrapper"
								style={{ width: '100%', display: 'flex', height: '100%', zIndex: '100 !important', padding: '0 2.5%' }}
							>
								<p style={{ lineHeight: 'normal', margin: '0', width: '30%' }} className="left-align">
									Company Name
								</p>
								<p style={{ width: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingRight: '5%' }} className="left-align">
									City
								</p>
								<div style={{ display: 'flex', minWidth: '60%' }} className=" left-align valign-wrapper">
									<p style={{ lineHeight: 'normal', margin: '0', width: '10%' }} className="left-align">
										Auto:{' '}
									</p>
									<p style={{ lineHeight: 'normal', margin: '0', width: '10%' }} className="left-align">
										List Size:{' '}
									</p>
									<p style={{ lineHeight: 'normal', margin: '0', width: '11%' }} className="left-align">
										Remaining:
									</p>
									<p style={{ lineHeight: 'normal', margin: '0', width: '40%', padding: '0' }} className="center-align valign-wrapper">
										Google Listing:
									</p>
									<p style={{ lineHeight: 'normal', margin: '0', width: '10%' }}>Loc: </p>
									<p style={{ lineHeight: 'normal', margin: '0', width: '10%' }}>Created: </p>
									<p style={{ lineHeight: 'normal', margin: '0', width: '20%', marginRight: '-10%' }}>
										Total: {this.state.length} / {this.state.info.filter((e) => e.active).length}
									</p>
								</div>
							</div>
						</div>
						<div
							className=""
							style={{
								width: width >= 1500 ? '75vw' : '90vw',
								display: 'flex',
								flexDirection: 'column',
								// marginLeft: `${width >= 1500 ? '2vw' : '12.5%'}`,
								height: 'auto',
								marginTop: '5vh',
								paddingBottom: '12vh',
							}}
						>
							{company}
						</div>
					</div>
					{info ? <Pages current={current} perPage={perPage} info={info} changePage={this.changePage} {...this.props} /> : null}
				</LoadingWrapper>
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, { addToUser })(HomePage);
