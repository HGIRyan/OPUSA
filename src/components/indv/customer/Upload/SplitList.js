import React, { useState } from 'react';
import { LoadingWrapperSmall } from '../../../../utilities/index';
import axios from 'axios';

function SplitList(props) {
	const [splitLoading, setSplit] = useState(0);
	let { data } = props;
	let { cor_id } = props.match.params;
	let { info } = props.location.state;
	let permission = props.location.state.permissions;
	let length = info.filter((e) => e.cor_id === parseInt(cor_id)).length;
	let loc = info.filter((e) => e.cor_id === parseInt(cor_id));
	let splitList = async () => {
		let result = window.confirm('This Process Will Take 20 Seconds to a Minute, \n Are You Sure You Want To Continue');
		if (result) {
			setSplit(true);
			await axios.post(`/api/update/splitlist`, { cor_id, loc }).then(async (res) => {
				if (res.data.msg === 'GOOD') {
					await axios.get(`/api/indv/customers/${cor_id}`).then(async (res) => {
						res = res.data;
						if (res.msg === 'GOOD') {
							if (res.info[0]) {
								this.props.location.state.focus_cust = res.info;
								this.props.history.replace(this.props.location.pathname, this.props.location.state);
							}
						} else {
							if (res.msg === 'NO SESSION') {
								res.msg = 'You Have Been Disconnected From The Server';
							}
							alert(res.msg + ' Click "OK" To Be Redirected To Login');
							await axios.get('/api/ll/logout').then((res) => {
								if (res.data.msg === 'GOOD') {
									this.props.history.replace('/', {});
									window.location.reload();
								}
							});
						}
					});
				} else {
					alert(res.data.msg);
				}
			});
		}
	};
	if (loc[1]) {
		return (
			<div>
				{!data[0] && length > 1 && permission === 'admin' ? (
					<div style={{ width: '60vw', display: 'flex', justifyContent: 'flex-end' }}>
						<LoadingWrapperSmall loading={splitLoading}>
							<button className="btn primary-color primary-hover" onClick={() => splitList()}>
								Split List
							</button>
						</LoadingWrapperSmall>
					</div>
				) : null}
			</div>
		);
	} else {
		return <div></div>;
	}
}

export default SplitList;
