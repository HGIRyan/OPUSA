import React from 'react';
import { Modal, Select } from 'react-materialize';
import { DefaultLink } from './../../../../utilities/index';

function ManualRequest(props) {
	let { state, SendRequest, updateState } = props;
	return (
		<Modal
			className="scrollNone"
			trigger={
				<button
					node="button"
					className={`btn ${state.selected[0] ? 'primary-color primary-hover' : 'secondary-color secondary-hover'}`}
					disabled={!state.selected[0] ? 'disabled' : ''}
				>
					{window.innerWidth >= 1500 ? 'Send Request' : 'Send'}
				</button>
			}
			style={{ outline: 'none', paddingBottom: '8vh' }}
		>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<h6>Send Feedback Request</h6>
				<p>
					To view or edit email templates, visit the{' '}
					<DefaultLink
						style={{ color: 'blue', textDecoration: 'underline' }}
						to={{
							pathname: `/client-dash/${props.match.params.cor_id}/emails/reviews/${props.match.params.client_id}`,
							state: props.location.state,
						}}
					>
						Email Editor Page
					</DefaultLink>
				</p>
				<p>Sending Emails To:</p>
				{state.selected.map((e) => (
					<div style={{ margin: '0', padding: '1%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '60%' }} key={e.cus_id}>
						<p style={{ margin: '0', padding: '0' }}>• {`${e.first_name} ${e.last_name}  ( ${e.email} ) `}</p>
						<p style={{ margin: '0', padding: '0' }}>{`Last Sent ${e.last_sent === '2005-05-25' ? '----' : e.last_sent}`}</p>
					</div>
				))}
				<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0 0 1% 0' }}>
					<Select
						style={{ border: 'solid black', width: '50vw !important' }}
						value={state.type.email}
						// onChange={(e) => setState({ type: { subject: `${e.target.value}_subject`, email: e.target.value } })}
						onChange={(e) => updateState('type', { subject: `${e.target.value}_subject`, email: e.target.value })}
						options={{
							dropdownOptions: {},
						}}
					>
						<option value="s">Standard First Send</option>
						<option value="fr">First Reminder</option>
						<option value="sr">Second Reminder</option>
						<option value="or">Opened Reminder</option>
						<option value="pr">Positive Feedback Reminder</option>
						<option value="spr">Second Positive Reminder</option>
					</Select>
				</div>
				<button
					className={`btn ${state.selected[0] ? 'primary-color primary-hover' : 'secondary-color secondary-hover'}`}
					onClick={state.selected[0] ? () => SendRequest() : null}
				>
					Send Request
				</button>
			</div>
		</Modal>
	);
}

export default ManualRequest;
