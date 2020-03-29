import React from 'react'; // , { useState, useEffect }
import { connect } from 'react-redux';
import { HeaderHolder, SideBarContainer, ContentHolder, FooterContainer, ChildFlexContainer } from './../../utilities/index';

import Header from './Header';
import AdminSide from './sidebars/admin';
import SalesSide from './sidebars/sales';
import ClientSide from './sidebars/client';

import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

function Layout1(props) {
	// useEffect(() => {
	// 	if (window.innerWidth <= 1500) {
	// 		// setCol(false);
	// 	}
	// });
	// let [bigWidth, setCol] = useState(true);
	let sidebar = () => {
		if (props.props.location.state) {
			let i = props.props.location.state.permissions;
			if (i === 'admin') {
				return <AdminSide props={props} history={history} />;
			} else if (i === 'sales') {
				return <SalesSide props={props} history={history} />;
			} else if (i === 'client') {
				return <ClientSide props={props} history={history} />;
			}
		} else {
		}
	};
	let nprops = props.props ? props.props : { location: { pathname: '/home' } };
	let bigWidth = window.innerWidth >= 1500;
	return (
		<>
			<HeaderHolder>
				<Header props={props} />
			</HeaderHolder>
			<SideBarContainer props={nprops} width={!bigWidth ? '5vw' : ''}>
				{sidebar()}
			</SideBarContainer>
			<ContentHolder left={!bigWidth ? '4vw' : ''}>
				<ChildFlexContainer>
					{props.children}
					<FooterContainer width={window.innerWidth}>Powered By {process.env.REACT_APP_COMPANY_NAME} ©</FooterContainer>
				</ChildFlexContainer>
			</ContentHolder>
		</>
	);
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Layout1);
