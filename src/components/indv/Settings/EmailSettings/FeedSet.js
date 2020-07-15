import React from 'react';
import { NoDiv } from '../../../../utilities/index';
import { Select } from 'react-materialize';

function FeedSet(props) {
	let { updateState, state, changeFormat } = props;
	let perm = props.location.state.permissions;

	return (
		<NoDiv direction="column" width="40%">
			<h3>Feedback Request Settings</h3>
			<hr style={{ marginLeft: '.25%', width: '80%' }} />
			<div style={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
				<label htmlFor="email" style={{ marginRight: '-3.5vw', marginTop: '-4vh' }}>
					From Email:{' '}
				</label>
				<div className="input-field" style={{ marginBottom: '-5%' }}>
					<i className="material-icons prefix" style={{ marginTop: '5%' }}>
						email
					</i>
					<input
						id="email"
						type="text"
						className="validate"
						value={state.from}
						onChange={(e) => updateState('from', e.target.value)}
						autoFocus
						disabled={perm !== 'admin'}
					/>
					<span className="helper-text" data-error="Invalid Email Format" data-success="" />
				</div>
			</div>
			{/* <hr style={{ marginLeft: '.25%', width: '80%' }} /> */}
			<h5>From Name</h5>
			<div style={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<label>
					<input
						type="checkbox"
						checked={state.fromName === 'businessName'}
						// onChange={async () => setState({ fromName: 'businessName' })}
						onChange={async () => updateState('fromName', 'businessName')}
						disabled={perm !== 'admin'}
					/>
					<span>Business Name</span>
				</label>
				<label>
					<input
						type="checkbox"
						checked={state.fromName === 'firstLast' || state.fromName !== 'businessName'}
						// onChange={async () => setState({ fromName: 'firstLast' })}
						onChange={async () => updateState('fromName', 'firstLast')}
						disabled={perm !== 'admin'}
					/>
					<span>First + Last Name</span>
				</label>
			</div>
			<hr style={{ marginLeft: '.25%', width: '80%' }} />
			<div style={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
				<label style={{ marginTop: '5%' }}>
					<input
						type="checkbox"
						checked={state.updateAllSettings}
						// onChange={async () => setState({ updateAllSettings: !state.updateAllSettings })}
						onChange={async () => updateState('updateAllSettings', !state.updateAllSettings)}
						disabled={perm !== 'admin'}
					/>
					<span>Change All Email Settings</span>
				</label>
			</div>
			<div style={{ width: '80%' }} className="input-field">
				<h5>Email Type</h5>
				{/* <Select value={type} onChange={(e) => setState({ type: e.target.value, activeFormat: format[e.target.value] })}> */}
				<Select
					value={state.type}
					onChange={(e) =>
						updateState([
							{ t: 'type', v: e.target.value },
							{ t: 'activeFormat', v: state.format[e.target.value] },
						])
					}
				>
					<option value="s">Standard First Send</option>
					<option value="fr">First Reminder</option>
					<option value="sr">Second Reminder</option>
					<option value="or">Opened Reminder</option>
					<option value="pr">Positive Feedback Reminder</option>
					<option value="spr">Second Positive Reminder</option>
				</Select>
			</div>
			<div style={{ height: '30%', width: '80%' }} className="input-field">
				<h5>Header</h5>
				<Select value={state.activeFormat.one} onChange={(e) => changeFormat(e.target.value, 'one')} disabled={perm !== 'admin'}>
					<option value="1">Logo Header</option>
					<option value="2">No Logo</option>
					{/* <option value="3">3</option> */}
				</Select>
			</div>
			<div style={{ height: '30%', width: '80%' }} className="input-field">
				<h5>Feedback</h5>
				<Select value={state.activeFormat.two} onChange={(e) => changeFormat(e.target.value, 'two')} disabled={perm !== 'admin'}>
					<option value="1" disabled={state.type === 'pr'}>
						1 - 5 Feedback
					</option>
					<option value="2">Direct Feedback</option>
					{/* <option value="3">3</option> */}
				</Select>
			</div>
			<div style={{ height: '30%', width: '80%' }} className="input-field">
				<h5>Signature</h5>
				<Select value={state.activeFormat.three} onChange={(e) => changeFormat(e.target.value, 'three')} disabled={perm !== 'admin'}>
					<option value="1">Company Info</option>
					<option value="2">Company Info + Logo</option>
					<option value="3">Custom Signature</option>
					{/* <option value="3">3</option> */}
				</Select>
			</div>
			{/* <h4>Email Process</h4>
    <hr />
    <label style={{ width: '30%' }}>
        <input type="checkbox" checked={Process === 'Spray'} onChange={() => setState({ Process: 'Spray' })} />
        <span className="tab">Spray and Pray</span>
    </label>
    <p>Same email will be sent to all clients</p>
    <hr />
    <label style={{ width: '30%' }}>
        <input type="checkbox" checked={Process === 'Tree'} disabled onChange={() => setState({ Process: 'Tree' })} />
        <span className="tab">Binary Tree</span>
    </label>
    <p style={{ width: '60%' }}>Different process path for each email depending on information correlated with that email</p> */}
		</NoDiv>
	);
}

export default FeedSet;
