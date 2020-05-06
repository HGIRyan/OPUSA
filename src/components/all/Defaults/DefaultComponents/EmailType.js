import React, { Component } from 'react';
import { Select } from 'react-materialize';
class EmailType extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let { type_, format, activeFormat, changeFormat, changeTheEmail } = this.props;
		return (
			<div style={{ minHeight: '50vh', width: '90%', marginLeft: '5%', padding: '2.5%' }} className="card hoverable">
				<div style={{ height: '25%' }}>
					<h5>Email Type</h5>
					<Select value={type_} onChange={e => changeTheEmail(type_, format, e.target.value)}>
						<option value="s">Standard First Send</option>
						<option value="fr">First Reminder</option>
						<option value="sr">Second Reminder</option>
						<option value="or">Opened Reminder</option>
						<option value="pr">Positive Feedback Reminder</option>
						<option value="spr">Second Positive Reminder</option>
					</Select>
				</div>
				<div style={{ height: '25%' }}>
					<h5>Header</h5>
					<Select value={activeFormat.one} onChange={e => changeFormat(e.target.value, 'one')}>
						<option value="1">Logo Header</option>
						<option value="2">No Logo</option>
						{/* <option value="3">3</option> */}
					</Select>
				</div>
				<div style={{ height: '25%' }}>
					<h5>Feedback</h5>
					<Select value={activeFormat.two} onChange={e => changeFormat(e.target.value, 'two')}>
						<option value="1" disabled={type_ === 'pr'}>
							1 - 5 Feedback
						</option>
						<option value="2">Direct Feedback</option>
						{/* <option value="3">3</option> */}
					</Select>
				</div>
				<div style={{ height: '25%' }}>
					<h5>Signature</h5>
					<Select value={activeFormat.three} onChange={e => changeFormat(e.target.value, 'three')}>
						<option value="1">Company Info</option>
						<option value="2">Company Info + Logo</option>
						{/* <option value="3">3</option> */}
					</Select>
				</div>
			</div>
		);
	}
}

export default EmailType;
