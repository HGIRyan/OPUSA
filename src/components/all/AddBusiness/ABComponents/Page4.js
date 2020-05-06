import React, { Component } from 'react';
import { LoadingWrapperSmall } from '../../../../utilities/index';
class Page4 extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let { keyval, rankKey, updateInput, addKey, submit } = this.props;
		return (
			<div style={{ display: 'flex', flexDirection: 'column', width: '90%', justifyContent: 'flex-start' }}>
				<h5>Add KeyWords</h5>
				<hr />
				<div className="input-field" style={{ width: '70%' }}>
					<h2 style={{ margin: '2.5% 0' }}>
						<input
							id="keyword"
							type="text"
							className="validate"
							value={keyval}
							onChange={(e) => updateInput('keyval', e.target.value)}
							onKeyPress={(e) => (e.key === 'Enter' ? addKey() : null)}
						/>
					</h2>
					<label htmlFor="keyword">New Keyword: </label>
					<button className="btn primary-color primary-hover" onClick={() => addKey()}>
						Add
					</button>
				</div>
				{rankKey.map((key, i) => {
					return (
						<div
							style={{ display: 'flex', width: '20%', justifyContent: 'flex-start', padding: '0 .5%', alignItems: 'center', cursor: 'pointer' }}
							key={i}
							className="card hoverable"
							onClick={() => {
								rankKey.splice(i, 1);
								updateInput('rankKey', rankKey);
							}}
						>
							<h6 style={{ marginRight: '5%' }}>{i + 1}.</h6>
							<h6>{key}</h6>
						</div>
					);
				})}
				<hr />
				{process.env.REACT_APP_SF_SECURITY_TOKEN ? (
					<div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0%' }}>
						<div className="input-field" style={{ width: '60%' }}>
							<h2 style={{ margin: '2.5% 0' }}>
								<input value={this.state.sf_key} onChange={(e) => updateInput('sf_key', e.target.value)} />
							</h2>
							<label>SF API</label>
						</div>
						{/* <button className="btn primary-color primary-hover" onClick={() => this.syncWSF()}>
				Sync W/ SF
			</button>
			{this.state.sfSync ? <p>SYNCED</p> : null} */}
					</div>
				) : null}
				<LoadingWrapperSmall loading={this.state.submitting}>
					<button
						className="btn primary-color primary-hover"
						onClick={() => submit()}
						style={{ width: '100%', marginLeft: '10%' }}
						disabled={!this.state.sf_key && process.env.REACT_APP_SF_SECURITY_TOKEN}
					>
						Submit
					</button>
				</LoadingWrapperSmall>
			</div>
		);
	}
}

export default Page4;
