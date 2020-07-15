import React, { useState } from 'react';
import { NoDiv, LoadingWrapperSmall } from '../../../../utilities/index';
import { Select } from 'react-materialize';
import axios from 'axios';

function AddUser(props) {
	let { client_id, cor_id } = props.match.params;
	const [save, setSave] = useState(false);
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [permission, setPermissions] = useState('');
	let updateLogin = async () => {
		setSave(true);
		if (email) {
			await axios.post('/api/add-new-user/dev', { state: { email, userName: username, cor_id, permissionLevel: permission } }).then((res) => {
				if (res.data.msg === 'GOOD') {
					window.location.reload();
					setSave(false);
				} else {
					alert(`Error: ${res.data.msg}`);
				}
			});
		} else {
			alert('Need to input email and username');
		}
	};
	return (
		<>
			<NoDiv just="flex-start" width="50%" align="center">
				<h3 style={{ right: '30%', position: 'relative' }} className="noselect">
					Business Details / Add User
				</h3>
				<NoDiv width="40%">
					<button
						className="btn primary-color primary-hover"
						onClick={() => props.history.replace(`/client-dash/${cor_id}/business-details/${client_id}/details`, props.location.state)}
						style={{ marginRight: '5%' }}
					>
						Back
					</button>
					<LoadingWrapperSmall loading={save}>
						<button className="btn primary-color primary-hover" onClick={() => updateLogin()}>
							Create User
						</button>
					</LoadingWrapperSmall>
				</NoDiv>
			</NoDiv>
			<hr />
			<div
				style={{
					width: '80%',
					minHeight: '60vh',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around',
					alignItems: 'center',
				}}
				className="card"
			>
				<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0' }}>
					<h2 style={{ margin: '0' }}>
						<input
							id="email"
							type="email"
							className="validate"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setUsername(e.target.value.split('@')[0]);
							}}
						/>
					</h2>
					<label htmlFor="email">Email: </label>
					<span className="helper-text" data-error="Invalid Email Format" data-success="" />
				</div>
				<div className="input-field" style={{ width: '20vw', padding: '0', margin: '0' }}>
					<h2 style={{ margin: '0' }}>
						<input id="email" type="email" className="validate" value={username} onChange={(e) => setUsername(e.target.value)} />
					</h2>
					<label htmlFor="email">User Name: </label>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '50%' }}>
					<h5>Permission Level: </h5>
					<Select value={permission} onChange={(e) => setPermissions(e.target.value)}>
						<option value="admin">Admin</option>
						<option value="sales">Sales</option>
						<option value="client">Client</option>
					</Select>
				</div>
			</div>
		</>
	);
}

export default AddUser;
