import Moment from 'moment';
let orderCusts = async ({ num, order, orderBool, info }) => {
	switch (true) {
		case num === 1:
			return orderBool[order] ? await info.sort((a, b) => (a.id < b.id ? 1 : -1)) : await info.sort((a, b) => (a.id > b.id ? 1 : -1));
		case num === 2:
			return orderBool[order]
				? await info.sort((a, b) => (a.first_name < b.first_name ? 1 : -1))
				: await info.sort((a, b) => (a.first_name > b.first_name ? 1 : -1));
		case num === 3:
			return orderBool[order] ? await info.sort((a, b) => (a.rating > b.rating ? 1 : -1)) : await info.sort((a, b) => (a.rating < b.rating ? 1 : -1));
		case num === 4:
			return orderBool[order]
				? await info.sort((a, b) => (a.feedback_text > b.feedback_text ? 1 : -1))
				: await info.sort((a, b) => (a.feedback_text < b.feedback_text ? 1 : -1));
		case num === 5:
			return orderBool[order]
				? await info.sort((a, b) =>
						Moment(a.activity.active[a.activity.active.length - 1].date).format('x') < Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
							? 1
							: -1,
				  )
				: await info.sort((a, b) =>
						Moment(a.activity.active[a.activity.active.length - 1].date).format('x') > Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
							? 1
							: -1,
				  );
		case num === 6:
			return orderBool[order]
				? await info.sort((a, b) => (a.last_email > b.last_email ? 1 : -1))
				: await info.sort((a, b) => (a.last_email < b.last_email ? 1 : -1));
		case num === 7:
			return orderBool[order] ? await info.sort((a, b) => (a.id > b.id ? 1 : -1)) : await info.sort((a, b) => (a.id > b.id ? 1 : -1));
		case num === 8:
			return orderBool[order]
				? await info.sort((a, b) =>
						Moment(a.activity.active[a.activity.active.length - 1].date).format('x') < Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
							? 1
							: -1,
				  )
				: await info.sort((a, b) =>
						Moment(a.activity.active[a.activity.active.length - 1].date).format('x') > Moment(b.activity.active[b.activity.active.length - 1].date).format('x')
							? 1
							: -1,
				  );
		case num === 9:
			return orderBool[order]
				? await info.sort((a, b) => (Moment(a.last_sent).format('x') < Moment(b.last_sent).format('x') ? 1 : -1))
				: await info.sort((a, b) => (Moment(a.last_sent).format('x') > Moment(b.last_sent).format('x') ? 1 : -1));
		default:
			break;
	}
};

let addFilter = async ({ og, filters, startDate, endDate, bus }) => {
	let all = [];
	filters.forEach((el) => {
		if (el === 'dem') {
			all.push(og.filter((e) => e.rating === 1 || e.rating === 2));
		} else if (el === 'pass') {
			all.push(og.filter((e) => e.rating === 3));
		} else if (el === 'prom') {
			all.push(og.filter((e) => e.rating === 4 || e.rating === 5));
		} else if (el === 'feed') {
			all.push(og.filter((e) => e.feedback_text !== 'N/A' && e.f_id));
		} else if (el === 'open') {
			all.push(og.filter((e) => e.f_id && e.opened_time));
		} else if (el === 'sent') {
			all.push(
				og
					.filter((e) => e.f_id && Array.isArray(e.activity.active))
					.filter((e) => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('first')),
			);
		} else if (el === 'sr') {
			all.push(
				og
					.filter((e) => e.f_id && Array.isArray(e.activity.active))
					.filter((e) => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('second')),
			);
		} else if (el === 'or') {
			all.push(
				og
					.filter((e) => e.f_id && Array.isArray(e.activity.active))
					.filter((e) => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('opened reminder')),
			);
		} else if (el === 'pr') {
			all.push(
				og
					.filter((e) => e.f_id && Array.isArray(e.activity.active))
					.filter((e) => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('positive reminder')),
			);
		} else if (el === 'spr') {
			all.push(
				og
					.filter((e) => e.f_id && Array.isArray(e.activity.active))
					.filter((e) => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('second positive')),
			);
		} else if (el === 'remaining') {
			all.push(
				og.filter(
					(e) =>
						e.last_sent <= Moment().subtract(bus[0]?.repeat_request.repeat, 'days').format('YYYY-MM-DD') &&
						(e.rating >= 3 || e.rating === null) &&
						e.active &&
						(!e.click || e.click === null) &&
						(e.last_email?.toLowerCase() !== 'first send' || e.last_email === null),
				),
			);
		} else if (el === 'added') {
			all.push(
				og
					.filter((e) => e.f_id || Array.isArray(e.activity.active))
					.filter((e) => e.activity.active[e.activity.active.length - 1].type.toLowerCase().includes('added')),
			);
		} else if (el === 'click') {
			all.push(og.filter((e) => e.f_id && Array.isArray(e.activity.active)).filter((e) => e.click));
		} else if (el === 'active') {
			all.push(og.filter((e) => e.active));
		} else if (el === 'inactive') {
			all.push(og.filter((e) => !e.active));
		} else if (el === 'last_sent') {
			all.push(
				og.filter((e) => {
					let last = Moment(e.last_sent).format('x');
					return last >= startDate.format('x') && last <= endDate.format('x');
				}),
			);
		}
	});
	let inf = all.flat().uniq();
	return inf;
};
export { orderCusts, addFilter };
