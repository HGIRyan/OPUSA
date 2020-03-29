import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NoDiv, SideBarLink, SideBarComponentDiv } from '../../../utilities';
const width = window.innerWidth;

class Client extends Component {
	constructor() {
		super();

		this.state = {};
	}
	sidebar() {
		// let props = this.props.props;
		let bigWidth = window.innerWidth >= 1500;
		let lState = this.props.props.props.location.state;
		let item = { width: !bigWidth ? '4.25vw' : '10vw', height: '4vh', margin: '1% 0', display: 'flex', justifyContent: !bigWidth ? 'center' : 'flex-start' };
		let loca = this.props.props.props.location.pathname;
		let data = lState;
		data = lState.info.filter(e => e.c_id === parseInt(this.props.props.props.match.params.client_id))[0];
		let { c_id, cor_id } = data;
		return (
			<SideBarComponentDiv className="center-align">
				<SideBarLink
					to={{ pathname: `/client-dash/${cor_id}/${c_id}`, state: lState }}
					style={item}
					className={`${loca === `/client-dash/${cor_id}/${c_id}` ? 'sidebar-color' : 'tertiary-color'} sidebar-hover `}
				>
					<i className="material-icons">home</i>
					{bigWidth ? <h6>Home</h6> : null}
				</SideBarLink>
				<hr />
				<SideBarLink
					indent="5%"
					to={{
						pathname: `/client-dash/${cor_id}/upload/${c_id}`,
						state: lState,
					}}
					style={item}
					className={`${loca.includes(`/client-dash/${cor_id}/upload/${c_id}`) ? 'sidebar-color' : 'tertiary-color'} sidebar-hover `}
				>
					<i className="material-icons">cloud_upload</i>
					<h6 className="">{bigWidth ? 'Upload List' : ''}</h6>
				</SideBarLink>
				<SideBarLink
					indent="5%"
					to={{
						pathname: `/indv-customer/new/${cor_id}/${c_id}`,
						state: lState,
					}}
					style={item}
					className={`${loca.includes(`/indv-customer/new/${cor_id}/${c_id}`) ? 'sidebar-color' : 'tertiary-color'} sidebar-hover `}
				>
					<i className="material-icons">fiber_new</i>
					<h6 className="">{bigWidth ? 'New Contact' : ''}</h6>
				</SideBarLink>
				<hr />
				{data.active_prod.reviews ? (
					<SideBarLink
						style={item}
						indent="2.5%"
						className={`${loca === `/client-dash/${data.cor_id}/report/review/${data.c_id}` ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
						to={{
							pathname: `/client-dash/${data.cor_id}/report/review/${data.c_id}`,
							state: lState,
						}}
					>
						<i className="material-icons">bar_chart</i>
						<h6>{bigWidth ? 'Reviews Report' : ''}</h6>
					</SideBarLink>
				) : null}
				{data.active_prod.leadgen ? (
					<SideBarLink
						indent="5%"
						style={item}
						className={`${loca.includes(`/client-dash/${data.cor_id}/report/lead/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color left'}  sidebar-hover`}
						to={{ pathname: `/client-dash/${data.cor_id}/report/lead/${data.c_id}`, state: lState }}
					>
						<i className="material-icons">sports_handball</i>
						<h6 style={{ fontSize: '1em' }}>{bigWidth ? 'Lead Report' : 'Lead'}</h6>
					</SideBarLink>
				) : null}
				{data.active_prod.cross_sell ? (
					<SideBarLink
						indent="5%"
						style={item}
						className={`${loca.includes(`/client-dash/${data.cor_id}/report/cross/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
						to={{ pathname: `/client-dash/${data.cor_id}/report/cross/${data.c_id}`, state: lState }}
					>
						<i className="material-icons">bathtub</i>
						<h6 style={{ fontSize: '1em' }}>{bigWidth ? 'Cross Sell Report' : 'Cross Sell'}</h6>
					</SideBarLink>
				) : null}
				{data.active_prod.referral ? (
					<SideBarLink
						indent="5%"
						style={item}
						className={`${loca.includes(`/client-dash/${data.cor_id}/report/ref/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
						to={{ pathname: `/client-dash/${data.cor_id}/report/ref/${data.c_id}`, state: lState }}
					>
						<i className="material-icons">group_add</i>
						<h6 style={{ fontSize: '1em' }}>{bigWidth ? 'Referral Report' : 'Referral'}</h6>
					</SideBarLink>
				) : null}
				{data.active_prod.winback ? (
					<SideBarLink
						indent="5%"
						style={item}
						className={`${loca.includes(`/client-dash/${data.cor_id}/report/win/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover left`}
						to={{ pathname: `/client-dash/${data.cor_id}/report/win/${data.c_id}`, state: lState }}
					>
						<i className="material-icons">settings_backup_restore</i>
						<h6 style={{ fontSize: '1em' }}>{bigWidth ? 'Winback Report' : 'Winback'}</h6>
					</SideBarLink>
				) : null}
				<hr />
				{data.active_prod.reviews ? (
					<SideBarLink
						indent="5%"
						style={item}
						className={`${loca.includes(`/client-dash/${data.cor_id}/emails/reviews/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
						to={{
							pathname: `/client-dash/${data.cor_id}/emails/reviews/${data.c_id}`,
							state: lState,
						}}
					>
						<i className="material-icons">rate_review</i> <h6>{bigWidth ? 'Review Email' : ''}</h6>
					</SideBarLink>
				) : null}
				{data.active_prod.winback ? (
					<SideBarLink
						indent="5%"
						style={item}
						className={`${loca.includes(`/client-dash/${data.cor_id}/emails/winback/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
						to={{
							pathname: `/client-dash/${data.cor_id}/emails/winback/${data.c_id}`,
							state: lState,
						}}
					>
						<i className="material-icons">settings_backup_restore</i>
						<h6 style={{ fontSize: '1em' }}>{bigWidth ? 'Winback' : ''}</h6>
					</SideBarLink>
				) : null}
				{data.active_prod.leadgen ? (
					<SideBarLink
						indent="5%"
						style={item}
						className={`${loca.includes(`/client-dash/${data.cor_id}/emails/leadgen/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
						to={{
							pathname: `/client-dash/${data.cor_id}/emails/leadgen/${data.c_id}`,
							state: lState,
						}}
					>
						<i className="material-icons">sports_handball</i> <h6 style={{ fontSize: '1em' }}>{bigWidth ? 'LeadGen' : ''}</h6>
					</SideBarLink>
				) : null}
				{data.active_prod.cross_sell ? (
					<SideBarLink
						indent="5%"
						style={item}
						className={`${loca.includes(`/client-dash/${data.cor_id}/emails/cross/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
						to={{
							pathname: `/client-dash/${data.cor_id}/emails/cross/${data.c_id}`,
							state: lState,
						}}
					>
						<i className="material-icons">bathtub</i>
						<h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Cross Sell' : ''}</h6>
					</SideBarLink>
				) : null}
				{data.active_prod.referral ? (
					<SideBarLink
						indent="5%"
						style={item}
						className={`${loca.includes(`/client-dash/${data.cor_id}/emails/ref/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
						to={{
							pathname: `/client-dash/${data.cor_id}/emails/ref/${data.c_id}`,
							state: lState,
						}}
					>
						<i className="material-icons">group_add</i>
						<h6 style={{ fontSize: '1em' }}>{width >= 1500 ? 'Referral' : ''}</h6>
					</SideBarLink>
				) : null}
				<hr />
				<SideBarLink
					indent="5%"
					style={item}
					className={`${loca.includes(`/client-dash/${data.cor_id}/review-links/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
					to={{
						pathname: `/client-dash/${data.cor_id}/review-links/${data.c_id}`,
						state: lState,
					}}
				>
					{' '}
					<i className="material-icons">link</i>
					<h6>{width >= 1500 ? 'Links' : ''}</h6>
				</SideBarLink>
				<SideBarLink
					indent="5%"
					style={item}
					className={`${loca.includes(`/client-dash/${data.cor_id}/brand-settings/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
					to={{
						pathname: `/client-dash/${data.cor_id}/brand-settings/${data.c_id}`,
						state: lState,
					}}
				>
					<i className="material-icons">broken_image</i>
					<h6>{width >= 1500 ? 'Logos' : ''}</h6>
				</SideBarLink>
				<SideBarLink
					indent="5%"
					style={item}
					className={`${loca.includes(`/client-dash/${data.cor_id}/settings/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
					to={{
						pathname: `/client-dash/${data.cor_id}/settings/${data.c_id}`,
						state: lState,
					}}
				>
					<i className="material-icons">perm_data_setting</i>
					<h6>{width >= 1500 ? 'Notification Settings' : ''}</h6>
				</SideBarLink>
				{/* <SideBarLink
					indent="5%"
					style={item}
					className={`${loca.includes(`/client-dash/${data.cor_id}/insight-history/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
					to={{
						pathname: `/client-dash/${data.cor_id}/insight-history/${data.c_id}`,
						state: lState,
					}}
				>
					<i className="material-icons">grain</i>
					<h6>{width >= 1500 ? 'GMB Insights' : ''}</h6>
				</SideBarLink> */}
				<SideBarLink
					indent="5%"
					style={item}
					className={`${loca.includes(`/client-dash/${data.cor_id}/business-Details/${data.c_id}`) ? 'sidebar-color' : 'tertiary-color'}  sidebar-hover`}
					to={{
						pathname: `/client-dash/${data.cor_id}/business-details/${data.c_id}`,
						state: lState,
					}}
				>
					<i className="material-icons">info</i> <h6>{width >= 1500 ? 'Business Details' : ''}</h6>
				</SideBarLink>
				<hr />
				{lState.info.filter(e => e.cor_id === parseInt(this.props.props.props.match.params.cor_id)).length > 1 && lState.sub_perm.view_all ? (
					<NoDiv
						direction="column"
						align="flex-start"
						width="100%"
						// border="solid black 2px"
						style={{ overflowY: 'auto', maxHeight: '30vh' }}
						className="scrollNone"
					>
						{this.multiLoc(data, lState.info, lState.info, lState)}
					</NoDiv>
				) : null}
			</SideBarComponentDiv>
		);
	}
	multiLoc(data, info, locations, lState) {
		// let length = locations.length;
		let bigWidth = window.innerWidth >= 1500;
		return (
			locations
				.filter(e => e.cor_id === parseInt(this.props.props.props.match.params.cor_id))
				// .filter(e => e.c_id === data.c_id)
				.map((loc, i) => {
					return (
						<SideBarLink
							key={i}
							className={`sidebar-hover ${loc.c_id === data.c_id ? 'secondary-color' : ''}`}
							style={{
								width: bigWidth ? '9.5vw' : '5vw',
								minHeight: '4vh',
								paddingLeft: '5%',
								margin: '1% 1%',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								color: !loc.active ? 'red' : '',
								// border: loc.active ? '' : 'solid red 1px',
								// borderBottom: loc.active ? 'solid gray 1px' : 'solid red 1px',
							}}
							to={{ pathname: `/client-dash/${loc.cor_id}/${loc.c_id}`, state: lState }}
						>
							{bigWidth ? loc.address.street.split(' ')[0] + ', ' + loc.address.city : loc.address.zip}
							{/* {loc.company_name.slice(0, 5)} */}
						</SideBarLink>
					);
				})
		);
	}
	render() {
		return (
			<NoDiv width="100%" direction="column" className="tertiary-color" style={{ borderRight: 'solid #00283d .5vh' }}>
				{this.sidebar()}
			</NoDiv>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Client);
