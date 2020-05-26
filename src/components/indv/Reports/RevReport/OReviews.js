import React from 'react';
import { BoxSplit } from '../../../../utilities/index';
import Moment from 'moment';
import ReactTooltip from 'react-tooltip';
function OReviews(props) {
	let { og, site, state, facebook } = props;
	let currentRange = () => {
		let { startDate } = state;
		startDate = startDate.format('YYYY-MM-DD');
		if (startDate === Moment().subtract(7, 'days').format('YYYY-MM-DD')) {
			return 'Past Week';
		} else if (startDate === Moment('2005-05-05').format('YYYY-MM-DD')) {
			return 'All Time';
		} else if (startDate === Moment().subtract(1, 'month').format('YYYY-MM-DD')) {
			return 'Past Month';
		} else if (startDate === Moment().subtract(3, 'month').format('YYYY-MM-DD')) {
			return 'Past Quarter';
		} else if (startDate === Moment().subtract(1, 'year').format('YYYY-MM-DD')) {
			return 'Past Year';
		} else {
			return 'Range';
		}
	};
	let thisMonth = (reviews) => {
		if (Array.isArray(reviews)) {
			let { startDate } = state;
			let range = reviews.filter((e) => Moment(e.date).format('x') >= startDate.format('x'));
			if (range[0]) {
				range = range.reduce((a, c) => {
					return { newReviews: a.newReviews + c.newReviews };
				});
				return range.newReviews;
			} else {
				return 0;
			}
		}
	};
	let displayStars = (rating) => {
		if (rating) {
			rating = rating.toString();
			let int = rating.split('.')[0];
			let dec = rating.split('.')[1];
			let stars = [];
			for (let i = 0; i < int; i++) {
				stars.push({ link: process.env.REACT_APP_GOOGLE_STAR, type: 'int' });
			}
			if (dec !== '0') {
				stars.push({ link: process.env.REACT_APP_GOOGLE_STAR, type: 'dec' });
			}
			return stars.map((e, i) => (
				<img
					src={e.link}
					alt="Star Ratings"
					style={{
						// margin: '0',
						height: '20px',
						width: e.type === 'int' ? '20px' : `${20 * (dec / 10)}px`,
						overflow: 'hidden',
						objectFit: e.type === 'int' ? '' : 'cover',
						objectPosition: e.type === 'int' ? '' : `0`,
						margin: '0 1px',
					}}
					key={i}
				/>
			));
		}
	};
	let Orev = (site, og) => {
		if (site === 'Google') {
			return {
				site: 'Google',
				rating: og.reviews.reviews[og.reviews.reviews.length - 1].rating,
				allTime: og.reviews.reviews[og.reviews.reviews.length - 1].totalReviews - og.reviews.reviews[0].totalReviews,
				range: thisMonth(og.reviews.reviews),
			};
		} else if (site === '1st') {
			let llRating = 0;
			props.promoters
				.concat(props.demoters)
				.concat(props.passives)
				.filter((e) => e.rating)
				.map((e) => (llRating = e.rating + llRating));
			llRating = (llRating / (props.promoters.length + props.demoters.length + props.passives.length)).toFixed(1);
			return {
				site: '1st Party \n Feedback',
				rating: llRating,
				allTime: state.allTimeTot,
				range:
					Array.isArray(state.promoters) && Array.isArray(state.passives) && Array.isArray(state.demoters)
						? state.promoters.filter((e) => Moment(e.last_sent).format('x') >= state.startDate.format('x')).length +
						  state.passives.filter((e) => Moment(e.last_sent).format('x') >= state.startDate.format('x')).length +
						  state.demoters.filter((e) => Moment(e.last_sent).format('x') >= state.startDate.format('x')).length
						: '',
			};
		} else if (site === '3rd') {
			return {
				site: '3rd Party \n Feedback',
				rating: 0,
				allTime: false ? facebook[facebook.length - 1].facebook.total - facebook[0].facebook.total : 0,
				range: false
					? facebook[facebook.length - 1].facebook.total -
					  facebook.filter((e) => Moment(e.date).format('x') >= this.state.startDate.format('x')).reduce((a, c) => a.facebook.new + c)
					: 0,
			};
		}
	};
	let stats = Orev(site, og);
	let reviewTop = { display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '50%' };
	let reviewBottom = { display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '50%' };
	let reviewBot = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', height: '50%' };
	return (
		<BoxSplit width="30%" padding="0" className="card">
			<BoxSplit width="100%" height="100%" margin="0" className="card-content ">
				<div style={reviewTop}>
					<div style={{ width: '33%', marginRight: '15%' }}>
						<h4>
							{stats.site.split('\n').map((item, i) => {
								return <p key={i}>{item}</p>;
							})}
						</h4>
					</div>
					<div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '1%', minWidth: '50%' }}>
						<p style={{ margin: '0', padding: '0', color: '#e7711b', fontSize: '20px', fontFamily: 'arial,sans-serif', marginRight: '5px' }}>{stats.rating} </p>
						<div>{displayStars(stats.rating)}</div>
					</div>
					<div style={{ width: '33%' }}></div>
				</div>
				<div style={reviewBottom}>
					<div style={reviewBot} data-tip data-for="reviews">
						<h5>+{stats.allTime}</h5>
						<p>Since Joining</p>
					</div>
					<div style={reviewBot} data-tip data-for="reviews">
						<h5>+{stats.range}</h5>
						<p>{currentRange()}</p>
					</div>
				</div>
				<ReactTooltip id="reviews" type="dark" effect="float" place="bottom">
					<span>Reviews</span>
				</ReactTooltip>
			</BoxSplit>
		</BoxSplit>
	);
}

export default OReviews;
