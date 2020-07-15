import React, { useState } from 'react';
import Moment from 'moment';
import { BoxSplit } from './../../../../utilities/index';

function FeedList(props) {
	const [showAll, changeShow] = useState(false);
	let { type, promoters, passives, demoters, responses } = props;

	let promPerc = Math.floor((promoters.length / responses) * 100);
	let demPerc = Math.floor((demoters.length / responses) * 100);
	let passPerc = Math.floor((passives.length / responses) * 100);
	if (promPerc + demPerc + passPerc !== 100) {
		let num = Math.abs(promPerc + demPerc + passPerc - 100);
		if (promPerc + demPerc + passPerc > 100) {
			promPerc = promPerc - num;
		} else {
			promPerc = promPerc + num;
		}
	}
	let style = (cust) => {
		if (typeof cust[0] !== 'undefined') {
			if (!showAll) {
				cust = cust.slice(0, 10);
			}
			let type = cust[0].rating >= 4 ? 'promoter' : cust[0].rating <= 2 ? 'demoter' : 'passive';
			let { client_id, cor_id } = props.match.params;
			return cust.map((e, i) => {
				let name = `${e.first_name} ${e.last_name}`;
				return (
					<div
						className="card "
						style={{
							width: '80%',
							height: '5vh',
							marginBottom: '1vh',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '0 2.5%',
							cursor: 'pointer',
						}}
						onClick={() => props.history.push(`/indv-customer/${cor_id}/${e.cus_id}/${client_id}`, props.location.state)}
						key={i}
					>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<div
								style={{
									height: '2.5vh',
									width: '3vh',
									border: 'solid black 1px',
									borderRadius: '3vh 3vh',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: type === 'promoter' ? 'rgba(52, 168, 83, 1)' : type === 'demoter' ? 'rgba(234, 67, 53, 1)' : '#fbbc05',
								}}
							>
								{e.rating}
							</div>
							<h6 style={{ margin: '0', padding: '0', marginLeft: '2.5%' }}>{name.slice(0, 25)}</h6>
							{e.feedback_text !== 'N/A' &&
							e.feedback_text !== '' &&
							typeof e.feedback_text !== 'undefined' &&
							e.feedback_text !== 'NA' &&
							e.feedback_text !== null ? (
								<p style={{ marginLeft: '2.5%' }}>
									<i className="material-icons md-18">feedback</i>
								</p>
							) : null}
						</div>
						<h6 className="right-align">{Moment(e.activity.active[e.activity.active.length - 1].date).format('MMM Do, YY')}</h6>
					</div>
				);
			});
		}
	};
	let perc = type === 'Detractors' ? demPerc : type === 'Passives' ? passPerc : type === 'Promoters' ? promPerc : 0;
	let custs = type === 'Detractors' ? demoters : type === 'Passives' ? passives : type === 'Promoters' ? promoters : [undefined];
	return (
		<BoxSplit width="30%" height="auto">
			<h5 style={{ margin: '0', padding: '0' }}>{type}</h5>
			<p style={{ margin: '0', padding: '0', fontSize: '.8em' }}>{perc}% of Feedback</p>
			<hr />
			{style(custs)}
			{custs.length >= 10 ? (
				<p onClick={() => changeShow(!showAll)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
					Show {!showAll ? 'ALL' : 'LESS'} Responses
				</p>
			) : null}
		</BoxSplit>
	);
}

export default FeedList;
