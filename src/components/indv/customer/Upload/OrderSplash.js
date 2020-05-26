import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Select } from 'react-materialize';
import { LoadingWrapperSmall } from '../../../../utilities/index';

function OrderSplash(props) {
	let { data, state, changeOrder, formatOrder, updateState } = props;
	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'space-around' }}>
			{/* DEMO AREA */}
			<h3>{state.file.name}</h3>
			<h6>List Size: {state.length}</h6>
			{data[0].first ? (
				<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
					<div
						style={{
							width: '40%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							padding: '.5%',
						}}
					>
						<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
							Column 1
						</h5>
						{data.slice(0, 5).map((e, i) => {
							return (
								<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
									{e.first}
								</h6>
							);
						})}
					</div>
					<div style={{ width: '25%' }}>
						<h5>Column 1</h5>
						<Select value={state.order[0]} onChange={(e) => changeOrder(0, e.target.value)}>
							<option disabled value="Column 1">
								Column 1
							</option>
							<option value="first_name">First Name</option>
							<option value="last_name">Last Name</option>
							<option value="email">Email</option>
							<option value="phone">Phone</option>
							<option value="ignore">Ignore</option>
						</Select>
					</div>
				</div>
			) : null}
			{data[0].second ? (
				<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
					<div
						style={{
							width: '40%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							padding: '.5%',
						}}
					>
						<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
							Column 2
						</h5>
						{data.slice(0, 5).map((e, i) => {
							return (
								<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
									{e.second}
								</h6>
							);
						})}
					</div>
					<div style={{ width: '25%' }}>
						<h5>Column 2</h5>
						<Select value={state.order[1]} onChange={(e) => changeOrder(1, e.target.value)}>
							<option disabled value="Column 2">
								Column 2
							</option>
							<option value="first_name">First Name</option>
							<option value="last_name">Last Name</option>
							<option value="email">Email</option>
							<option value="phone">Phone</option>
							<option value="ignore">Ignore</option>
						</Select>
					</div>
				</div>
			) : null}
			{data[0].third ? (
				<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
					<div
						style={{
							width: '40%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							padding: '.5%',
						}}
					>
						<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
							Column 3
						</h5>
						{data.slice(0, 5).map((e, i) => {
							return (
								<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
									{e.third}
								</h6>
							);
						})}
					</div>
					<div style={{ width: '25%' }}>
						<h5>Column 3</h5>
						<Select value={state.order[2]} onChange={(e) => changeOrder(2, e.target.value)}>
							<option disabled value="Column 3">
								Column 3
							</option>
							<option value="first_name">First Name</option>
							<option value="last_name">Last Name</option>
							<option value="email">Email</option>
							<option value="phone">Phone</option>
							<option value="ignore">Ignore</option>
						</Select>
					</div>
				</div>
			) : null}
			{data[0].fourth ? (
				<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
					<div
						style={{
							width: '40%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							padding: '.5%',
						}}
					>
						<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
							Column 4
						</h5>
						{data.slice(0, 5).map((e, i) => {
							return (
								<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
									{e.fourth}
								</h6>
							);
						})}
					</div>
					<div style={{ width: '25%' }}>
						<h5>Column 4</h5>
						<Select value={state.order[3]} onChange={(e) => changeOrder(3, e.target.value)}>
							<option disabled value="Column 4">
								Column 4
							</option>
							<option value="first_name">First Name</option>
							<option value="last_name">Last Name</option>
							<option value="email">Email</option>
							<option value="phone">Phone</option>
							<option value="ignore">Ignore</option>
						</Select>
					</div>
				</div>
			) : null}
			{data[0].fith ? (
				<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
					<div
						style={{
							width: '40%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							padding: '.5%',
						}}
					>
						<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
							Column 5
						</h5>
						{data.slice(0, 5).map((e, i) => {
							return (
								<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
									{e.fith}
								</h6>
							);
						})}
					</div>
					<div style={{ width: '25%' }}>
						<h5>Column 5</h5>
						<Select value={state.order[5]} onChange={(e) => changeOrder(4, e.target.value)}>
							<option disabled value="Column 4">
								Column 4
							</option>
							<option value="first_name">First Name</option>
							<option value="last_name">Last Name</option>
							<option value="email">Email</option>
							<option value="phone">Phone</option>
							<option value="ignore">Ignore</option>
						</Select>
					</div>
				</div>
			) : null}
			{data[0].sixth ? (
				<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
					<div
						style={{
							width: '40%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							padding: '.5%',
						}}
					>
						<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
							Column 6
						</h5>
						{data.slice(0, 5).map((e, i) => {
							return (
								<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
									{e.sixth}
								</h6>
							);
						})}
					</div>
					<div style={{ width: '25%' }}>
						<h5>Column 6</h5>
						<Select value={state.order[5]} onChange={(e) => changeOrder(5, e.target.value)}>
							<option disabled value="Column 6">
								Column 6
							</option>
							<option value="first_name">First Name</option>
							<option value="last_name">Last Name</option>
							<option value="email">Email</option>
							<option value="phone">Phone</option>
							<option value="ignore">Ignore</option>
						</Select>
					</div>
				</div>
			) : null}
			{data[0].seventh ? (
				<div style={{ display: 'flex', justifyContent: 'space-around', margin: '2.5% 0' }}>
					<div
						style={{
							width: '40%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
							padding: '.5%',
						}}
					>
						<h5 style={{ backgroundColor: 'rgba(108, 106, 107, 0.75)', width: '100%' }} className="left-align">
							Column 7
						</h5>
						{data.slice(0, 5).map((e, i) => {
							return (
								<h6 key={i} style={{ margin: '.5% 0', borderBottom: 'solid black .5px', width: '100%' }} className="left-align">
									{e.seventh}
								</h6>
							);
						})}
					</div>
					<div style={{ width: '25%' }}>
						<h5>Column 7</h5>
						<Select value={state.order[6]} onChange={(e) => changeOrder(6, e.target.value)}>
							<option disabled value="Column 7">
								Column 7
							</option>
							<option value="first_name">First Name</option>
							<option value="last_name">Last Name</option>
							<option value="email">Email</option>
							<option value="phone">Phone</option>
							<option value="ignore">Ignore</option>
						</Select>
					</div>
				</div>
			) : null}
			<div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }}>
				{state.corp.length >= 2 ? (
					<div className="input-field" style={{ width: '30%' }}>
						{/* <Select value={state.uploadTo.toString()} onChange={(e) => setState({ uploadTo: e.target.value.toString() })}> */}
						<Select value={state.uploadTo.toString()} onChange={(e) => updateState('uploadTo', e.target.value.toString())}>
							{state.corp.map((e, i) => (
								<option value={e.c_id.toString()} key={i}>
									{`${e.c_id.toString()} - ${e.company_name.length >= 25 ? e.company_name.substring(0, 25) + '...' : e.company_name} - ${e?.address?.city}`}
								</option>
							))}
							<option value={'all'}>{`Split Between All`}</option>
						</Select>
						<label>Upload Client To</label>
					</div>
				) : (
					<div>Uploading to {state.og.company_name}</div>
				)}
				<div className="input-field" style={{ width: '30%' }}>
					{/* <Select value={state.service} onChange={(e) => setState({ service: e.target.value })}> */}
					<Select value={state.service} onChange={(e) => updateState('service', e.target.value)}>
						<option value="reviews">Reviews</option>
					</Select>
					<label>Service For List</label>
				</div>
				<label style={{ width: '30%', display: 'flex', justifyContent: 'flex-start', marginBottom: '2.5%', marginTop: '2.5%' }} data-tip data-for="reset">
					{/* <input type="checkbox" checked={state.reset} onChange={() => setState({ reset: !state.reset })} /> */}
					<input type="checkbox" checked={state.reset} onChange={() => updateState('reset', !state.reset)} />
					<span className="tab">Reset/Scrub List</span>
				</label>
				<ReactTooltip id="reset" type="dark" effect="float" place="bottom">
					<span>Warning: This will reset the list</span>
				</ReactTooltip>
			</div>
			<LoadingWrapperSmall loading={state.ordering} style={{ marginBottom: '5%' }}>
				<button className="btn  primary-color primary-hover" onClick={() => formatOrder()}>
					Upload List
				</button>
			</LoadingWrapperSmall>
		</div>
	);
}

export default OrderSplash;
