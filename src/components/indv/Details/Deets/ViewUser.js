import React, { useState, useEffect } from 'react';
import { NoDiv, LoadingWrapperSmall } from '../../../../utilities/index';
import { Select } from 'react-materialize';
import axios from 'axios';

function ViewUser(props) {
	const [users, setUsers] = useState([]);
	const [update, setUpdate] = useState(0);
	const [remove, setRemove] = useState(0);
	let {} = props;
	let { cor_id, client_id } = props?.match?.params ?? {};
	useEffect(() => {
		getUsers();
	}, []);
	let getUsers = async () => {
		await axios.get(`/api/get/business_users/${cor_id}`).then((res) => {
			if (res.data.msg === 'GOOD') {
				setUsers(res.data.users);
			} else {
				alert(`Error: ${res.data.msg}`);
			}
		});
	};
	let handleUserUpdate = async (user) => {
		let { password: omit, ...e } = user;
		setUpdate(e.user_id);
		let send = async (el) => {
			await axios.post('/api/update/user', { data: el }).then((res) => {
				if (res.data.msg === 'GOOD') {
					alert('User Was Updated');
					setUpdate(0);
				} else {
					alert(`ERROR: ${res.data.msg}`);
				}
			});
		};
		send(e);
	};
	let removeUser = async (user) => {
		let result = window.confirm(`Are you sure you want to remove this user \n\nUsername: ${user.username}\n\nEmail: ${user.email}`);
		if (result) {
			let { password: omit, ...e } = user;
			setRemove(e.user_id);
			await axios.post('/api/remove/user', { data: e }).then((res) => {
				if (res.data.msg === 'good') {
					alert('User Was Removed');
					setRemove(0);
					window.location.reload();
				} else {
					alert(`ERROR: ${res.data.msg}`);
				}
			});
		}
	};
	let handleUserChange = (e, type, val) => {
		let usersInfo = [...users];
		let newObj = usersInfo.filter((el) => el.user_id === e.user_id)[0];
		if (type === 'sub') {
			newObj.sub_perm.view_all = val === 'true' ? true : false;
		} else {
			newObj[type] = val;
		}
		usersInfo.splice(
			usersInfo.findIndex((el) => el.user_id === e.user_id),
			1,
			newObj,
		);
		// this.setState({ usersInfo });
		setUsers(usersInfo);
	};
	return (
		<>
			<NoDiv just="flex-start" width="50%" align="center">
				<h3 style={{ right: '30%', position: 'relative' }} className="noselect">
					Business Details / View Users
				</h3>
				<NoDiv width="40%">
					<button
						className="btn primary-color primary-hover"
						onClick={() => props.history.replace(`/client-dash/${cor_id}/business-details/${client_id}/details`, props.location.state)}
						style={{ marginRight: '5%' }}
					>
						Back
					</button>
				</NoDiv>
			</NoDiv>
			<hr />
			<div
				style={{
					width: '80%',
					minHeight: '40vh',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around',
					alignItems: 'center',
					padding: '2.5% 0',
				}}
				className="card"
			>
				{users[0]
					? users.filter((e) => e.email !== `no-reply@${process.env.REACT_APP_COMPANY_EXTENSION}.com`)[0]
						? users
								.filter((e) => e.email !== `no-reply@${process.env.REACT_APP_COMPANY_EXTENSION}.com`)
								.map((e) => {
									return (
										<div
											key={e.user_id}
											style={{
												width: '100%',
												height: '7.5vh',
												margin: '0',
												padding: '0',
												paddingBottom: '2.5%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-around',
												// borderBottom: 'solid gray 1px',
											}}
										>
											<div className="input-field" style={{ width: '10%' }}>
												<h2 style={{ margin: '0' }}>
													<input
														id="c_id"
														type="text"
														className="validate"
														defaultValue={e.c_id}
														onChange={(el) => handleUserChange(e, 'c_id', el.target.value)}
													/>
												</h2>
												<label htmlFor="c_id">Location ID: </label>
											</div>
											<div className="input-field" style={{ width: '20%' }}>
												<h2 style={{ margin: '0' }}>
													<input
														id="email"
														type="text"
														className="validate"
														defaultValue={e.email}
														onChange={(el) => handleUserChange(e, 'email', el.target.value)}
													/>
												</h2>
												<label htmlFor="email">Email: </label>
											</div>
											<div className="input-field" style={{ width: '20%' }}>
												<h2 style={{ margin: '0' }}>
													<input
														id="username"
														type="text"
														className="validate"
														defaultValue={e.username}
														onChange={(el) => handleUserChange(e, 'username', el.target.value)}
													/>
												</h2>
												<label htmlFor="username">Username: </label>
											</div>
											{/* <div className="input-field" style={{ width: '20%' }}>
												<h2 style={{ margin: '0' }}>
													<input
														id="password"
														type="text"
														className="validate"
														defaultValue={e.password}
														onChange={(el) => handleUserChange(e, 'password', el.target.value)}
													/>
												</h2>
												<label htmlFor="password">Password: </label>
											</div> */}
											<div className="input-field" style={{ width: '10%', marginTop: '2%' }}>
												<label style={{ margin: '0' }}>View</label>
												<Select
													name="View"
													onChange={(el) => handleUserChange(e, 'sub', el.target.value)}
													defaultValue={e.sub_perm.view_all.toString().toLowerCase()}
												>
													<option value="true">All Locations</option>
													<option value="false">One Location</option>
												</Select>
											</div>
											<LoadingWrapperSmall loading={update === e.user_id}>
												<button className="btn primary-color primary-hover" onClick={() => handleUserUpdate(e)}>
													Update
												</button>
											</LoadingWrapperSmall>
											<LoadingWrapperSmall loading={remove === e.user_id}>
												<button className="btn primary-color primary-hover" onClick={() => removeUser(e)}>
													X
												</button>
											</LoadingWrapperSmall>
										</div>
									);
								})
						: 'No Users'
					: 'Loading Users ... '}
			</div>
		</>
	);
}

export default ViewUser;
