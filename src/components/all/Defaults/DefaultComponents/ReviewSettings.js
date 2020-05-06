import React, { Component } from 'react';
import { NoDiv, LoadingWrapperSmall } from './../../../../utilities/index';
import { Modal, Select } from 'react-materialize';

class ReviewSettings extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let { settings, reviewEmail, state, updateAllReviewEmail, updateReviewEmail, updateImg, fromEmail, updateSettings } = this.props;
		let reviewInputStyle = {
			width: '100%',
			marginBottom: '5%',
		};
		return (
			<NoDiv direction="column" just="space-around" height="100%" width="25%" padding=" 0 2.5%" className="card hoverable">
				<h4>Review Settings</h4>
				<LoadingWrapperSmall loading={reviewEmail}>
					<button
						style={{ zIndex: '0' }}
						className="btn primary-color primary-hover waves-effect waves-light"
						onClick={() => {
							updateReviewEmail();
						}}
					>
						Save Review Email
					</button>
				</LoadingWrapperSmall>
				<Modal
					open={state.openREmailWarning}
					style={{ outline: 'none' }}
					trigger={
						<button style={{ marginTop: '5%' }} className="btn primary-color primary-hover" onClick={() => this.setState({ openREmailWarning: true })}>
							Update All Review Emails
						</button>
					}
				>
					{state.updateImg ? (
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
							<h3 style={{ color: 'red', fontSize: '1.5em', textAlign: 'center' }}>
								Warning: Are You Sure You Want To Update <br />
								<b style={{ textDecoration: 'underline', margin: '0 1% 0 .5%' }}>
									{this.props.match.params.type !== 'NA' ? `ALL ${this.props.match.params.type}` : 'ALL'}
								</b>
								<br />
								Accounts With The New Image?
							</h3>
							<div style={{ width: '30%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<button className="btn primary-color primary-hover" onClick={() => updateAllReviewEmail(true)}>
									Yes
								</button>
								<button className="btn primary-color primary-hover" onClick={() => updateAllReviewEmail(false)}>
									No
								</button>
							</div>
						</div>
					) : (
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
							<h3 style={{ color: 'red', fontSize: '1.5em', textAlign: 'center' }}>
								Warning: Are You Sure You Want To Update:
								<br />
								<b style={{ textDecoration: 'underline', margin: '0 1% 0 .5%' }}>
									{this.props.match.params.type ? `ALL ${this.props.match.params.type}` : 'ALL'}
								</b>
								<br />
								Accounts With These Settings?
							</h3>
							<div style={{ width: '30%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<button className="btn primary-color primary-hover" onClick={() => updateImg(true)}>
									Yes
								</button>
								<button className="btn primary-color primary-hover" onClick={() => this.setState({ openREmailWarning: false })}>
									No
								</button>
							</div>
						</div>
					)}
				</Modal>
				<div className="input-field" style={reviewInputStyle}>
					<h2 style={{ margin: '0' }}>
						<input value={settings.auto_amt ? settings.auto_amt.toString() : '0'} type="number" onChange={e => updateSettings('auto_amt', e.target.value)} />
					</h2>
					<label>Auto AMT</label>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
					<div className="input-field" style={{ width: '100%', padding: '0', margin: '0 0 1% 0' }}>
						<Select id="repeat" onChange={e => updateSettings('repeat', e.target.value)} value={settings.first ? settings.repeat.toString() : '0'}>
							<option value="36500">Never</option>
							<option value="365">365</option>
							<option value="180">180</option>
							<option value="90">90</option>
							<option value="60">60</option>
							<option value="45">45</option>
							<option value="30">30</option>
						</Select>
						<label htmlFor="repeat">Repeat Request: </label>
					</div>
					<div className="input-field" style={{ width: '100%', padding: '0', margin: '0 0 1% 0' }}>
						<Select id="repeat" onChange={e => updateSettings('first', e.target.value)} value={settings.first ? settings.first.toString() : '0'}>
							<option value="14">14</option>
							<option value="7">7</option>
							<option value="6">6</option>
							<option value="5">5</option>
							<option value="4">4</option>
							<option value="3">3</option>
							<option value="2">2</option>
							<option value="1">1</option>
						</Select>
						<label htmlFor="repeat">First Reminder: </label>
					</div>
					<div className="input-field" style={{ width: '100%', padding: '0', margin: '0 0 1% 0' }}>
						<Select id="repeat" onChange={e => updateSettings('second', e.target.value)} value={settings.first ? settings.second.toString() : '0'}>
							<option value="14">14</option>
							<option value="7">7</option>
							<option value="6">6</option>
							<option value="5">5</option>
							<option value="4">4</option>
							<option value="3">3</option>
							<option value="2">2</option>
							<option value="1">1</option>
						</Select>
						<label htmlFor="repeat">Second Reminder: </label>
					</div>
					<div className="input-field" style={{ width: '100%', padding: '0', margin: '0 0 1% 0' }}>
						<Select id="repeat" onChange={e => updateSettings('open', e.target.value)} value={settings.first ? settings.open.toString() : '0'}>
							<option value="14">14</option>
							<option value="7">7</option>
							<option value="6">6</option>
							<option value="5">5</option>
							<option value="4">4</option>
							<option value="3">3</option>
							<option value="2">2</option>
							<option value="1">1</option>
						</Select>
						<label htmlFor="repeat">Open Reminder: </label>
					</div>
					<div className="input-field" style={{ width: '100%', padding: '0', margin: '0 0 1% 0' }}>
						<Select id="repeat" onChange={e => updateSettings('positive', e.target.value)} value={settings.first ? settings.positive.toString() : '0'}>
							<option value="14">14</option>
							<option value="7">7</option>
							<option value="6">6</option>
							<option value="5">5</option>
							<option value="4">4</option>
							<option value="3">3</option>
							<option value="2">2</option>
							<option value="1">1</option>
						</Select>
						<label htmlFor="repeat">Positive Reminder: </label>
					</div>
					<div className="input-field" style={{ width: '100%', padding: '0', margin: '0 0 1% 0' }}>
						<Select id="repeat" onChange={e => updateSettings('s_positive', e.target.value)} value={settings.first ? settings.s_positive.toString() : '0'}>
							<option value="14">14</option>
							<option value="7">7</option>
							<option value="6">6</option>
							<option value="5">5</option>
							<option value="4">4</option>
							<option value="3">3</option>
							<option value="2">2</option>
							<option value="1">1</option>
						</Select>
						<label htmlFor="repeat">Second Positive Reminder: </label>
					</div>
				</div>
				{/* <div className="input-field" style={reviewInputStyle}>
            <h2 style={{ margin: '0' }}>
                <input
                    value={settings.frequency ? settings.frequency.toString() : '0'}
                    onChange={e => this.setState({ settings: { ...settings, frequency: e.target.value ? parseInt(e.target.value) : 0 } })}
                />
            </h2>
            <label>Report Frequency</label>
        </div> */}
				<div className="input-field" style={reviewInputStyle}>
					<h2 style={{ margin: '0' }}>
						<input id="email" type="email" className="validate" value={settings.from_email} onChange={e => fromEmail(e.target.value)} />
						<span className="helper-text" data-error="Invalid Email Format" data-success="" />
					</h2>
					<label>From Email</label>
				</div>
			</NoDiv>
		);
	}
}

export default ReviewSettings;
