import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToUser } from '../../../ducks/User';
import { NoDiv, Layout1, Infobox, LoadingWrapper, LoadingWrapperSmall } from '../../../utilities/index';
import axios from 'axios';
import { Select } from 'react-materialize';
import { Page1, Page2, Page3 } from './pages';
class AddLocation extends Component {
	constructor() {
		super();
		// prettier-ignore
		this.state = {
            page: 1, industry: 'allstate',
            businessName: '', corpName: '', street: '', country: '', state: '', zip: '', city: '', timezone: '', phone: '', website: '',
            geo: { lat: 0, lng: 0 }, places:[],
			firstName: '', lastName: '', placeId: '', email: '',
			rating: '', reviews: '',
			img: '', color: 'gray', colors: [],
			insights: { calls: '', website: '', direction: '', messages: '', searches: { direct: '', branded: '', discovery: '' } },
			service: { reviews: true, cross: false, referral: false, winback: false, leadgen: false },
			rankKey: ['insurance'], keyval: '',
			links: [], site: '', searching: false,
            Loading: true, submitting: false,
            data: { c_id: 24, owner_name: { first: 'Boi' }, company_name: process.env.REACT_APP_COMPANY_NAME }
		};
	}
	async componentDidMount() {
		document.title = `${process.env.REACT_APP_COMPANY_NAME} - New Location`;
		let { cor_id } = this.props.match.params;
		let locations = this.props.location.state.info.filter((e) => e.cor_id === parseInt(cor_id)).sort((a, b) => (a.c_id > b.c_id ? 1 : -1));
		if (locations[0]) {
			let og = locations[0];
			document.title = `${og.company_name} - New Location`;
			this.setState({
				data: og,
				industry: og.industry.toLowerCase(),
				firstName: og.owner_name.first,
				lastName: og.owner_name.last,
				email: og.email.email[0] ? og.email.email[0] : '',
				img: og.logo,
				color: og.accent_color,
				rankKey: og.rank_key.rank_key,
			});
		}
		if (!this.props.location.state.industry[0]) {
		} else {
			// this.setState({ loading: false });
		}
	}
	next1({ businessName, address, geo, website, timezone, phone, rating, reviews, industry, firstName, lastName, email, service, links, placeId }) {
		let { street, zip, city, state } = address;
		// prettier-ignore
		this.setState( {
			businessName, street, zip, city, state, geo, website, timezone, phone, rating, reviews, industry,
			firstName, lastName, email, links, service, page: this.state.page + 1, placeId
		} );
	}
	nex2({ links }) {
		this.setState({ links, page: this.state.page + 1 });
	}
	nex3({ color, img, form }) {
		this.setState({ color, img, formData: form, page: this.state.page + 1 });
	}
	nex4() {}
	addKey() {
		let { keyval, rankKey } = this.state;
		rankKey.push(keyval);
		this.setState({ rankKey, keyval: '' });
	}
	async submit() {
		let info = this.state;
		this.setState({ submitting: true });
		let { cor_id } = this.props.match.params;
		axios.defaults.timeout = 50000;
		await axios
			.post('/api/ll/addlocation', { info, cor_id })
			.then(async (res) => {
				res = res.data;
				this.setState({ submitting: false });
				if (res.msg === 'GOOD' && res.businessInfo.c_id) {
					if (Array.isArray(this.props.location.state.info)) {
						this.props.location.state.info.push(res.businessInfo);
					}
					this.props.history.push(`/client-dash/${res.businessInfo.cor_id}/${res.businessInfo.c_id}`, this.props.location.state);
				} else {
					alert(res.msg);
				}
			})
			.catch((err) => console.log('ERROR: ', err));
	}

	render() {
		let { page, rankKey, keyval, service, img } = this.state;
		return (
			<Layout1 view={{ sect: 'indv', data: this.state.data }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				<LoadingWrapper loading={this.state.loading}>
					<div>
						<NoDiv just="flex-start" width="50%" align="center" style={{ marginLeft: '15%' }}>
							<h5 style={{ right: '30%', position: 'relative' }}>
								Adding Location For <br /> {this.state.data.company_name}
							</h5>
							<Select value={this.state.page.toString()} onChange={(e) => this.setState({ page: parseInt(e.target.value) })}>
								<option value="1">Page 1</option>
								<option value="2">Page 2</option>
								<option value="3">Page 3</option>
								<option value="4">Page 4</option>
							</Select>
						</NoDiv>
						<div className="card hoverable" style={{ display: 'flex', width: '70vw' }}>
							<div style={{ display: 'flex', width: '100%', height: '100%', border: 'solid black 1px' }} className="card-content">
								{page === 1 ? (
									<Page1 {...this.props} page={page} next1={this.next1.bind(this)} />
								) : page === 2 ? (
									<Page2 {...this.props} links={this.state.links} state={this.state} nex2={this.nex2.bind(this)} />
								) : page === 3 ? (
									<Page3 {...this.props} nex3={this.nex3.bind(this)} />
								) : (
									<div style={{ display: 'flex', flexDirection: 'column', width: '90%', justifyContent: 'flex-start' }}>
										<h5>Add KeyWords</h5>
										<hr />
										<div className="input-field" style={{ width: '70%' }}>
											<h2 style={{ margin: '0' }}>
												<input
													id="keyword"
													type="text"
													className="validate"
													value={keyval}
													onChange={(e) => this.setState({ keyval: e.target.value })}
													onKeyPress={(e) => (e.key === 'Enter' ? this.addKey() : null)}
												/>
											</h2>
											<label htmlFor="keyword">New Keyword: </label>
											<button className="btn primary-color primary-hover" onClick={() => this.addKey()}>
												Add
											</button>
										</div>
										{rankKey.map((key, i) => {
											return (
												<div
													style={{ display: 'flex', width: '20%', cursor: 'pointer', justifyContent: 'flex-start', padding: '0 .5%', alignItems: 'center' }}
													key={i}
													className="card hoverable"
													onClick={() => {
														rankKey.splice(i, 1);
														this.setState({ rankKey });
													}}
												>
													<h6 style={{ marginRight: '5%' }}>{i + 1}.</h6>
													<h6>{key}</h6>
												</div>
											);
										})}
										<LoadingWrapperSmall loading={this.state.submitting}>
											<button className="btn primary-color primary-hover" onClick={() => this.submit()}>
												Submit
											</button>
										</LoadingWrapperSmall>
									</div>
								)}
							</div>
						</div>
					</div>
				</LoadingWrapper>
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, { addToUser })(AddLocation);
