import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv, LoadingWrapperSmall } from '../../../utilities/index';
import axios from 'axios';
import { BusInfo, BusKeys, ViewUser, AddUser } from './Deets';
class BusinessDetails extends Component {
	constructor() {
		super();

		this.state = {
			og: { c_id: 24, owner_name: { first: 'Boi' }, company_name: process.env.REACT_APP_COMPANY_NAME },
			permissionLevel: 'client',
			users: [],
		};
	}
	async componentDidMount() {
		let { info } = this.props.User;
		let { client_id, cor_id, page } = this.props.match.params;
		let pages = ['details', 'view-users', 'add-user', 'business-keys'];
		if (typeof page === 'undefined' || !pages.some((e) => e.toString().toLowerCase() === page.toString().toLowerCase())) {
			this.props.history.replace(`/client-dash/${cor_id}/business-details/${client_id}/details`, this.props.location.state);
		}
		if (Array.isArray(this.props.location.state.info)) {
			info = this.props.location.state.info.filter((item) => item.c_id === parseInt(client_id));
			if (info.length >= 1) {
				document.title = `${info[0].company_name} Details`;
				this.setState({ og: info[0] });
			} else {
				this.getBusiness(client_id);
			}
		} else {
			this.getBusiness(client_id);
		}
	}
	async getBusiness(id) {
		await axios.get(`/api/get/business_details/${id}`).then((res) => {
			if (res.data.msg === 'GOOD') {
				let info = res.data.info[0];
				this.settingState(info);
			} else {
				alert(res.data.msg);
			}
		});
	}

	// async updateCorID() {
	// 	let { cor_id, og } = this.state;
	// 	if (cor_id.length >= 1) {
	// 		await axios.post('/api/update/cor_id', { cor_id, og }).then((res) => {
	// 			if (res.data.msg === 'GOOD') {
	// 				alert('UPDATED');
	// 			} else {
	// 				alert(res.data.msg, JSON.stringify(res.data.err));
	// 			}
	// 		});
	// 	}
	// }

	render() {
		let { loc, page, client_id, cor_id } = this.props.match.params;

		let { edit } = this.state;
		let permission = this.props.location.state.permissions;
		edit = permission === 'admin' ? edit : false;
		return (
			<>
				<Layout1 view={{ sect: 'indv', data: this.state.og, loc }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						{page === 'details' ? (
							this.state.og.cor_id ? (
								<BusInfo {...this.props} og={this.state.og} />
							) : null
						) : page === 'view-users' ? (
							<ViewUser {...this.props} />
						) : page === 'add-user' ? (
							<AddUser {...this.props} />
						) : page === 'business-keys' && permission === 'admin' ? (
							this.state.og.cor_id ? (
								<BusKeys {...this.props} og={this.state.og} />
							) : null
						) : (
							<></>
						)}
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(BusinessDetails);
