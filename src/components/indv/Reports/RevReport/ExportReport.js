import React, { useState } from 'react';
import { Modal } from 'react-materialize';
import { LoadingWrapperSmall } from '../../../../utilities/index';

function ExportReport(props) {
	const [reportModal, setModal] = useState(false);
	const [exportType, setType] = useState(true);
	const [csv, setCSV] = useState(undefined);
	let perm = props.location.state.permissions;
	let { updateState, state, generateReport } = props;
	return (
		<Modal
			trigger={<button className="btn primary-color primary-hover">Export Report</button>}
			style={{ outline: 'none' }}
			open={reportModal}
			onClick={() => setModal(undefined)}
		>
			{exportType ? (
				<div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
					<h3>What Kind of Report Do You Want?</h3>
					<div style={{ display: 'flex', width: '30%', justifyContent: 'space-between', marginBottom: '2.5%' }}>
						<label style={{ display: 'flex', justifyContent: 'flex-start' }}>
							<input type="checkbox" checked={state.reportType === 'pdf'} onChange={() => updateState('reportType', 'pdf')} />
							<span className="tab">PDF</span>
						</label>
						<label style={{ display: 'flex', justifyContent: 'flex-start' }}>
							<input type="checkbox" checked={state.reportType === 'csv'} onChange={() => updateState('reportType', 'csv')} />
							<span className="tab">CSV</span>
						</label>
					</div>
					{state.reportType ? (
						<button
							className="btn primary-color primary-hover"
							onClick={() => {
								setType(false);
								setCSV(state.reportType === 'csv');
							}}
						>
							Select
						</button>
					) : null}
				</div>
			) : csv ? (
				<div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							minHeight: '25vh',
							justifyContent: 'space-between',
							width: '40%',
						}}
					>
						<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
							<input type="checkbox" checked={state.filter === 'everything'} onChange={() => updateState('filter', 'everything')} />
							<span className="tab">Export Everything</span>
						</label>
						<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
							<input type="checkbox" checked={state.filter === 'allfeed'} onChange={() => updateState('filter', 'allfeed')} />
							<span className="tab">Export All Feedback</span>
						</label>
						<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
							<input type="checkbox" checked={state.filter === 'promoter'} onChange={() => updateState('filter', 'promoter')} />
							<span className="tab">Export Promoters (4 - 5 Feedback)</span>
						</label>
						<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
							<input type="checkbox" checked={state.filter === 'passive'} onChange={() => updateState('filter', 'passive')} />
							<span className="tab">Export Passives (3 Feedback)</span>
						</label>
						<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
							<input type="checkbox" checked={state.filter === 'detractor'} onChange={() => updateState('filter', 'detractor')} />
							<span className="tab">Export Detractors (1 - 2 Feedback)</span>
						</label>
						<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
							<input type="checkbox" checked={state.filter === 'NoRating'} onChange={() => updateState('filter', 'NoRating')} />
							<span className="tab">Export Customers With No Rating</span>
						</label>
						<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
							<input type="checkbox" checked={state.filter === 'unsubscribe'} onChange={() => updateState('filter', 'unsubscribe')} />
							<span className="tab">Export Unsubscribed Customers</span>
						</label>
						<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
							<input type="checkbox" checked={state.filter === 'sent'} onChange={() => updateState('filter', 'sent')} />
							<span className="tab">Export Requests Sent</span>
						</label>
						<label style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
							<input type="checkbox" checked={state.filter === 'NotSent'} onChange={() => updateState('filter', 'NotSent')} />
							<span className="tab">Export Customers Not Sent</span>
						</label>
					</div>
					<button className="btn primary-color primary-hover" onClick={() => setCSV(false)} style={{ marginTop: '2.5%' }}>
						Next
					</button>
				</div>
			) : !state.emailReport ? (
				<div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
					<h3>Would you like to Download or Email this Report?</h3>
					<div style={{ width: '50%', display: 'flex', justifyContent: 'space-between', marginBottom: '2.5%' }}>
						<LoadingWrapperSmall loading={state.generatingReport}>
							<button className="btn primary-color primary-hover" onClick={() => generateReport()}>
								Download
							</button>
						</LoadingWrapperSmall>
						<button className="btn primary-color primary-hover" onClick={() => updateState('emailReport', true)}>
							Email
						</button>
					</div>
					<button className="btn primary-color primary-hover" onClick={() => setType(true)}>
						Back
					</button>
				</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
					<div className="input-field" style={{ width: '80%' }}>
						<h2 style={{ margin: '0' }}>
							<input value={state.emailTo} onChange={(e) => updateState('emailTo', e.target.value)} />
						</h2>
						<label>To Email</label>
					</div>
					<p style={{ margin: '0', padding: '0', marginLeft: '-72.5%', color: 'gray' }}>Email Text</p>
					<form className="col" style={{ width: '80%', margin: '0', fontSize: ' 1.5em', display: 'flex', justifyContent: 'center' }}>
						<div
							className="input-field feedbacktextarea"
							style={{
								// border: 'solid gray 1px',
								padding: '0 .5%',
								boxShadow: true ? '0 8px 12px rgba(0, 0, 0, 0.25)' : '',
								width: '100%',
							}}
						>
							<textarea
								disabled={perm !== 'admin'}
								rows="10"
								style={{ minHeight: '10vh', width: '100%' }}
								id="textarea1"
								className="materialize-textarea"
								placeholder="Please Leave Your Feedback Here"
								value={state.emailMessage}
								onChange={(e) => updateState('emailMessage', e.target.value)}
								type="text"
								data-length="2555"
							/>
						</div>
					</form>
					<div style={{ width: '60%', display: 'flex', justifyContent: 'space-around', marginTop: '2.5%' }}>
						<button className="btn primary-color primary-hover" onClick={() => updateState('emailReport', false)}>
							back
						</button>
						<LoadingWrapperSmall loading={this.state.generatingReport}>
							<button className="btn primary-color primary-hover" onClick={() => generateReport()}>
								Send
							</button>
						</LoadingWrapperSmall>
					</div>
				</div>
			)}
		</Modal>
	);
}

export default ExportReport;
