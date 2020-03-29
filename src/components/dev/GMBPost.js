import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper } from '../../utilities/index';
import axios from 'axios';
import { Select } from 'react-materialize';
import Modal from 'react-materialize/lib/Modal';

class GMBPost extends Component {
	constructor() {
		super();

		this.state = {
			loading: true,
			type: '',
			locations: [],
			og: [],
			accessToken: '',
			distinct: [],
			label: '',
			imgLink: '',
			articleLink: '',
			postText: '',
		};
	}
	async componentDidMount() {
		await axios.post(`/api/gmb/allaccounts`, { accessToken: this.state.accessToken, api: false, search: '' }).then(res => {
			this.setState({ loading: false });
			if (res.data.msg === 'GOOD') {
				let distinct = res.data.info
					.map(e => e.label)
					.filter((v, i, a) => a.indexOf(v) === i)
					.filter(e => e);
				this.setState({
					locations: res.data.info
						.filter(e => e.verified)
						.sort((a, b) => (a.location_name < b.location_name ? 1 : -1))
						.sort((a, b) => (a.label > b.label ? 1 : -1)),
					og: res.data.info,
					distinct,
				});
			} else {
				alert(res.data.msg);
			}
		});
	}
	renderLocations() {
		let { locations } = this.state;
		let inStyle = { width: '10%', borderRight: 'dotted black 1px' };
		let loc = locations.map((e, i) => {
			return (
				<div key={i} style={{ width: '80vw', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }} className="card">
					<h6 style={{ width: '15%', textAlign: 'left' }}>{e.location_id}</h6>
					<h6 style={{ width: '35%', textAlign: 'left' }}>{e.location_name}</h6>
					<input
						style={inStyle}
						value={e.c_id}
						onChange={c => {
							e.c_id = c.target.value;
							locations.splice(
								locations.findIndex(el => el.location_id === e.location_id),
								1,
								e,
							);
							this.setState({ locations });
						}}
					/>
					<input
						style={inStyle}
						value={e.label}
						onChange={c => {
							e.label = c.target.value;
							locations.splice(
								locations.findIndex(el => el.location_id === e.location_id),
								1,
								e,
							);
							this.setState({ locations });
						}}
					/>
					<button
						className="btn primary-color primary-hover"
						onClick={async () =>
							await axios
								.post('/api/gmb/update/label', { e })
								.then(res => (res.data.msg === 'GOOD' ? this.setState({ msg: `${e.company_name} Updated` }) : alert(res.data.msg)))
						}
					>
						U
					</button>
				</div>
			);
		});
		loc.unshift(
			<div key="Header" style={{ width: '80vw', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }} className="card">
				<h6 style={{ width: '15%', textAlign: 'left' }}>Location ID</h6>
				<h6 style={{ width: '35%', textAlign: 'left' }}>Location Name</h6>
				<h6 style={{ width: '10%' }}>C_ID</h6>
				<h6 style={{ width: '10%' }}>Label</h6>
				<button className="btn primary-color primary-hover">Update</button>
			</div>,
		);
		return loc;
	}
	async post() {
		let { accessToken, locations, label, imgLink, articleLink, postText } = this.state;
		if (accessToken && label && imgLink && articleLink && postText) {
			locations = locations.filter(e => e.label).filter(e => e.label.toLowerCase() === label.toLowerCase());
			await axios.post('/api/gmb/post', { accessToken, locations, imgLink, articleLink, postText }).then(res => {
				if (res.data.msg === 'GOOD') {
					alert('Posts Gucci');
				} else {
					console.log(res.data.msg);
					alert(res.data.msg);
				}
			});
		} else {
			switch (true) {
				case !accessToken:
					alert('You need an Access Token to continue');
					break;
				case !label:
					alert('You need a Label to continue');
					break;
				case !imgLink:
					alert('You need an Image Link to continue');
					break;
				case !articleLink:
					alert('You need an Article Link to continue');
					break;
				case !postText:
					alert('You need an postText to continue');
					break;
				default:
					alert('IDK What you did wrong but you did it');
					break;
			}
		}
	}
	render() {
		let data = { c_id: 24, owner_name: { first: 'Boi' }, company_name: process.env.REACT_APP_COMPANY_NAME };
		let { type, distinct } = this.state;
		if (this.state.imgLink) {
			// var request = new XMLHttpRequest();
			// request.open('HEAD', this.state.imgLink, false);
			// request.send(null);
			// var headerText = request.getAllResponseHeaders();
			// // let size = headerText.content-length
			// var re = /Content\-Length\s*:\s*(\d+)/i;
			// re = re.exec(headerText);
			// let size = re[1];
			// // alert(`${size} || minimum 10240`);
			// if (size <= 10240) {
			// 	alert('Image File Size To Small, Please Upload Bigger Image');
			// }
		}

		return (
			<Layout1 view={{ sect: 'indv', data: data }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				<LoadingWrapper loading={this.state.loading}>
					<div style={{ minHeight: '60vh' }}>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<h1>Choose Your Path</h1>
							<div style={{ width: '60vw', height: '10vh', display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '0' }}>
								<button className="btn primary-color primary-hover" onClick={() => this.setState({ type: 'post' })}>
									New Post
								</button>
								<button className="btn primary-color primary-hover" onClick={() => this.setState({ type: 'label' })}>
									Add Labels
								</button>
							</div>
						</div>
						{type === 'label' ? (
							<div>{this.renderLocations()}</div>
						) : type === 'post' ? (
							<div>
								<div style={{ display: 'flex', width: '50vw', alignItems: 'center', justifyContent: 'space-around' }}>
									<div className="input-field" style={{ height: '5vh', width: '30%' }}>
										<h2 style={{ margin: '0' }}>
											<input value={this.state.accessToken} onChange={e => this.setState({ accessToken: e.target.value })} />
										</h2>
										<label>Access Token</label>
									</div>
									<button className="btn primary-color primary-hover" onClick={() => this.post()}>
										Publish
									</button>
								</div>
								<div style={{ display: 'flex', width: '50vw', alignItems: 'center', justifyContent: 'space-around', marginTop: '2.5vh' }}>
									<div style={{ height: '5vh', width: '30%' }}>
										<Select value={this.state.label} onChange={e => this.setState({ label: e.target.value })}>
											<option defaultValue="selected">Select Label</option>
											{distinct.map((e, i) => (
												<option value={e} key={i}>
													{e}
												</option>
											))}
										</Select>
									</div>
									<div style={{ width: '7vw' }}></div>
								</div>
								<div>
									<div style={{ display: 'flex', width: '50vw', alignItems: 'center', justifyContent: 'space-around', marginTop: '2.5vh' }}>
										<div className="input-field" style={{ height: '5vh', width: '30%', borderBottom: this.state.size <= 10240 ? 'red' : '' }}>
											<h2 style={{ margin: '0' }}>
												<input value={this.state.imgLink} onChange={e => this.setState({ imgLink: e.target.value })} />
											</h2>
											<label>IMG Link</label>
										</div>
										<div style={{ width: '7vw' }}>
											{this.state.imgLink ? <img src={this.state.imgLink} alt="Not Found" style={{ maxWidth: '200px' }} id="imageId" /> : null}
										</div>
									</div>
									<div style={{ display: 'flex', width: '50vw', alignItems: 'center', justifyContent: 'space-around', marginTop: '2.5vh' }}>
										<div className="input-field" style={{ height: '5vh', width: '30%' }}>
											<h2 style={{ margin: '0' }}>
												<input value={this.state.articleLink} onChange={e => this.setState({ articleLink: e.target.value })} />
											</h2>
											<label>Article Link</label>
										</div>
										<div style={{ width: '7vw' }}></div>
									</div>
									<div style={{ display: 'flex', width: '50vw', alignItems: 'center', justifyContent: 'space-around', marginTop: '2.5vh' }}>
										<div className="input-field" style={{ height: '5vh', width: '100%' }}>
											<h2 style={{ margin: '0' }}>
												<input value={this.state.postText} onChange={e => this.setState({ postText: e.target.value })} />
											</h2>
											<label>Post Text</label>
										</div>
									</div>
									<Modal
										style={{ outline: 'none', width: '70vw', marginRight: '10vw' }}
										trigger={
											<button className="btn primary-color primary-hover" style={{ marginTop: '5vh' }}>
												Get Access Token
											</button>
										}
									>
										<div>
											<ul>
												<li>
													<h3>
														1. Go to this <a href="https://developers.google.com/oauthplayground/">Link</a>{' '}
													</h3>
												</li>
												<li>
													<h3>2. Click Gear Icon in top right</h3>
												</li>
												<li>
													<h3>3. Set OAuth flow to Client-side.</h3>
												</li>
												<li>
													<h3>4. Select Use your own OAuth credentials.</h3>
												</li>
												<li>
													<h3>
														5. Paste in <b>228048768114-f1q4fjrpvu8tehceld94e7840dot5k03.apps.googleusercontent.com</b> <br /> and then close
													</h3>
												</li>
												<li>
													<h3>
														6. In the "Input your own scopes" paste <b>https://www.googleapis.com/auth/business.manage</b>
													</h3>
												</li>
												<li>
													<h3>6. Click Authorize API and login with Manager@{process.env.REACT_APP_COMPANY_NAME}.com</h3>
												</li>
												<li>
													<h3>7. Click back to "Step 1's result" and copy the Acces token</h3>
												</li>
												<li>
													<h3>
														<b>Leave Playground Tab Open</b>
													</h3>
												</li>
											</ul>
										</div>
									</Modal>
								</div>
							</div>
						) : (
							''
						)}
					</div>
				</LoadingWrapper>
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(GMBPost);
