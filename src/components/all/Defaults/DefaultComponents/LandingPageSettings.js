import React, { Component } from 'react';
import { Select, Modal } from 'react-materialize';
import { LoadingWrapperSmall } from '../../../../utilities/index';

class LandingPageSettings extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let { rating, changeRating, checkSkip, updateSkip, saveReviewLanding, updateAllReviewLanding, updating } = this.props;
		return (
			<div style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: '2.5%' }}>
				<h3>Landing Page Settings</h3>
				<hr style={{ marginLeft: '0' }} />
				<div className="input-field">
					<label style={{ margin: '0' }}>Rating:</label>
					<Select value={rating?.toString()} onChange={e => changeRating(e.target.value)}>
						<option value="2">1-2</option>
						<option value="3">3</option>
						<option value="4">4-5</option>
					</Select>
				</div>
				<div className="input-field">
					<label style={{ margin: '0' }}>Skip Landing:</label>
					<Select value={checkSkip()} onChange={e => updateSkip(e.target.value)}>
						<option value="0">Do Not Skip</option>
						<option value="1">Skip</option>
					</Select>
				</div>
				<LoadingWrapperSmall loading={updating} text="UPDATING">
					<button className="btn primary-color primary-hover" onClick={() => saveReviewLanding()}>
						Update Landing Page
					</button>
				</LoadingWrapperSmall>
				<Modal
					open={this.state.openRLandingWarning}
					style={{ outline: 'none' }}
					trigger={
						<button style={{ marginTop: '5%' }} className="btn primary-color primary-hover">
							Update All Landing Pages
						</button>
					}
				>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
						<h3 style={{ color: 'red', fontSize: '1.5em' }}>
							Warning: Are You Sure You Want To Update{' '}
							<b style={{ textDecoration: 'underline', margin: '0 1% 0 .5%' }}>
								{this.props.match.params.type !== 'NA' ? `ALL ${this.props.match.params.type}` : 'ALL'}
							</b>
							Accounts With These Settings?
						</h3>
						<div style={{ width: '30%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<button className="btn primary-color primary-hover" onClick={() => updateAllReviewLanding()}>
								Yes
							</button>
							<button className="btn primary-color primary-hover" onClick={() => this.setState({ openRLandingWarning: false })}>
								No
							</button>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

export default LandingPageSettings;
