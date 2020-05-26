import React from 'react';

function Header(props) {
	let { state, AddAllSelected, orderCust } = props;
	return (
		<thead className="theader">
			<tr style={{ paddingLeft: '5%' }}>
				<th style={{ borderRadius: '0', width: '5%', marginLeft: '5%', textAlign: 'center' }}>
					{props.location.state.permissions !== 'admin' ? (
						''
					) : (
						<label data-tip data-for="all_select">
							<input type="checkbox" checked={state.sel} onChange={() => AddAllSelected()} />
							<span style={{ color: 'white' }}></span>
						</label>
					)}
				</th>
				<th
					style={{ borderRadius: '0', width: '7.5%' }}
					onClick={() => {
						orderCust(1, 'one');
					}}
				>
					Customer ID
				</th>
				<th
					style={{ borderRadius: '0', width: '25%' }}
					onClick={() => {
						orderCust(2, 'two');
					}}
				>
					Name
				</th>
				<th
					style={{ borderRadius: '0', width: '5%' }}
					onClick={() => {
						orderCust(3, 'three');
					}}
				>
					Rating
				</th>
				<th
					style={{ borderRadius: '0', width: '15%' }}
					onClick={() => {
						orderCust(4, 'four');
					}}
				>
					Feedback
				</th>
				<th
					style={{ borderRadius: '0', width: '15%' }}
					onClick={() => {
						orderCust(5, 'five');
					}}
				>
					Activity
				</th>
				<th
					style={{ borderRadius: '0', width: '5%' }}
					onClick={() => {
						orderCust(6, 'six');
					}}
				>
					Source
				</th>
				<th
					style={{ borderRadius: '0', width: '5%' }}
					onClick={() => {
						orderCust(7, 'seven');
					}}
				>
					Service
				</th>
				<th
					style={{ borderRadius: '0', width: '10%' }}
					onClick={() => {
						orderCust(8, 'eight');
					}}
				>
					Last Activity
				</th>
				<th
					style={{ borderRadius: '0', width: '10%' }}
					onClick={() => {
						orderCust(9, 'nine');
					}}
				>
					Last Sent
				</th>
			</tr>
		</thead>
	);
}

export default Header;
