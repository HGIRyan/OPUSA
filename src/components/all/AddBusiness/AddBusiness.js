import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToUser } from '../../../ducks/User';
import { NoDiv, Layout1, LoadingWrapper } from '../../../utilities/index';
import { Select } from 'react-materialize';
import axios from 'axios';
import { Page1, Page2, Page3, Page4 } from './ABComponents';

class AddBusiness extends Component {
	constructor() {
		super();
		// prettier-ignore
		this.state = {
            page: 1, industry: '',
            businessName: '', corpName: '', street: '', country: '', state: '', zip: '', city: '', timezone: '', phone: '', website: '',
            geo: { lat: 0, lng: 0 }, places:[],
			firstName: '', lastName: '', placeId: '', email: `no-reply@${process.env.REACT_APP_COMPANY_EXTENSION}.com`,
			rating: '', reviews: '',
			img: '', color: '#FFFF', colors: [], formData: {},
			insights: { calls: '', website: '', direction: '', messages: '', searches: { direct: '', branded: '', discovery: '' } },
			service: { reviews: true, cross: false, referral: false, winback: false, leadgen: false },
			rankKey: ['insurance','Auto insurance','Home insurance','Life insurance','insurance agency'], keyval: '',
			links: [], site: '', searching: false,
			Loading: true, submitting: false, imgLoaded: true, modalOpen: false, uploading: false,
			sf_key:  '',
			c_api: { salesforce: { sf_id: '', accountManager: {}, asset: [] }, gatherup: { business_id: '', client_id: '' }, llinternal: '' },
			sfSync: false,
			serpSearch: false
		};
	}
	async componentDidMount() {
		document.title = `${process.env.REACT_APP_COMPANY_NAME} - New Business`;
		if (!this.props.location.state.industry[0]) {
		} else {
			// this.setState({ loading: false });
		}
	}
	async getDefault() {
		let industry = this.state.industry ? this.state.industry : 'All';
		let { businessName } = this.state;
		await axios.get(`/api/get/default/${industry}/${businessName}`).then((res) => {
			if (res.data.msg === 'NO SESSION') {
				alert('Notify IT. No Session Recognized');
			} else if (res.data.msg === 'Company Already Exists') {
				alert('Company Already Exists');
				this.setState({ page: 1 });
			} else if (res.data.defaults) {
				this.setState({ img: res.data.defaults.settings.logo, color: res.data.defaults.settings.color });
			}
		});
	}
	async serpSearch() {
		alert('If Searching For Knowledge Card Make Sure To Search Using Exact GMB Business Name');
		let { businessName } = this.state;
		await this.setState({
			placeId: 'N/A',
			links: [{ site: 'Google', link: `` }],
			searching: true,
			places: [],
		});
		await axios.get(`https://api.scaleserp.com/search?api_key=${process.env.REACT_APP_SERP_API}&q=${businessName}`).then((res) => {
			if (res.status === 200) {
				let { data } = res;
				if (data.knowledge_graph) {
					let know = data.knowledge_graph;
					if (know.reviews_from_the_web[0]) {
						if (know.reviews_from_the_web.some((e) => e.title === 'Facebook')) {
							let { links } = this.state;
							let revLink = know.reviews_from_the_web[know.reviews_from_the_web.findIndex((e) => e.title === 'Facebook')].link;
							if (revLink.split('')[revLink.split('').length - 1] === '/') {
								revLink = revLink
									.split('')
									.slice(0, revLink.split('').length - 1)
									.join('');
							}
							links.push({
								site: 'Facebook',
								link: revLink + '/reviews',
							});
							this.setState({ links });
						}
					}
					let geo = know.local_map.gps_coordinates;
					geo = { lat: geo.latitude, lng: geo.longitude };
					this.setState({
						businessName: know.title,
						resp: false,
						geo,
						street: '123 Main',
						country: 'United States',
						state: 'UT',
						zip: '84150',
						city: 'Salt Lake City',
						website: know.website,
						timezone: -360,
						phone: know.phone,
						rating: know.rating,
						reviews: know.reviews,
						searching: false,
					});
				} else {
					alert('Found No Results');
				}
			}
		});
	}
	async getDetails(placeId) {
		if (this.state.customPlace) {
			placeId = this.state.placeId;
		}
		await this.setState({
			placeId,
			links: [{ site: 'Google', link: `https://search.google.com/local/writereview?placeid=${placeId}` }],
			searching: true,
			places: [],
		});
		await axios
			.post('/api/google/place/placeid/details', { placeId })
			.then((res) => {
				if (res.data.msg === 'GOOD') {
					let data = res.data.data;
					let { address_components } = data;
					let streshort = address_components.filter((e) => e.types.some((el) => el === 'street_number' || el === 'route'));
					streshort = streshort[0] ? streshort[0].short_name : '';
					let strelong = address_components.filter((e) => e.types.some((el) => el === 'route'));
					strelong = strelong[0] ? strelong[0].long_name : '';
					let street = streshort + ' ' + strelong;
					let country = address_components.filter((e) => e.types.some((el) => el === 'country'))[0].long_name;
					let state = address_components.filter((e) => e.types.some((el) => el === 'administrative_area_level_1'))[0].short_name;
					let city = address_components.filter((e) => e.types.some((el) => el === 'locality' || el === 'political'))[0].long_name;
					let zip = address_components.filter((e) => e.types.some((el) => el === 'postal_code'))[0].long_name;
					let geo = { lat: data.geometry.location.lat, lng: data.geometry.location.lng };
					let website = data.website ? data.website : 'N/A';
					let timezone = data.utc_offset;
					let phone = data.international_phone_number ? data.international_phone_number : '';
					let reviews = data.user_ratings_total ? data.user_ratings_total : 0;
					let rating = data.rating ? data.rating : 5;
					if (timezone) {
						this.setState({
							businessName: data.name,
							street,
							country,
							state,
							zip,
							city,
							resp: false,
							geo,
							website,
							timezone,
							phone,
							rating: rating,
							reviews,
							searching: false,
						});
					} else {
						alert("This GMB Profile Doesn't Have All Required Information");
						console.log(res);
					}
				} else {
				}
			})
			.catch((err) => console.log('ERROR::', err));
	}
	async getPlaces(searchTerm) {
		this.setState({ searching: true });
		await axios
			.post('/api/google/place/search', { searchTerm })
			.then((res) => {
				res = res.data;
				if (res.msg === 'GOOD') {
					if (res.data.length !== 0) {
						this.setState({ places: res.data, searching: false, serpSearch: false });
					} else {
						this.setState({ serpSearch: true, searching: false });
						alert('No Results');
					}
				} else {
					this.setState({ searching: false });
					alert(res.msg);
				}
			})
			.catch((err) => console.log('ERROR::', err));
	}
	addKey() {
		let { keyval, rankKey } = this.state;
		rankKey.push(keyval);
		this.setState({ rankKey, keyval: '' });
	}
	async submit() {
		let info = this.state;
		this.setState({ submitting: true });
		axios.defaults.timeout = 50000;
		await axios
			.post('/api/ll/createbusiness', { info })
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
	async uploader(e) {
		// let { logo } = this.state.bus;
		let files = e.target.files;
		let reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = (e) => {
			const formData = { file: e.target.result };
			this.setState({ img: e.target.result, formData });
		};
		// if (logo) {
		// } else {
		// 	await this.getBus();
		// 	alert('Try to upload again');
		// }
	}
	renderSwatches() {
		const { colors } = this.state;

		return colors.map((color, id) => {
			return (
				<div
					key={id}
					onClick={() => this.setState({ color: color.split('#')[1] })}
					style={{
						backgroundColor: color,
						width: 75,
						height: 75,
						margin: '5px',
						cursor: 'pointer',
					}}
				>
					{color}
				</div>
			);
		});
	}
	getColors = (colors) => {
		this.setState({ colors: [] });
		this.setState((state) => ({ colors: [...state.colors, ...colors], color: colors[0] ? colors[0] : '#000000' }));
	};
	async moveUp(i) {
		let { links } = this.state;
		if (i !== 0) {
			let first = links[i - 1];
			let current = links[i];
			links.splice(i - 1, 1, current);
			links.splice(i, 1, first);
			this.setState({ links: links });
		}
	}
	async moveDown(i) {
		let { links } = this.state;
		if (i !== links.length - 1) {
			let first = links[i + 1];
			let current = links[i];
			links.splice(i + 1, 1, current);
			links.splice(i, 1, first);
			this.setState({ links: links });
		}
	}
	async link(i, value) {
		let { links } = this.state;
		links.splice(i, 1, { site: links[i].site, link: value });
		this.setState({ links: links });
	}
	async add(siteType) {
		let { links } = this.state;
		if (!this.state.links.filter((e) => e.site === siteType)[0]) {
			links.unshift({ site: siteType, link: '' });
			this.setState({ links: links, site: siteType });
		} else {
			alert('Site already added to review links');
		}
	}
	async delete(i) {
		let { links } = this.state;
		links.splice(i, 1);
		this.setState({ links: links });
	}
	async lookup(site, i) {
		let { placeId, links } = this.state;
		if (site === 'Google') {
			links.splice(i, 1, { site, link: `https://search.google.com/local/writereview?placeid=${placeId}` });
			this.setState({ links: links });
		}
	}
	async getUploaded() {
		if (!Array.isArray(this.state.images)) {
			await axios.get('/api/uploadedimages').then((res) => {
				if (res.data.msg === 'GOOD') {
					this.setState({ images: res.data.res.resources, imgLoaded: false, modalOpen: true });
				}
			});
		}
	}
	async getLogoLink() {
		let { formData, industry } = this.state;
		await this.setState({ uploading: true });
		await axios.post('/api/create/logolink', { formData, industry }).then((res) => {
			if (res.data.msg === 'GOOD') {
				this.setState({ uploading: false, img: res.data.link });
			} else {
				alert('There was an error trying to upload your image', res.data.msg);
				this.setState({ uploading: false });
			}
		});
	}
	updateInput(item, val) {
		this.setState({ [item]: val });
	}
	siteLogo(site) {
		if (site === 'Google') {
			return 'https://centerlyne.com/wp-content/uploads/2016/10/Google_-G-_Logo.svg_.png';
		} else {
			return 'https://image.flaticon.com/icons/png/512/124/124010.png';
		}
	}
	async syncWSF() {
		let { sf_key, c_api } = this.state;
		c_api.salesforce.sf_id = sf_key;
		await axios.post('/api/update/sf_api', { c_api }).then((res) => {
			if (res.data.msg === 'GOOD') {
				this.setState({ c_api: res.data.c_api, sfSync: true });
			} else {
				alert(res.data.msg);
			}
		});
	}
	render() {
		let { page, rankKey, keyval, service, img } = this.state;
		return (
			<Layout1 view={{ sect: 'all', sub: 'home', type: 'home' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				<LoadingWrapper loading={this.state.loading}>
					<div>
						<NoDiv just="flex-start" width="50%" align="center" style={{ marginLeft: '15%' }}>
							<h3 style={{ right: '30%', position: 'relative' }}>Business Details{this.state.businessName && this.state.page !== 1 ? ': ' : ''}</h3>
							{this.state.businessName && this.state.page !== 1 ? (
								<h3 style={{ right: '27.5%', position: 'relative' }}> {this.state.businessName.substring(0, 25)}</h3>
							) : null}
							<Select value={this.state.page.toString()} onChange={(e) => this.setState({ page: parseInt(e.target.value) })}>
								<option value="1">Page 1</option>
								<option value="2">Page 2</option>
								<option value="3">Page 3</option>
								<option value="4">Page 4</option>
							</Select>
						</NoDiv>
						<div className="card hoverable" style={{ display: 'flex', width: '70vw', minHeight: '50vh' }}>
							<div style={{ display: 'flex', width: '100%', height: '100%', border: 'solid black 1px' }} className="card-content">
								{page === 1 ? (
									<Page1
										service={service}
										page={page}
										state={this.state}
										{...this.props}
										updateInput={this.updateInput.bind(this)}
										getPlaces={this.getPlaces.bind(this)}
										serpedSearch={this.serpSearch.bind(this)}
										getDetails={this.getDetails.bind(this)}
										getDefault={this.getDefault.bind(this)}
									/>
								) : page === 2 ? (
									<Page2
										page={page}
										state={this.state}
										{...this.props}
										updateInput={this.updateInput.bind(this)}
										add={this.add.bind(this)}
										siteLogo={this.siteLogo.bind(this)}
										link={this.link.bind(this)}
										lookup={this.lookup.bind(this)}
									/>
								) : page === 3 ? (
									<Page3
										page={page}
										state={this.state}
										{...this.props}
										img={img}
										updateInput={this.updateInput.bind(this)}
										uploader={this.uploader.bind(this)}
										getUploaded={this.getUploaded.bind(this)}
										getColors={this.getColors.bind(this)}
										renderSwatches={this.renderSwatches.bind(this)}
									/>
								) : (
									<Page4
										{...this.props}
										state={this.state}
										rankKey={rankKey}
										keyval={keyval}
										updateInput={this.updateInput.bind(this)}
										addKey={this.addKey.bind(this)}
										submit={this.submit.bind(this)}
									/>
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
export default connect(mapStateToProps, { addToUser })(AddBusiness);
