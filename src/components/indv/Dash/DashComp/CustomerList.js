import React from 'react';
import { MapTR, DefaultLink } from './../../../../utilities';
import Moment from 'moment';
function CustomerList(props) {
	let { info, i, AddToSelected } = props;
	let { client_id, cor_id } = props.match.params;
	let { selected } = props.state;
	let strike = { textDecoration: 'line-through' };
	return (
		<MapTR key={info.cus_id} index={i} style={{ backgroundColor: info.active ? '' : 'rgba(255, 2, 2, 0.25)' }}>
			<td style={{ textAlign: 'center' }}>
				<label>
					<input
						type="checkbox"
						checked={selected.some((a) => a.cus_id === info.cus_id)}
						onChange={() => {
							AddToSelected(info);
						}}
					/>
					<span style={!info.active ? strike : null}>{info.active ? '' : 'INACTIVE'}</span>
				</label>
			</td>
			<td
				style={(!info.active ? strike : null, { cursor: 'pointer' })}
				onClick={() => props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, props.location.state)}
			>
				<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: props.location.state }}>{info.cus_id}</DefaultLink>
			</td>
			<td
				style={(!info.active ? strike : null, { cursor: 'pointer' })}
				onClick={() => props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, props.location.state)}
			>
				<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: props.location.state }}>
					{info.first_name.toProper() + ' ' + info.last_name.toProper()}
				</DefaultLink>
			</td>
			<td
				style={(!info.active ? strike : null, { cursor: 'pointer' })}
				onClick={() => props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, props.location.state)}
			>
				<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: props.location.state }}>
					{info.rating ? info.rating : 'N/A'}
				</DefaultLink>
			</td>
			<td
				style={(!info.active ? strike : null, { cursor: 'pointer' })}
				onClick={() => props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, props.location.state)}
			>
				<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: props.location.state }}>
					{info.feedback_text ? info.feedback_text.slice(0, 30) : 'N/A'}
				</DefaultLink>
			</td>
			<td
				style={(!info.active ? strike : null, { cursor: 'pointer' })}
				onClick={() => props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, props.location.state)}
			>
				<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: props.location.state }}>
					{info.activity.active[info.activity.active.length - 1].type}
				</DefaultLink>
			</td>
			<td
				style={(!info.active ? strike : null, { cursor: 'pointer' })}
				onClick={() => props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, props.location.state)}
			>
				<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: props.location.state }}>
					{info.last_email ? info.last_email : 'NOT SENT'}
				</DefaultLink>
			</td>
			<td
				style={(!info.active ? strike : null, { cursor: 'pointer' })}
				onClick={() => props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, props.location.state)}
			>
				<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: props.location.state }}>{info.service}</DefaultLink>
			</td>
			<td
				style={(!info.active ? strike : null, { cursor: 'pointer' })}
				onClick={() => props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, props.location.state)}
			>
				<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: props.location.state }}>
					{info.activity.active[info.activity.active.length - 1].date < '2016-05-25'
						? 'NOT SENT'
						: Moment(info.activity.active[info.activity.active.length - 1].date).format('MMM Do, YY')}
				</DefaultLink>
			</td>
			<td
				style={(!info.active ? strike : null, { cursor: 'pointer' })}
				onClick={() => props.history.push(`/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, props.location.state)}
			>
				<DefaultLink to={{ pathname: `/indv-customer/${cor_id}/${info.cus_id}/${client_id}`, state: props.location.state }}>
					{info.last_sent < '2016-05-25' ? 'NOT SENT' : Moment(info.last_sent).format('MMM Do, YY')}
				</DefaultLink>
			</td>
		</MapTR>
	);
}

export default CustomerList;
