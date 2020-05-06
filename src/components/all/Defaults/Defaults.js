import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, LargeContentHolder, NoDiv } from '../../../utilities/index';
// import AddonEmail from './function/AddonEmail';
import ReviewLanding from '../function/ReviewLanding';
// import AddonLanding from './function/AddonLanding';
import axios from 'axios';
import ReviewEmail from '../function/Email';
// import { Select, Modal } from 'react-materialize';
import { ReviewSettings, EmailType, LogoCom, LandingPageSettings } from './DefaultComponents';
class Defaults extends Component {
	constructor() {
		super();

		this.state = {
			type_: 's',
			loading: true,
			addon: {},
			ratingLanding: 3,
			defaults: {},
			addon_landing: {},
			cross_sell: {},
			email: {},
			leadgen: {},
			referral: {},
			review_landing: {},
			settings: {},
			winback: {},
			img: '',
			color: '',
			rating: 3,
			colors: [],
			formData: {},
			activeFormat: { one: '1', two: '1', three: '3' },
			addonEmail: 0,
			addonType: 'winback',
			addonLType: 'winback',
			addonSubject: '',
			// updating: { reviewEmail: false, addonEmail: false, reviewLanding: false, addonLanding: false },
			positive: {},
			passive: {},
			demoter: {},
			updating: false,
			imgLoaded: true,
			updateImg: false,
		};
		this.updateAllReviewEmail = this.updateAllReviewEmail.bind(this);
		this.updateReviewEmail = this.updateReviewEmail.bind(this);
		this.updateAllReviewLanding = this.updateAllReviewLanding.bind(this);
		this.updateImg = this.updateImg.bind(this);
		this.fromEmail = this.fromEmail.bind(this);
		this.updateSettings = this.updateSettings.bind(this);
		this.changeFormat = this.changeFormat.bind(this);
		this.changeTheEmail = this.changeTheEmail.bind(this);
		this.renderSwatches = this.renderSwatches.bind(this);
		this.getColors = this.getColors.bind(this);
		this.uploader = this.uploader.bind(this);
		this.upload = this.upload.bind(this);
		this.getUploaded = this.getUploaded.bind(this);
		this.removeImg = this.removeImg.bind(this);
		this.updateCom = this.updateCom.bind(this);
		this.updateLinks = this.updateLinks.bind(this);
		// // this.updateAllReviewEmail = this.updateAllReviewEmail.bind(this);
	}
	async componentDidMount() {
		document.title = `${process.env.REACT_APP_COMPANY_NAME} - Default Settings`;
		await this.getDefaults();
		this.setState({ loading: false });
		window.scrollTo(0, 0);
	}
	async getDefaults() {
		let { type } = this.props.match.params;
		type = type ? type : 'NA';
		await axios.get(`/api/get/${type}/defaults`).then((res) => {
			if (res.data.msg === 'GOOD') {
				let { addon_landing, cross_sell, email, leadgen, referral, review_landing, settings, winback } = res.data.defaults;
				let { fr, or, pr, s, spr, sr } = email;
				let fr_ = { fr_body: fr.fr_body, fr_subject: fr.fr_subject };
				let or_ = { or_body: or.or_body, or_subject: or.or_subject };
				let pr_ = { pr_body: pr.pr_body, pr_subject: pr.pr_subject };
				let s_ = { s_body: s.s_body, s_subject: s.s_subject };
				let sr_ = { sr_body: sr.sr_body, sr_subject: sr.sr_subject };
				let spr_ = { spr_body: spr.spr_body, spr_subject: spr.spr_subject };
				let emails = { fr: fr_, or: or_, s: s_, pr: pr_, sr: sr_, spr: spr_ };
				let format = settings.email_format;
				format = {
					s: { one: format.s.toString().split('')[0], two: format.s.toString().split('')[1], three: format.s.toString().split('')[2] },
					fr: { one: format.fr.toString().split('')[0], two: format.fr.toString().split('')[1], three: format.fr.toString().split('')[2] },
					or: { one: format.or.toString().split('')[0], two: format.or.toString().split('')[1], three: format.or.toString().split('')[2] },
					pr: { one: format.pr.toString().split('')[0], two: format.pr.toString().split('')[1], three: format.pr.toString().split('')[2] },
					spr: { one: format.spr.toString().split('')[0], two: format.spr.toString().split('')[1], three: format.spr.toString().split('')[2] },
					sr: { one: format.sr.toString().split('')[0], two: format.sr.toString().split('')[1], three: format.sr.toString().split('')[2] },
				};
				let email_1 = { leadgen: leadgen.email_1, winback: winback.email_1, referral: referral.email_1, cross_sell: cross_sell.email_1 };
				let email_2 = { leadgen: leadgen.email_2, winback: winback.email_2, referral: referral.email_2, cross_sell: cross_sell.email_2 };
				let email_3 = { leadgen: leadgen.email_3, winback: winback.email_3, referral: referral.email_3, cross_sell: cross_sell.email_3 };
				let email_4 = { leadgen: leadgen.email_4, winback: winback.email_4, referral: referral.email_4, cross_sell: cross_sell.email_4 };
				let email_5 = { leadgen: leadgen.email_5, winback: winback.email_5, referral: referral.email_5, cross_sell: cross_sell.email_5 };
				let email_6 = { leadgen: leadgen.email_6, winback: winback.email_6, referral: referral.email_6, cross_sell: cross_sell.email_6 };
				let addon = { email_1, email_2, email_3, email_4, email_5, email_6 };
				let positive = review_landing.positive;
				let passive = review_landing.passive;
				let demoter = review_landing.demoter;
				this.setState({
					addon_landing,
					cross_sell,
					leadgen,
					referral,
					winback,
					// email: reviewEmails.fr.fr_body ? reviewEmails : email,
					addon,
					review_landing,
					settings,
					img: settings.logo ? settings.logo : process.env.REACT_APP_SITE_LOGO,
					color: settings.color,
					emails,
					format,
					activeFormat: format.s,
					addonSubject: email_1.winback.subject,
					passive,
					demoter,
					positive,
				});
			} else if (res.data.msg === 'NO SESSION') {
				this.props.history.push('/', this.props.location.pathname);
			} else {
				alert('Could Not Find Industry');
			}
		});
	}
	renderSwatches() {
		const { colors } = this.state;
		if (colors[0]) {
			return colors.map((color, id) => {
				return (
					<div
						key={id}
						onClick={() => this.setState({ color: color.split('#')[1] })}
						style={{
							backgroundColor: color,
							width: 50,
							height: 50,
							margin: '5px',
							cursor: 'pointer',
						}}
					>
						<p style={{ fontSize: '.5em' }}>{color}</p>
					</div>
				);
			});
		}
	}
	// LOGOCOM
	getColors = (colors) => {
		if (colors[0]) {
			if (!this.state.color.includes('#')) {
				this.setState({ colors: [] });
				this.setState((state) => ({ colors: [...state.colors, ...colors], color: colors[0] }));
			} else {
				this.setState({ colors: [] });
				this.setState((state) => ({ colors: [...state.colors, ...colors] }));
			}
		} else {
			this.setState({ colors: [], color: '#FFFF' });
		}
	};
	async uploader(e) {
		let files = e.target.files;
		let reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = (e) => {
			const formData = { file: e.target.result, img: e.target.result };
			this.setState({ img: e.target.result, formData });
		};
	}
	async getUploaded() {
		if (!Array.isArray(this.state.images)) {
			await axios.get('/api/uploadedimages').then((res) => {
				if (res.data.msg === 'GOOD') {
					this.setState({ images: res.data.res.resources, imgLoaded: false });
				}
			});
		}
	}
	upload() {
		let { client_id, loc } = this.props.match.params;
		let { img } = this.state;
		let { formData, color } = this.state;
		if (formData.file) {
			axios.post('/api/logo/new', { formData, client_id, loc, img, color }).then((res) => {
				res = res.data;
				if (res.msg === 'GOOD') {
					this.setState({ msg: 'Logo Saved', img: res.link });
					alert('Uploaded New Image');
				} else {
					alert('There has been an error in uploading new logo');
				}
			});
		}
	}
	removeImg() {
		this.setState({ link: '' });
	}
	updateCom() {
		this.setState({ img: this.state.link });
	}
	updateLinks(url) {
		this.setState({ link: url, images: {}, logo: url });
	}
	async update() {
		let { addon_landing, cross_sell, email, leadgen, referral, review_landing, settings, winback, img, color } = this.state;
		let { type } = this.props.match.params;
		settings.logo = img;
		settings.color = color;
		type = type ? type : 'All';
		await axios.post('/api/update/default', { addon_landing, cross_sell, email, leadgen, referral, review_landing, settings, winback, type }).then((res) => {
			if (res.data.msg === 'GOOD') {
				this.setState({ saved: 'Defaults Updated' });
			}
		});
	}
	// REVIEW SETTINGS
	async updateReviewEmail() {
		this.setState({ updating: { reviewEmail: true, addonEmail: false, reviewLanding: false, addonLanding: false } });
		let { type } = this.props.match.params;
		type = type ? type : 'ALL';
		let { settings, format, emails, formData, color, img } = this.state;
		let { s, fr, pr, or, spr, sr } = format;
		settings.email_format = {
			s: parseInt(s.one + s.two + s.three),
			fr: parseInt(fr.one + fr.two + fr.three),
			or: parseInt(or.one + or.two + or.three),
			pr: parseInt(pr.one + pr.two + pr.three),
			spr: parseInt(spr.one + spr.two + spr.three),
			sr: parseInt(sr.one + sr.two + sr.three),
		};
		settings.color = color;
		if (!formData.file) {
			settings.logo = img;
			settings.color = this.state.color.includes('#') ? this.state.color : `#${this.state.color}`;
		}
		settings.from_email = settings.from_email ? settings.from_email : `no-reply@${process.env.REACT_APP_COMPANY_EXTENSION}.com`;
		if (settings.from_email.emailValidate()) {
			await axios.post('/api/defaults/update/review-email', { settings, emails, formData, type }).then((res) => {
				if (res.data.msg === 'GOOD') {
					this.setState({ updating: { reviewEmail: false, addonEmail: false, reviewLanding: false, addonLanding: false } });
				} else {
					alert(res.data.msg);
				}
			});
		} else {
			alert('Invalid From Email');
		}
	}
	async updateAllReviewEmail(newImg) {
		this.setState({ updating: { reviewEmail: true, addonEmail: false, reviewLanding: false, addonLanding: false } });
		let { type } = this.props.match.params;
		type = type ? type : 'ALL';
		let { settings, format, emails, color } = this.state;
		let { s, fr, pr, or, spr, sr } = format;
		settings.email_format = {
			s: parseInt(s.one + s.two + s.three),
			fr: parseInt(fr.one + fr.two + fr.three),
			or: parseInt(or.one + or.two + or.three),
			pr: parseInt(pr.one + pr.two + pr.three),
			spr: parseInt(spr.one + spr.two + spr.three),
			sr: parseInt(sr.one + sr.two + sr.three),
		};
		settings.color = color;
		settings.from_email = settings.from_email ? settings.from_email : `no-reply@${process.env.REACT_APP_COMPANY_EXTENSION}.com`;
		if (settings.from_email.emailValidate()) {
			await axios.post('/api/defaults/update/review-email/all', { settings, emails, type, newImg }).then((res) => {
				if (res.data.msg === 'GOOD') {
					alert('Click Refresh Button In Menu For All Changes To Be Viewed');
					window.location.reload();
				} else {
					alert(res.data.msg);
				}
			});
		} else {
			alert('Invalid From Email');
		}
	}
	updateImg(val) {
		this.setState({ updateImg: val });
	}
	fromEmail(val) {
		this.setState({ settings: { ...this.state.settings, from_email: val } });
	}
	updateSettings(type, val) {
		this.setState({ settings: { ...this.state.settings, [type]: val ? parseInt(val) : 0 } });
	}
	async saveReviewLanding() {
		this.setState({ updating: true });
		let { type } = this.props.match.params;
		type = type ? type : 'ALL';
		let { passive, positive, demoter } = this.state;
		let review_landing = { passive, positive, demoter };
		await axios.post('/api/defaults/update/review-landing', { type, review_landing }).then((res) => {
			if (res.data.msg === 'GOOD') {
				alert('Click Refresh Button In Menu For All Changes To Be Viewed');
				window.location.reload();
			} else {
				alert(res.data.msg);
				this.setState({ updating: false });
			}
		});
	}
	async updateAllReviewLanding() {
		// this.setState({ updating: true });
		let { type } = this.props.match.params;
		type = type ? type : 'ALL';
		let { passive, positive, demoter } = this.state;
		let review_landing = { passive, positive, demoter };
		await axios.post('/api/defaults/update/review-landing/all', { type, review_landing }).then((res) => {
			if (res.data.msg === 'GOOD') {
				window.location.reload();
			} else {
				alert(res.data.msg);
				this.setState({ updating: false });
			}
		});
	}
	async updateAddonEmail() {
		this.setState({ updating: { reviewEmail: false, addonEmail: true, reviewLanding: false, addonLanding: false } });
	}
	async updateAddonLanding() {
		this.setState({ updating: { reviewEmail: false, addonEmail: false, reviewLanding: false, addonLanding: true } });
	}
	changeEmail(val, click) {
		let { addonEmail, addon, addonType } = this.state;
		addonType = addonType === 'ref' ? 'referral' : addonType;
		if (click) {
			this.setState({ addonEmail: val, addonSubject: addon[`email_${val + 1}`][addonType].subject });
		} else {
			if (val === 1) {
				if (addonEmail < 5) {
					this.setState({ addonEmail: addonEmail + 1, addonSubject: addon[`email_${addonEmail + 2}`][addonType].subject });
				} else {
					this.setState({ addonEmail: 0, addonSubject: addon.email_1[addonType].subject });
				}
			} else if (val === -1) {
				if (addonEmail > 0) {
					this.setState({ addonEmail: addonEmail - 1, addonSubject: addon[`email_${addonEmail}`][addonType].subject });
				} else {
					this.setState({ addonEmail: 5, addonSubject: addon.email_6[addonType].subject });
				}
			} else {
				alert('Bruh');
			}
		}
	}
	// EMAIL TYPE
	async changeFormat(val, num) {
		let { type_ } = this.state;
		this.setState((prevState) => ({
			format: { ...prevState.format, [type_]: { ...prevState.format[type_], [num]: val } },
			activeFormat: { ...prevState.activeFormat, [num]: val },
		}));
	}
	changeTheEmail(type_, format, value) {
		this.setState({ type_: value, activeFormat: format[value] });
	}
	async updateEmail(val, part) {
		let { type_ } = this.state;
		if (part.includes('body')) {
			part = part.split(',')[1];
			this.setState((prevState) => ({
				emails: {
					...prevState.emails,
					[type_]: { ...prevState.emails[type_], [`${type_}_body`]: { ...prevState.emails[type_][`${type_}_body`], [part]: val } },
				},
			}));
		} else {
			this.setState((prevState) => ({ ...prevState.emails, [type_]: { ...prevState.emails[type_], [part]: val } }));
		}
	}
	async updateReviewSubject(val) {
		let { type_ } = this.state;
		this.setState((prevState) => ({
			emails: {
				...prevState.emails,
				[type_]: { ...prevState.emails[type_], [`${type_}_subject`]: val },
			},
		}));
	}
	async updateReviewLanding(val, part) {
		let { ratingLanding } = this.state;
		let type = ratingLanding <= 2 ? 'demoter' : ratingLanding === 3 ? 'passive' : 'positive';
		if (part.includes('body')) {
			this.setState((prevState) => ({
				review_landing: {
					...prevState.review_landing,
					// eslint-disable-next-line
					[type]: { ...prevState.review_landing[type], ['body']: val },
				},
			}));
		} else {
			this.setState((prevState) => ({
				review_landing: {
					...prevState.review_landing,
					// eslint-disable-next-line
					[type]: { ...prevState.review_landing[type], ['thanks']: val },
				},
			}));
		}
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
	changeRating(val) {
		this.setState({ rating: val });
	}
	async changeTypeEmail(val) {
		let { addonEmail, addonType } = this.state;
		addonType = addonType === 'ref' ? 'referral' : addonType;
		this.setState((prevState) => ({
			addon: {
				...prevState.addon,
				[`email_${addonEmail + 1}`]: {
					...prevState.addon[`email_${addonEmail + 1}`],
					[addonType]: { ...prevState.addon[`email_${addonEmail + 1}`][addonType], body: val },
				},
			},
		}));
	}
	async updateSubject(val) {
		let { addonEmail, addonType } = this.state;
		addonType = addonType === 'ref' ? 'referral' : addonType;
		this.setState((prevState) => ({
			emails: {
				...prevState.emails,
				[`email_${addonEmail + 1}`]: {
					...prevState.emails[`email_${addonEmail + 1}`],
					[addonType]: { ...prevState.emails[`email_${addonEmail + 1}`][addonType], subject: val },
				},
			},
			subject: val,
		}));
	}
	Review(event) {
		let { value } = event.target;
		this.setState({ emailFormat: value });
	}
	ReviewType(e) {
		let { value } = e.target;
		this.setState({ ReviewType: value });
	}
	Addons(e) {
		let { value } = e.target;
		this.setState({ addonType: value });
	}
	render() {
		let { settings, format, emails, type_ } = this.state;
		let og = this.props.history.location.state.info[0];
		og.logo = this.state.img;
		return (
			<>
				<Layout1 view={{ sect: 'all', sub: 'settings', type: 'defaults' }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<LargeContentHolder>
							{this.state.saved ? this.state.saved : ''}
							<NoDiv width="100%" padding="2.5% 0">
								<ReviewSettings
									{...this.props}
									settings={settings}
									reviewEmail={this.state.updating.reviewEmail}
									state={this.state}
									updateAllReviewEmail={this.updateAllReviewEmail}
									updateReviewEmail={this.updateReviewEmail}
									updateImg={this.updateImg}
									fromEmail={this.fromEmail}
									updateSettings={this.updateSettings}
								/>
								<div style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									{/* REVIEW EMAIL */}
									<EmailType
										type_={type_}
										format={format}
										activeFormat={this.state.activeFormat}
										changeFormat={this.changeFormat}
										changeTheEmail={this.changeTheEmail}
									/>
									<LogoCom
										msg={this.state.msg}
										img={this.state.img}
										color={this.state.color}
										images={this.state.images}
										link={this.state.link}
										imgLoaded={this.state.imgLoaded}
										modalOpen={this.state.modalOpen}
										renderSwatches={this.renderSwatches}
										uploader={this.uploader}
										getColors={this.getColors}
										getUploaded={this.getUploaded}
										upload={this.upload}
										removeImg={this.removeImg}
										updateCom={this.updateCom}
										updateLinks={this.updateLinks}
										{...this.props}
									/>
								</div>
								<div style={{}}>
									<div className="input-field" style={{ minWidth: '50%', marginLeft: '10%', marginBottom: '0' }}>
										<h2 style={{ margin: '0' }}>
											<input
												style={{ margin: '0' }}
												id="subject"
												type="text"
												className="validate"
												value={this.state.emails ? this.state.emails[type_][`${type_}_subject`] : 'Subject'}
												onChange={(e) => this.updateReviewSubject(e.target.value)}
											/>
											<span className="helper-text" data-error="Invalid Subject" data-success="" />
										</h2>
										<label style={{ margin: '0' }} htmlFor="subject">
											Subject:{' '}
										</label>
									</div>
									<div style={{ marginLeft: '2.5%' }}>
										{og ? (
											<ReviewEmail
												comp={og}
												type={type_}
												format={this.state.activeFormat}
												email={emails}
												updateEmail={this.updateEmail.bind(this)}
												perm={'admin'}
												props={this.props}
											/>
										) : null}
									</div>
								</div>
							</NoDiv>
							<hr />
							<div style={{ width: '100%', minHeight: '80vh', display: 'flex' }}>
								<LandingPageSettings
									rating={this.state.rating}
									updating={this.state.updating}
									checkSkip={this.checkSkip.bind(this)}
									changeRating={this.changeRating.bind(this)}
									updateSkip={this.updateSkip.bind(this)}
									saveReviewLanding={this.saveReviewLanding.bind(this)}
									updateAllReviewLanding={this.updateAllReviewLanding.bind(this)}
									{...this.props}
								/>
								<div
									style={{
										width: '60%',
										height: '80%',
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
											perm={'admin'}
											props={this.props}
										/>
									) : null}
								</div>
							</div>
						</LargeContentHolder>
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Defaults);
