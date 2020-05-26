import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1 } from '../../utilities/index';
import axios from 'axios';

class Migration extends Component {
	constructor() {
		super();

		this.state = {
			info: [],
			bus_id: '',
			c_id: '',
			client_id: '',
			search: '',
			sf_id: '',
			res: [],
			migData: [],
			migrate: false,
		};
	}
	async componentDidMount() {
		await this.setState({ info: this.props.location.state.info });
		// console.log(this.props.location.state);
	}
	getAgents() {
		let { info } = this.state;
		let inStyle = { width: '10%', borderRight: 'solid black' };
		let not = ['allstate', 'farmers', 'nationwide'];
		let migData = info
			.filter((e) => e.active) //&& !not.some((el) => e.company_name.toLowerCase().includes(el)))
			.map((e, i) => {
				return (
					<div key={i} style={{ width: '80vw', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="card">
						<h6 style={{ width: '2.5%' }}>{e.c_id}</h6>
						<h6
							style={{ width: '35%' }}
							onClick={() => this.props.history.push(`/client-dash/${e.cor_id}/brand-settings/${e.c_id}`, this.props.location.state)}
						>
							{e.company_name}
						</h6>
						{this.state.migrate ? (
							<div>
								<input
									style={inStyle}
									value={e.c_api.salesforce.sf_id}
									onChange={(c) => {
										e.c_api.salesforce.sf_id = c.target.value;
										info.splice(
											info.findIndex((el) => el.c_id === e.c_id),
											1,
											e,
										);
										this.setState({ info });
									}}
								/>
								<input
									style={inStyle}
									value={e.c_api.internal}
									onChange={(c) => {
										e.c_api.internal = c.target.value;
										info.splice(
											info.findIndex((el) => el.c_id === e.c_id),
											1,
											e,
										);
										this.setState({ info });
									}}
								/>
								<input
									style={inStyle}
									value={e.c_api.gatherup.business_id}
									onChange={(c) => {
										e.c_api.gatherup.business_id = c.target.value;
										info.splice(
											info.findIndex((el) => el.c_id === e.c_id),
											1,
											e,
										);
										this.setState({ info });
									}}
								/>
								<input
									style={inStyle}
									value={e.c_api.gatherup.client_id}
									onChange={(c) => {
										e.c_api.gatherup.client_id = c.target.value;
										info.splice(
											info.findIndex((el) => el.c_id === e.c_id),
											1,
											e,
										);
										this.setState({ info });
									}}
								/>
								<button
									className="btn primary-color primary-hover"
									onClick={async () =>
										await axios
											.post('/api/migration/update/api', { e })
											.then((res) => (res.data.msg === 'GOOD' ? this.setState({ msg: `${e.company_name} Updated` }) : alert(res.data.msg)))
									}
								>
									U
								</button>
								{/* <button className="btn primary-color primary-hover" onClick={() => this.syncSF(e)}>
									SF
								</button> */}
								<button className="btn primary-color primary-hover" onClick={() => this.syncG(e)}>
									G
								</button>
								<button className="btn primary-color primary-hover" onClick={() => this.syncI(e)}>
									I
								</button>
							</div>
						) : (
							<div>
								<img src={e.logo} style={{ maxHeight: '50px' }} />
							</div>
						)}
					</div>
				);
			});
		migData.unshift(
			<div key="Header" style={{ width: '80vw', height: '5vh', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }} className="card">
				<h6 style={{ width: '2.5%' }}>c_id</h6>
				<h6 style={{ width: '35%' }}>company_name</h6>
				<h6 style={{ width: '10%' }}>SalesForce ID</h6>
				<h6 style={{ width: '10%' }}>Internal ID</h6>
				<h6 style={{ width: '10%' }}>Business ID</h6>
				<h6 style={{ width: '10%' }}>Client ID</h6>
				<button className="btn primary-color primary-hover">Update</button>
				<button className="btn primary-color primary-hover">Sync</button>
			</div>,
		);
		// this.setState({ migData });
		return migData;
	}
	async syncSF(og) {
		console.log('Syncing', og);
		await axios.post('/api/sync/salesforce', { og }).then((res) => {
			if (res.data.msg === 'GOOD') {
				console.log('Synced GOOD', og.company_name);
				this.setState({ msg: `${og.company_name} Synced SalesForce` });
				alert(`${og.company_name} Synced SalesForce`);
			} else {
				alert(res.data.msg);
			}
		});
	}
	async syncG(og) {
		if (og.c_api.gatherup.business_id && og.c_api.gatherup.client_id) {
			await axios.post('/api/sync/gatherup', { og }).then(async (res) => {
				if (res.data.msg === 'GOOD') {
					console.log('Synced GOOD', og.company_name);
					this.setState({ msg: `${og.company_name} Synced Gatherup` });
					alert(`${og.company_name} Synced Gatherup`);
				} else {
					alert(res.data.msg);
				}
			});
		} else {
			alert('You need to Input and Save Gatherup Info');
		}
	}
	async syncI(og) {
		if (og.c_api.internal) {
			await axios.post('/api/sync/internal', { og }).then(async (res) => {
				if (res.data.msg === 'GOOD') {
					console.log('Synced GOOD', og.company_name);
					this.setState({ msg: `${og.company_name} Synced Internal` });
					alert(`${og.company_name} Synced Internal`);
				} else {
					alert(res.data.msg);
				}
			});
		} else {
			alert('You need to Input and Save Internal Info');
		}
	}
	async gatherAgents() {
		// let { info, c_id, bus_id, client_id } = this.state;
		let { info, c_id } = this.state;
		let check = info.filter((e) => parseInt(e.c_id) === parseInt(c_id));
		if (check[0]) {
			await axios.post('/api/getgatherupcustomer', { c_id, check }).then((res) => {
				if (res.data.msg === 'GOOD') {
					console.log('WE GOOD');
				}
			});
		} else {
			console.log('WE NOT GUCCI');
		}
		// await axios.get('/api/all-agents').then(res => console.log(res));
	}
	async updateAPI() {
		let { info, c_id, bus_id, client_id } = this.state;
		let check = info.filter((e) => parseInt(e.c_id) === parseInt(c_id));
		if (check[0] && client_id) {
			await axios.post('/api/update/gatherup/credientials', { c_id, bus_id, client_id, check }).then((res) => {
				if (res.data.msg === 'GOOD') {
					console.log('WE GOOD');
				}
			});
		} else {
			console.log('WE NOT GUCCI');
		}
	}
	async testSF() {
		await axios.get('/api/salesforce/test').then((res) => {
			console.log(res.data);
		});
	}
	results() {
		let { search } = this.state;
		let res = this.props.location.state.info;
		res = res.filter((e) => e.company_name.toLowerCase().includes(search.toLowerCase()));
		if (search && res[0]) {
			return res.map((e, i) => {
				return (
					<div
						key={i}
						style={{
							cursor: 'pointer',
							minWidth: '20vw',
							height: '5vh',
							margin: '5%',
							border: 'solid black',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						onClick={() => this.submitSF(e)}
					>
						{e.company_name}
					</div>
				);
			});
		} else {
			return 'No Results';
		}
	}
	async submitSF(e) {
		let { sf_id } = this.state;
		if (sf_id && e.c_id) {
			e.c_api.salesforce = { sf_id: sf_id };
			console.log(e.c_api);
			// Send API Obj and ID
			let c_id = e.c_id;
			let key = e.c_api;
			await axios.post('/api/update/api', { c_id, key });
			// alert(`Good e - ${e.c_id} SF - ${sf_id}`);
		} else alert('Missing SalesForce ID');
	}
	render() {
		let data = { c_id: 24, owner_name: { first: 'Boi' }, company_name: process.env.REACT_APP_COMPANY_NAME };

		return (
			<Layout1 view={{ sect: 'indv', data: data }} match={this.props.match ? this.props.match.params : null} props={this.props}>
				<h6
					onClick={() => {
						this.setState({ migrate: !this.state.migrate });
					}}
				>
					Migration Page
				</h6>
				{/* <button onClick={() => this.gatherAgents()}> Start Migration </button>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<h5>C_ID</h5>
					<input onChange={e => this.setState({ c_id: e.target.value })} />
					<h5>bus_id</h5>
					<input onChange={e => this.setState({ bus_id: e.target.value })} />
					<h5>client_id</h5>
					<input onChange={e => this.setState({ client_id: e.target.value })} />
					<button onClick={() => this.updateAPI()}>Apply</button>
				</div> */}
				{/* <div style={{ display: 'flex', flexDirection: 'column' }}>
					<h3>SF Tests</h3>
					<button onClick={() => this.testSF()}>TEST</button>
				</div> */}
				{/* <div style={{ display: 'flex', flexDirection: 'column' }}>
					<h3>Attatch SF To LiLo</h3>
					<h6>SalesForce ID</h6>
					<input onChange={e => this.setState({ sf_id: e.target.value })} value={this.state.sf_id} />
					<h6>Search For Client</h6>
					<input onChange={e => this.setState({ search: e.target.value })} value={this.state.search} />
					{this.results()}
				</div> */}
				<div>{this.getAgents()}</div>
			</Layout1>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Migration);
