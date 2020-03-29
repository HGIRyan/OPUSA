import React, { Component } from 'react';
import { connect } from 'reactRedux';
import { EmailContainer, NoDiv } from './../../../utilities/index';
const DEV = true;
class Email extends Component {
	constructor() {
		super();

		this.state = {};
	}
	componentDidMount() {}
	keywords(str, comp, cust, loc) {
		cust = Array.isArray(cust) ? cust[0] : cust;
		comp = Array.isArray(comp) ? comp[0] : comp;
		if (str) {
			let check = str => {
				str = str.split('.');
				let table = str[0];
				let col = str[1];
				if (table === 'comp') {
					return comp[col];
				} else if (table === 'cust') {
					return cust[col];
				}
			};
			if (str.includes('☀')) {
				str = str.split(' ');
				let items = str.map((e, i) => {
					if (e.includes('☀')) {
						e = e.split('☀')[1];
						return check(e);
					} else {
						return e;
					}
				});
				return items.join(' ').replace(/ ,/gi, ',');
			} else {
				return str;
			}
		} else {
		}
	}
	formatPhoneNumber(phoneNumberString) {
		var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
		var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			var intlCode = match[1] ? '+1 ' : '';
			return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
		}
		return null;
	}
	render() {
		// let type = this.emailType(this.props.type);
		let { loc, type, comp } = this.props;
		let cust = { first_name: 'Ryan', last_name: 'Hutch', email: process.env.REACT_APP_EXAMPLE_EMAIL };
		let format = comp.email_format.format[loc - 1];
		let one = format.split('')[0];
		let two = format.split('')[1];
		let three = format.split('')[2];
		let body, thanks, question;
		if (type === 'pr') {
			two = '2';
			body = comp.pr_body.pr[loc - 1].body
				? this.keywords(comp.pr_body.pr[loc - 1].body, comp, cust, loc)
				: "I hope you're doing well! We'd love to get your feedback <br/> so we can serve you and others better.";
			question = comp.pr_body.pr[loc - 1].question
				? this.keywords(comp.pr_body.pr[loc - 1].question, comp, cust, loc)
				: 'How likely is it that you would recommend our agency to a friend or colleague?';
			thanks = comp.pr_body.pr[loc - 1].thanks ? this.keywords(comp.pr_body.pr[loc - 1].thanks, comp, cust, loc) : 'Thank you so much for your feedback.';
		} else if (type === 'or') {
			body = comp.or_body.or[loc - 1].body
				? this.keywords(comp.or_body.or[loc - 1].body, comp, cust, loc)
				: "I hope you're doing well! We'd love to get your feedback <br/> so we can serve you and others better.";
			question = comp.or_body.or[loc - 1].question
				? this.keywords(comp.or_body.or[loc - 1].question, comp, cust, loc)
				: 'How likely is it that you would recommend our agency to a friend or colleague?';
			thanks = comp.or_body.or[loc - 1].thanks ? this.keywords(comp.or_body.or[loc - 1].thanks, comp, cust, loc) : 'Thank you so much for your feedback.';
		} else if (type === 'fr') {
			body = comp.fr_body.fr[loc - 1].body
				? this.keywords(comp.fr_body.fr[loc - 1].body, comp, cust, loc)
				: "I hope you're doing well! We'd love to get your feedback <br/> so we can serve you and others better.";
			question = comp.fr_body.fr[loc - 1].question
				? this.keywords(comp.fr_body.fr[loc - 1].question, comp, cust, loc)
				: 'How likely is it that you would recommend our agency to a friend or colleague?';
			thanks = comp.fr_body.fr[loc - 1].thanks ? this.keywords(comp.fr_body.fr[loc - 1].thanks, comp, cust, loc) : 'Thank you so much for your feedback.';
		} else if (type === 's') {
			body = comp.s_body.s[loc - 1].body
				? this.keywords(comp.s_body.s[loc - 1].body, comp, cust, loc)
				: "I hope you're doing well! We'd love to get your feedback <br/> so we can serve you and others better.";
			question = comp.s_body.s[loc - 1].question
				? this.keywords(comp.s_body.s[loc - 1].question, comp, cust, loc)
				: 'How likely is it that you would recommend our agency to a friend or colleague?';
			thanks = comp.s_body.s[loc - 1].thanks ? this.keywords(comp.s_body.s[loc - 1].thanks, comp, cust, loc) : 'Thank you so much for your feedback.';
		}
		return (
			<p>Hello</p>
			// <EmailContainer>
			// 	<div style={{ texAlign: 'center', maxWidth: '100%', background: '#fff', margin: '0 5%', padding: '2.5% 0' }}>
			// 		${one === '1' ? `${comp.logo.logo[loc - 1] ? `<img src='${comp.logo.logo[loc - 1]}' alt='Company Logo' style={{max-width: 200px;}} />` : ''}` : ``}
			// 		<div style={{ textAlign: 'left', margin: '0', padding: '0' }}>
			// 			<p style={{ fontSize: ' 1.5em' }}>${body ? body : ''}</p>
			// 			<p style={{ fontSize: ' 1.5em' }}>${question ? question : ''}</p>
			// 		</div>
			// 		<div style={{ textAlign: 'left' }}>
			// 			{two === '1' ? (
			// 				<div style={{ padding: '.5% 2.5% 0 0', marginLeft: 0, textAlign: 'center' }}>
			// 					<br />
			// 					<a
			// 						href={`${link}feedback/rating/${comp.c_id}/${cust.id}/1/email/${loc}`}
			// 						id="one"
			// 						style={{
			// 							display: 'inline-block',
			// 							border: 'solid black 2px',
			// 							borderRadius: '50%',
			// 							height: '50px',
			// 							width: '50px',
			// 							verticalAlign: 'middle',
			// 							margin: '0 2.5%',
			// 							backgroundColor: 'rgba(255, 15, 15, .7)',
			// 							textDecoration: 'none',
			// 							color: 'black',
			// 						}}
			// 					>
			// 						<h1 style={{ margin: 0, padding: 0, marginTop: '12.5%' }}>1</h1>
			// 					</a>
			// 					<a
			// 						href={`${link}feedback/rating/${comp.c_id}/${cust.id}/2/email/${loc}`}
			// 						id="two"
			// 						style={{
			// 							display: 'inline-block',
			// 							border: 'solid black 2px',
			// 							borderRadius: '50%',
			// 							height: '50px',
			// 							width: '50px',
			// 							verticalAlign: 'middle',
			// 							margin: '0 2.5%',
			// 							backgroundColor: 'rgba(255, 125, 15, .7)',
			// 							textDecoration: 'none',
			// 							color: 'black',
			// 						}}
			// 					>
			// 						<h1 style={{ margin: 0, padding: 0, marginTop: '12.5%' }}>2</h1>
			// 					</a>
			// 					<a
			// 						href={`${link}feedback/rating/${comp.c_id}/${cust.id}/3/email/${loc}`}
			// 						id="three"
			// 						style={{
			// 							display: 'inline-block',
			// 							border: 'solid black 2px',
			// 							borderRadius: '50%',
			// 							height: '50px',
			// 							width: '50px',
			// 							verticalAlign: 'middle',
			// 							margin: '0 2.5%',
			// 							backgroundColor: 'rgba(255, 250, 15, 0.7)',
			// 							textDecoration: 'none',
			// 							color: 'black',
			// 						}}
			// 					>
			// 						<h1 style={{ margin: 0, padding: 0, marginTop: '12.5%' }}>3</h1>
			// 					</a>
			// 					<a
			// 						href={`${link}feedback/rating/${comp.c_id}/${cust.id}/4/email/${loc}`}
			// 						id="four"
			// 						style={{
			// 							display: 'inline-block',
			// 							border: 'solid black 2px',
			// 							borderRadius: '50%',
			// 							height: '50px',
			// 							width: '50px',
			// 							verticalAlign: 'middle',
			// 							margin: '0 2.5%',
			// 							backgroundColor: 'rgba(100, 255, 15, 0.7)',
			// 							textDecoration: 'none',
			// 							color: 'black',
			// 						}}
			// 					>
			// 						<h1 style={{ margin: 0, padding: 0, marginTop: '12.5%' }}>4</h1>
			// 					</a>
			// 					<a
			// 						href={`${link}feedback/rating/${comp.c_id}/${cust.id}/5/email/${loc}`}
			// 						id="five"
			// 						style={{
			// 							display: 'inline-block',
			// 							border: 'solid black 2px',
			// 							borderRadius: '50%',
			// 							height: '50px',
			// 							width: '50px',
			// 							verticalAlign: 'middle',
			// 							margin: '0 2.5%',
			// 							backgroundColor: 'rgba(25, 200, 50, 0.7)',
			// 							textDecoration: 'none',
			// 							color: 'black',
			// 						}}
			// 					>
			// 						<h1 style={{ margin: 0, padding: 0, marginTop: '12.5%' }}>5</h1>
			// 					</a>
			// 					<br />
			// 					<div style={{ margin: ' 2.5% 0 0 0' }}>
			// 						<p style={{ display: 'inline-block', margin: '.5% 10%', fontSize: '1em' }}>0 = Not likely</p>
			// 						<p style={{ display: 'inline-block', margin: '.5% 10%', fontSize: '1em' }}>5 = Very likely</p>
			// 					</div>
			// 					<br />
			// 					<p style={{ marginTop: '3.5%', fontSize: ' 1.5em' }}>${thanks ? thanks : null}</p>
			// 				</div>
			// 			) : two === '2' ? (
			// 				<div style={{ padding: '.5 % 2.5 % 0 0', marginLeft: 0, textAlign: 'center' }}>
			// 					<a
			// 						href={`${link}feedback/rating/${comp.c_id}/${cust.id}/direct/email/${loc}`}
			// 						style={{
			// 							backgroundColor: `${comp.accent_color.color[loc - 1] ? (!comp.accent_color.color[loc - 1].includes('#') ? '#' + comp.accent_color.color[loc - 1] : comp.accent_color.color[loc - 1]) : 'gray'}`,
			// 							outline: 'none',
			// 							border: 'none',
			// 							color: 'white',
			// 							textAlign: 'center',
			// 							textDecoration: 'none',
			// 							display: 'inline-block',
			// 							fontSize: '16px',
			// 							margin: '4px 2px',
			// 							cursor: 'pointer',
			// 							padding: ' 15px 36px',
			// 						}}
			// 					>
			// 						Leave A Review
			// 					</a>
			// 					<p style={{ marginTop: '3.5%', fontSize: ' 1.5em' }}>${thanks ? thanks : null}</p>
			// 				</div>
			// 			) : (
			// 				``
			// 			)}
			// 		</div>
			// 		{three === '1' ? (
			// 			<div style={{ display: 'inline-block', width: '100%', margin: ' 2.5% 0', textAlign: 'left' }}>
			// 				<div style={{ display: 'inline-block', width: '80%', textAlign: 'left', verticalAlign: 'textTop' }}>
			// 					<p style={{ margin: '.25% 0', fontSize: '1em', lineHeight: '95%' }}>${comp.company_name.name[loc - 1]}</p>
			// 					<p style={{ margin: '.25% 0', fontSize: '1em', lineHeight: '95%' }}>${comp.address.address[loc - 1].street}</p>
			// 					<p style={{ margin: '.25% 0', fontSize: '1em', lineHeight: '95%' }}>
			// 						${comp.address.address[loc - 1].state}, USA, ${comp.address.address[loc - 1].zip}
			// 					</p>
			// 					<p style={{ margin: '.25% 0', fontSize: '1em', lineHeight: '95%' }}>${this.formatPhoneNumber(comp.phone.phone[loc - 1])}</p>
			// 				</div>
			// 				<a style={{ textDecoration: 'underline', display: 'inline-block' }}>
			// 					<p>Unsubscribe</p>
			// 				</a>
			// 			</div>
			// 		) : three === '2' ? (
			// 			<div>
			// 				<div style={{ display: 'inline-block', width: '100%', margin: 2.5 % 0, textAlign: 'left' }}>
			// 					${comp.logo.logo[loc - 1] ? `<img src='${comp.logo.logo[loc - 1]}' alt='Company Logo' style={{max-width: 19%," />` : ''}
			// 					<div style={{ display: 'inline-block', width: '80%', textAlign: 'left' }}>
			// 						<p style={{ margin: '.5% 0', fontSize: '1em', lineHeight: '95%' }}>${comp.company_name.name[loc - 1]}</p>
			// 						<p style={{ margin: '.5% 0', fontSize: '1em', lineHeight: '95%' }}>${comp.address.address[loc - 1].street}</p>
			// 						<p style={{ margin: '.5% 0', fontSize: '1em', lineHeight: '95%' }}>
			// 							${comp.address.address[loc - 1].state}, USA, ${comp.address.address[loc - 1].zip}
			// 						</p>
			// 						<p style={{ margin: '.5% 0', fontSize: '1em', lineHeight: '95%' }}>${this.formatPhoneNumber(comp.phone.phone[loc - 1])}</p>
			// 					</div>
			// 				</div>
			// 				<a style={{ textDecoration: 'underline', display: 'inline-block' }}>
			// 					<p>Unsubscribe</p>
			// 				</a>
			// 			</div>
			// 		) : (
			// 			``
			// 		)}
			// 	</div>
			// </EmailContainer>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(Email);
