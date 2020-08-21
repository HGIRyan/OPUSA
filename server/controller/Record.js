const Moment = require('moment');
const DefaultFun = require('./Defaults');
const { GOOGLE_PLACE_API, sendBack } = process.env;
DEV = process.env.DEV.toLowerCase() === 'true' ? true : false;
PROD = process.env.PROD.toLowerCase() === 'true' ? true : false;
trial = process.env.trial.toLowerCase() === 'true' ? true : false;
const axios = require('axios');
const moment = require('moment');
const Err = require('./Error');
const sendEmail = require('./Mail/Reviews');
const { SF_SECRET, REACT_APP_SF_SECURITY_TOKEN, SF_USERNAME, SF_PASSWORD } = process.env;
var jsforce = require('jsforce');
var conn = new jsforce.Connection();

module.exports = {
	addonRecord: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { client_id, cust_id, source, type, loc } = req.body;
			type = type === 'lead' ? 'leadgen' : type === 'win' ? 'winbacks' : type === 'ref' ? 'referral' : 'cross_sell';
			let update = await db.record.addon_feedback([cust_id]);
			if (!update[0]) {
				let info = await db.info.specific_business([client_id]);
				let cust = await db.info.customer([cust_id]);
				let check = cust[0].activity.active.filter((e) => e.date === Moment().format('YYYY-MM-DD') && e.type.includes('Clicked Email'));
				if (!check[0]) {
					await cust[0].activity.active.push({ date: Moment().format('YYYY-MM-DD'), type: `Clicked Email` });
					let activity = cust[0].activity;
					cust = await db.record.update_activity([cust_id, activity]);
				}
				let feedback = [];
				if (info[0].reviews) {
					feedback = await db.info.all_feedback_specific([client_id]);
				}
				res.status(200).send({ msg: 'GOOD', info, feedback, cust });
			} else {
				res.status(200).send({ msg: 'Not Good' });
			}
			// Record Data as well as grab feedback scores + feedback if they have reviews service
		} catch (e) {
			// Err.emailMsg(e, 'Record/addonRecord');
		}
	},
	record: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { type } = req.params;
			// UPDATE CUSTOMER ACTIVITY
			if (type === 'review' && Array.isArray(req.body)) {
				req.body.map(async (e) => {
					let { event, timestamp, email, category } = e;
					let bad = ['bounce', 'dropped', 'spamreport', 'unsubscribe', 'blocked', 'group_unsubscribe', 'group_resubscribe', 'processed'];
					// let good = ['delivered', 'open', 'click'];
					// Checking if Category exists proving email came from our Platform
					if (Array.isArray(category) && category[0] !== 'Error' && category[0] !== 'undefined' && category[0] === 'reviews') {
						// Check if Customer exists
						let check = await db.record.check([parseInt(category[2])]);
						if (parseInt(category[2]) && !email.includes('@sink.sendgrid.net') && category[0] === 'reviews' && check[0]) {
							let offset = check[0].utc_offset.split('-')[1];
							if (event === 'open') {
								if (!check[0].updated && check[0].last_email === category[1]) {
									check[0].activity.active.push({
										date: Moment(timestamp * 1000)
											.subtract(offset, 'minutes')
											.format('YYYY-MM-DD'),
										type: `Opened ${category[1]}`,
									});
									await db.record.open([
										parseInt(category[2]),
										Moment(timestamp * 1000)
											.subtract(offset, 'minutes')
											.format('YYYY-MM-DD-/-LTS'),
										event,
									]);
									await db.update.record.activity(parseInt(category[2]), check[0].activity);
								}
							} else if (event === 'delivered' && check[0]) {
								check[0].email_status === 'open' ? null : await db.record.delivered([parseInt(category[2]), event]);
							} else if (bad.some((e) => e.includes(event))) {
								// Unsubscribe
								if (!check[0].updated && check[0].last_email === category[1]) {
									check[0].activity.active.push({
										date: Moment(timestamp * 1000)
											.subtract(offset, 'minutes')
											.format('YYYY-MM-DD'),
										type: `Error On ${category[1]} || ${event}`,
									});
									await db.update.record.activity([parseInt(category[2]), check[0].activity]);
								}
								await db.record.unsub([
									parseInt(category[2]),
									Moment(timestamp * 1000)
										.subtract(offset, 'minutes')
										.format('YYYY-MM-DD-/-LTS'),
								]);
							}
						}
					}
				});
			}
			res.sendStatus(200);
		} catch (e) {
			Err.emailMsg(e, 'Record/record');
			// DEV ? console.log('Record/record', e) : null;
			res.status(200).send({ msg: 'ERROR', e });
		}
	},
	newInsights: async (req, res) => {
		let db = req.app.get('db');
		let {} = req.body;
	},
	directClick: async (req, res) => {
		try {
			let { client_id, cust_id, rating, source, cor_id } = req.body;

			let clicked = await req.app.get('db');
			console.log('Hey Dude');
		} catch (error) {
			Err.emailMsg(e, 'Record/directClick');
			DEV ? console.log('Record/directClick', e) : null;
			res.status(200).send({ msg: 'ERROR', e });
		}
	},
	directFeedback: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { feedback, cust_id, rating, activity, cust, info } = req.body;
			info = await db.info.specific_business([info.c_id]);
			info = info[0];
			if (cust_id.match(/[a-z]/i)) {
				cust_id = DefaultFun.cUnHash(cust_id);
			}
			let msg;
			if (parseInt(rating) <= 2) {
				msg = 'We Recieved Your Message';
			} else if (parseInt(rating) === 3) {
				msg = 'We Recieved Your Message';
			} else if (rating >= 4) {
				msg = 'We Recieved Your Message';
			}
			const directF = await db.record.direct_feedback([cust_id, feedback]);
			if (directF[0]) {
				let check = cust.activity.active.filter((e) => e.date === Moment().format('YYYY-MM-DD') && e.type.includes('Left Feedback'));
				if (!check[0]) {
					await db.record.update_activity([cust_id, activity]);
				}
				// Send Feedback Email
				if (
					Array.isArray(info.feedback_alert.alert)
						? info.feedback_alert.alert[0]
							? info.feedback_alert.alert[0].to !== `no-reply@${process.env.REACT_APP_COMPANY_EXTENSION}.com`
							: false
						: false
				) {
					await module.exports.notificationEmail({ info, rating, cust, feedback });
				}
				res.status(200).send({ status: 'GOOD', msg, directF });
			} else {
				res.status(200).send({ status: 'BAD', msg: 'Something Went Wrong. Thank you' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Record/directFeedback');
			res.status(200).send({ msg: 'ERROR', e });
		}
	},
	siteClick: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { site, cust_id, rating, activity, cust } = req.body;
			if (cust_id.match(/[a-z]/i)) {
				cust_id = DefaultFun.cUnHash(cust_id);
			}
			let msg;
			if (parseInt(rating) <= 2) {
				msg = 'You Are Now Being Redirected';
			} else if (parseInt(rating) === 3) {
				msg = 'You Are Now Being Redirected';
			} else if (rating >= 4) {
				msg = 'You Are Now Being Redirected';
			}
			const clicked = await db.record.site_click([cust_id, site]);
			if (clicked[0]) {
				let check = cust.activity.active.filter((e) => e.date === Moment().format('YYYY-MM-DD') && e.type.includes('Clicked to'));
				if (!check[0]) {
					cust = await db.record.update_activity([cust_id, activity]);
				}
				res.status(200).send({ status: 'GOOD', msg, clicked, cust });
			} else {
				res.status(200).send({ status: 'BAD', msg: 'Something Went Wrong. Thank you' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Record/siteclick');
		}
	},
	fastFeedback: async (req, res) => {
		let db = req.app.get('db');
		let { client_id, cust_id, rating, source, cor_id, type } = req.body;
		client_id = DefaultFun.cUnHash(client_id);
		cust_id = DefaultFun.cUnHash(cust_id);
		// rating = DefaultFun.cUnHash(rating);
		source = DefaultFun.cUnHash(source);
		cor_id = DefaultFun.cUnHash(cor_id);
		let checkRating = await db.record.checks.rating([cust_id]);
		let og = await db.info.customers.indv_cust([cust_id]);
		let update = [];
		if (rating === 'direct') {
			update = [{}];
		} else {
			update = await db.record.reviewFeedback([cust_id, rating, Moment().format('YYYY-MM-DD-/-LTS'), source]);
		}
		if (update[0]) {
			let info = await db.info.specific_business([client_id]);
			let cust = await db.info.customer([cust_id]);
			// Update Activity
			let check = cust[0].activity.active.filter((e) => e.date === Moment().format('YYYY-MM-DD'));
			if (
				info[0].feedback_alert.alert.some((e) => e.to !== `no-reply@${process.env.REACT_APP_COMPANY_EXTENSION}.com`) &&
				info[0].feedback_alert.alert.length >= 1 &&
				rating !== 'direct'
			) {
				// check
				if (parseInt(checkRating[0].rating) !== parseInt(rating) && !check.some((p) => p.type.includes('Rating') && p.date === Moment().format('YYYY-MM-DD'))) {
					let noti_email = await db.record.checks.noti_email([cust_id, update[0].last_email]);
					if (noti_email[0] && parseInt(og[0].rating) !== parseInt(rating)) {
						// Update Noti_email
						let same = parseInt(og[0].rating) === null ? true : false;
						await db.record.checks.update_noti_email([cust_id, update[0].last_email]);
						if (Array.isArray(info[0].feedback_alert.alert) ? info[0].feedback_alert.alert[0] : false && !check[0]) {
							// console.log('SENDING NOTIFICATION EMAIL');
							await module.exports.notificationEmail({ info, rating, cust, same });
						}
					}
				}
			}
			if (!check[0]) {
				await cust[0].activity.active.push({
					date: Moment().format('YYYY-MM-DD'),
					type: rating === 'direct' ? `Clicked Direct Link | ${type}` : `Left Rating of ${rating} | ${type}`,
				});
				(await update[0].rating_history) ? update[0].rating_history.rating.push(parseInt({ rating: rating, date: Moment().format('YYYY-MM-DD') })) : null;
				let activity = cust[0].activity;
				update[0].rating_history ? await db.record.update_rating_history([cust_id, update[0].rating_history]) : null;
				cust = await db.record.update_activity([cust_id, activity]);
			}
			res.status(200).send({ msg: 'GOOD', cust });
		}
	},
	feedback: async (req, res) => {
		try {
			let db = req.app.get('db');
			let { client_id, cust_id, rating, source, cor_id } = req.body;
			client_id = DefaultFun.cUnHash(client_id);
			cust_id = DefaultFun.cUnHash(cust_id);
			// rating = DefaultFun.cUnHash(rating);
			source = DefaultFun.cUnHash(source);
			cor_id = DefaultFun.cUnHash(cor_id);
			let og = await db.info.customers.indv_cust([cust_id]);
			let checkRating = await db.record.checks.rating([cust_id]);
			let update = [];
			if (rating === 'direct') {
				update = [{}];
			} else {
				update = await db.record.reviewFeedback([cust_id, rating, Moment().format('YYYY-MM-DD-/-LTS'), source]);
			}
			if (update[0]) {
				// UPDATE RATING, PUSH ON END OF RATING HISTORY
				let info = await db.info.specific_business([client_id]);
				let cust = await db.info.customer([cust_id]);
				// Update Activity
				let check = cust[0].activity.active.filter((e) => e.date === Moment().format('YYYY-MM-DD') && (!e.type.includes('Direct') || !e.type.includes('Left')));
				if (
					info[0].feedback_alert.alert.some((e) => e.to !== `no-reply@${process.env.REACT_APP_COMPANY_EXTENSION}.com`) &&
					info[0].feedback_alert.alert.length >= 1 &&
					rating !== 'direct'
				) {
					// check
					if (parseInt(checkRating[0].rating) === parseInt(rating)) {
						let noti_email = await db.record.checks.noti_email([cust_id, update[0].last_email]);
						if (noti_email[0] || parseInt(og[0].rating) !== parseInt(rating)) {
							// Update Noti_email
							let same = parseInt(og[0].rating) === null ? true : false;
							await db.record.checks.update_noti_email([cust_id, update[0].last_email]);
							if (Array.isArray(info[0].feedback_alert.alert) ? info[0].feedback_alert.alert[0] : false) {
								await module.exports.notificationEmail({ info, rating, cust, same });
							}
						}
					}
				}
				if (!check[0]) {
					await cust[0].activity.active.push({
						date: Moment().format('YYYY-MM-DD'),
						type: rating === 'direct' ? 'Clicked Direct Link' : `Left Rating of ${rating}`,
					});
					(await update[0].rating_history) ? update[0].rating_history.rating.push(parseInt({ rating: rating, date: Moment().format('YYYY-MM-DD') })) : null;
					let activity = cust[0].activity;
					update[0].rating_history ? await db.record.update_rating_history([cust_id, update[0].rating_history]) : null;
					cust = await db.record.update_activity([cust_id, activity]);
				}
				res.status(200).send({ msg: 'GOOD', info, cust });
			} else {
				res.status(200).send({ msg: 'Not Good' });
			}
		} catch (e) {
			Err.emailMsg(e, 'Record/feedback');
			res.status(200).send({ msg: 'ERROR', e });
		}
	},
	notificationEmail: async ({ info, rating, cust, feedback, same }) => {
		info = Array.isArray(info) ? info[0] : info;
		cust = Array.isArray(cust) ? cust[0] : cust;
		let { company_name, feedback_alert, c_api, logo, address } = info;
		feedback_alert = feedback_alert.alert.filter((e) => {
			if (rating >= 3) {
				return e.type === 'all' || e.type === 'positive';
			} else {
				return e.type === 'all' || e.type === 'negative';
			}
		});
		let from = process.env.REACT_APP_SF_SECURITY_TOKEN
			? c_api.salesforce.accountManager
				? c_api.salesforce.accountManager.email
					? { email: c_api.salesforce.accountManager.email, name: `${c_api.salesforce.accountManager.name} @ ${process.env.REACT_APP_COMPANY_NAME}` }
					: { email: `manager@${process.env.REACT_APP_COMPANY_EXTENSION}.com`, name: process.env.REACT_APP_COMPANY_NAME }
				: { email: `manager@${process.env.REACT_APP_COMPANY_EXTENSION}.com`, name: process.env.REACT_APP_COMPANY_NAME }
			: { email: `manager@${process.env.REACT_APP_COMPANY_EXTENSION}.com`, name: process.env.REACT_APP_COMPANY_NAME };
		let emails = [];
		feedback_alert.forEach((e) => emails.push({ email: e.to }));
		if (emails.every((e) => e.email) && emails[0]) {
			let email = [
				{
					to: emails,
					from,
					replyTo: from.email,
					subject: `New Feedback Left`,
					text: `New Feedback Left. `,
					html: `
					<style type="text/css">
					@import url('https://fonts.googleapis.com/css?family=Hind+Vadodara&display=swap');
					.noMargin {
						margin: 0;
						padding: 0;
					}
					button {
						background-color: #4CAF50; 
						  border: none;
						  color: white;
						  padding: 20px;
						  text-align: center;
						  text-decoration: none;
						  display: inline-block;
						  font-size: 16px;
						  margin: 4px 2px;
						  cursor: pointer;
					}
				</style>
				
				<body style="min-width: 600px;
												max-width: 700px;
												-webkit-user-select: none;
												-moz-user-select: none;
												-ms-user-select: none; 
												user-select: none; 
												color: black;
												font-family: 'Hind Vadodara', sans-serif;">
					<div style="width: 100%; min-height: 40vh; text-align: center; margin:0 auto; ">
						<img
							src='${logo}'
							alt='Company Logo' style='max-width:200px;' />
							<h2 class='noMargin' >New Customer Feedback</h2>
							<h3 class='noMargin' style="text-align: left; margin-left: 30%;">Feedback Provided on ${moment().format('MMM Do, YY')}</h3>
							<h3 class='noMargin' style="text-align: left; margin-left: 30%;">Customer Name: ${cust.first_name} ${cust.last_name}</h3>
							${cust.email ? `<h3 class='noMargin' style="text-align: left; margin-left: 30%;">Customer Email: ${cust.email}</h3>` : ''}
							${cust.phone ? `<h3 class='noMargin' style="text-align: left; margin-left: 30%;">Customer Email: ${cust.phone}</h3>` : ''}
							<h3 style="margin-bottom:0;  margin:5% auto 0;">Rating</h3>
							<div style="min-width:60%; margin:0 auto; padding:0; text-align:center; font-size: 2em;  vertical-align: middle; display: inline-block;">
								${
									feedback
										? `<div style="margin: 5% 0;">
										<hr/>
										<h6>NEW DIRECT FEEDBACK</h6>
										<div style="font-size: .8em;">" ${feedback} "</div>
										<hr/>
									</div>`
										: ''
								}
								<h1 style="display: inline-block; vertical-align: middle; margin: 0; padding: 0; color: #e7711b; fontSize: 80px; fontFamily: arial,sans-serif; marginRight: 5px">
									${rating}
								</h1>
							</div>
							<h5 class='noMargin'>out of 5</h5>
							${
								true
									? ''
									: `<a href="${sendBack}indv-customer/${info.cor_id}/${cust.cus_id}/${info.c_id}" target="_blank" rel="noopener noreferrer">
										<button
											style="
							height: 50px;
							background-color: #4CAF50;border: none;
							color: white;
							padding: 20px;
							text-align: center;
							text-decoration: none;
							display: inline-block;
							font-size: 16px;
							margin: 4px 2px;
							cursor: pointer; 
							"
										>
											View Customer Profile
										</button>
									</a>`
							}
							<hr style='width:40%' />
							<h3 class='noMargin'>${!same ? 'New' : 'Updated'} Feedback For ${company_name},</h3>
							<h4 class='noMargin'>${address.street}, ${address.city}, ${address.state}, ${address.zip}</h4>
						</div>
						${
							parseInt(rating) >= 4
								? `***As a reminder, this customer is now automatically being invited to leave a review online. <br/>   They may automatically receive a follow-up email down the road if they don't end up leaving a review within the next few days.`
								: '***As a reminder, this customer is not invited through our platform to leave an online review. <br/>   They will no longer recieve emails through us. <br/>    They may through their own means leave a public review.'
						}
						</body>
						`,
					category: ['feedback', 'notification', cust.cus_id.toString(), info.c_id.toString()],
				},
			];
			sendEmail.sendMail(email);
		}

		// <div style="min-width: 60%; background-color: gray; text-align:center;">
		// 	<h2 >View Customer Activity</h2>
		// </div>
		// </a>

		// console.log(email);
	},
	referral: async (req, res) => {
		try {
			let db = req.app.get('db');
			let {} = req.body;
		} catch (e) {
			Err.emailMsg(e, 'Record/referral');
		}
	},
	newReviews: async (app, allComp) => {
		try {
			let db = app.get('db');
			let sunday = moment().day(0).format('YYYY-MM-DD');
			allComp = await allComp
				.filter((e) => e.place_id !== 'N/A')
				.map(async (e, i) => {
					if (e.place_id !== 'N/A') {
						await axios
							.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${e.place_id}&key=${GOOGLE_PLACE_API}`)
							.then(async (resp) => {
								if (resp.status === 200) {
									if (resp.data.status === 'OK') {
										let { result } = resp.data;
										e.reviews = e.reviews.reviews.filter((value, index, self) => self.map((x) => x.date).indexOf(value.date) == index);
										e.reviews = { reviews: e.reviews };
										let lastReviews =
											e.reviews.reviews.length >= 5 ? e.reviews.reviews.slice(e.reviews.reviews.length - 5, e.reviews.reviews.length - 1) : e.reviews.reviews;
										let rating = result.rating;
										let newReviews = result.user_ratings_total ? result.user_ratings_total : 0;
										if (lastReviews[lastReviews.length - 1] && Array.isArray(lastReviews)) {
											let weekReview = newReviews - lastReviews[lastReviews.length - 1].totalReviews;
											let month = lastReviews.reduce((a, b) => ({ newReviews: parseFloat(a.newReviews) + parseFloat(b.newReviews) })).newReviews + weekReview;
											let status = month === 0 ? 'CRITICAL' : month === 1 ? 'URGENT' : month === 2 ? 'NEEDS ATTENTION' : month <= 5 ? 'GOOD' : 'SLOW';
											// If Recording Length is less than 4 status default to "N/A"
											let llRating = await db.info.customers.feedback_avg(e.c_id);
											llRating = llRating[0].avg;
											llRating = parseFloat(llRating).toFixed(2);
											llRating = isNaN(llRating) ? '3' : llRating;
											newReviews = newReviews >= 0 ? newReviews : 0;
											e.reviews.reviews.push({
												totalReviews: newReviews,
												newReviews: weekReview,
												rating,
												date: sunday,
												status,
												llrating: llRating,
											});
											let sorted = e.customers.reviews.sort((a, b) => (moment(a.date).format('x') > moment(b.date).format('x') ? 1 : -1));
											let cns = sorted[sorted.length - 1].remaining;
											let auto = e.reviews.reviews[e.reviews.reviews.length - 4] ? await DefaultFun.setting_auto_amt(cns, month, e) : 2;
											if (auto !== 'NA' && !trial && e.auto_amt.amt !== 0) {
												await db.update.record.auto_amt([e.c_id, { amt: auto }]);
											}
											// UPDATE REVIEW HISTORY
											await db.update.record.reviews([e.c_id, e.reviews]);
											await db.update.record.review_history([e.c_id, isNaN(weekReview) ? 0 : weekReview, status]);
										}
									}
								}
							})
							.catch((e) => console.log(e));
					} else {
						let { company_name } = e;
						await axios.get(`https://api.scaleserp.com/search?api_key=${process.env.REACT_APP_SERP_API}&q=${company_name}`).then(async (resp) => {
							if (resp.status === 200) {
								let { knowledge_graph } = resp.data;
								e.reviews = e.reviews.reviews.filter((value, index, self) => self.map((x) => x.date).indexOf(value.date) == index);
								e.reviews = { reviews: e.reviews };
								let lastReviews =
									e.reviews.reviews.length >= 5 ? e.reviews.reviews.slice(e.reviews.reviews.length - 5, e.reviews.reviews.length - 1) : e.reviews.reviews;
								let rating = knowledge_graph.rating;
								let newReviews = knowledge_graph.reviews;
								if (lastReviews[lastReviews.length - 1] && Array.isArray(lastReviews)) {
									let weekReview = newReviews - lastReviews[lastReviews.length - 1].totalReviews;
									let month = lastReviews.reduce((a, b) => ({ newReviews: parseFloat(a.newReviews) + parseFloat(b.newReviews) })).newReviews + weekReview;
									let status = month === 0 ? 'CRITICAL' : month === 1 ? 'URGENT' : month === 2 ? 'NEEDS ATTENTION' : month <= 5 ? 'GOOD' : 'SLOW';
									// If Recording Length is less than 4 status default to "N/A"
									let llRating = await db.info.customers.feedback_avg(e.c_id);
									llRating = llRating[0].avg;
									llRating = parseFloat(llRating).toFixed(2);
									llRating = isNaN(llRating) ? '3' : llRating;
									e.reviews.reviews.push({
										totalReviews: newReviews,
										newReviews: weekReview,
										rating,
										date: sunday,
										status,
										llrating: llRating,
									});
									let sorted = e.customers.reviews.sort((a, b) => (moment(a.date).format('x') > moment(b.date).format('x') ? 1 : -1));
									let cns = sorted[sorted.length - 1].remaining;
									let auto = e.reviews.reviews[e.reviews.reviews.length - 4] ? await DefaultFun.setting_auto_amt(cns, month, e) : 2;
									if (auto !== 'NA' && !trial && e.auto_amt.amt !== 0) {
										await db.update.record.auto_amt([e.c_id, { amt: auto }]);
									}
									// UPDATE REVIEW HISTORY
									await db.update.record.reviews([e.c_id, e.reviews]);
									// await db.update.record.review_history([e.c_id, weekReview, status]);
								}
							}
						});
					}
				});
		} catch (e) {
			Err.emailMsg(e, 'Record/newReviews');
			console.log('ERROR Record/newReviews', e);
		}
	},
	fbReviews: async (app, allComp) => {
		let random = (min, max) => Math.ceil(Math.random() * (max - min) + min);
		let sunday = moment().day(0).format('YYYY-MM-DD');
		let lastSunday = moment().day(-7).format('YYYY-MM-DD');
		for (let i = 0; i < allComp.length; i++) {
			const e = allComp[i];
			if (e.c_id) {
				setTimeout(async () => {
					let url = e.review_links.links.filter((el) => el.site === 'Facebook')[0].link;
					const result = await axios.get(url);
					// let $ = cheerio.load(result.data);
					let html = result.data;
					let notZero = html.includes('Based on the opinion of') && !html.includes('No Rating Yet');
					if (notZero) {
						// console.log(url);
						// console.log(e.company_name, 'Has Reviews');
						let totalRatings = html.split('Based on the opinion of ')[1].split(' people')[0];
						totalRatings = parseInt(totalRatings);
						let recent = e.reviews.reviews.filter((e2) => e2.date === sunday)[0];
						let last = e.reviews.reviews.filter((e2) => e2.date === lastSunday);
						if (last[0]) {
							if (last[0].facebook) {
								let newFB = parseInt(totalRatings) - parseInt(last[0].facebook.total);
								newFB = newFB >= 0 ? newFB : 0;
								if (newFB >= 1) {
									console.log(e.company_name);
								}
								recent.facebook = { total: parseInt(totalRatings), new: newFB };
							} else {
								recent.facebook = { total: totalRatings, new: 0 };
							}
						} else {
							recent.facebook = { total: totalRatings, new: 0 };
						}
						e.reviews.reviews.splice(
							e.reviews.reviews.findIndex((e2) => e2.date === sunday),
							1,
							recent,
						);
						await app.get('db').record.fb_ratings(e.c_id, e.reviews);
					} else {
						// console.log(url);
						// console.log(e.company_name, 'Does Not Have Reviews');
						let recent = e.reviews.reviews.filter((e2) => e2.date === sunday)[0];
						if (recent) {
							recent.facebook = { total: 0, new: 0 };
							e.reviews.reviews.splice(
								e.reviews.reviews.findIndex((e2) => e2.date === sunday),
								1,
								recent,
							);
							await app.get('db').record.fb_ratings(e.c_id, e.reviews);
						}
					}
				}, i * random(250, 750));
			}
		}
	},
	custCount: async (app, allComp) => {
		try {
			let db = app.get('db');
			let date = moment().format('YYYY-MM-DD');
			if (process.env.REACT_APP_VERTICLES === 'false') {
				conn.login(SF_USERNAME, SF_PASSWORD + REACT_APP_SF_SECURITY_TOKEN, function (err, userInfo) {}); //.then(re => console.log(re));
			}
			await allComp.forEach(async (e) => {
				// GET CUSTOMERS TOTAL
				// GET ALL WITH NO FEEDBACK
				let lastSend = moment().subtract(e.repeat_request.repeat, 'days').format('YYYY-MM-DD');
				let total = await db.info.customers.count_comp_total([e.c_id, lastSend]);
				let remaining = await db.info.customers.cust_activity([e.c_id]);
				// all that are customers not sent
				let notSent = await db.record.added_not_sent([e.c_id]);
				remaining = remaining.filter(
					(e) => Moment(e.last_sent).format('x') <= Moment(lastSend).format('x') || e.activity.active[e.activity.active.length - 1].type === 'Customer added',
				).length;
				e.customers.reviews.push({
					notSent: notSent[0].total,
					size: total[0].total,
					remaining: remaining,
					date,
					percent: (remaining / total[0].total).toFixed(2) * 100,
				});
				let cns = e.customers.reviews[e.customers.reviews.length - 1].remaining;
				let month;
				let newC;
				if (e.reviews.reviews[e.reviews.reviews.length - 5]) {
					let one = e.reviews.reviews[e.reviews.reviews.length - 1].newReviews;
					let two = e.reviews.reviews[e.reviews.reviews.length - 2].newReviews;
					let three = e.reviews.reviews[e.reviews.reviews.length - 3].newReviews;
					let four = e.reviews.reviews[e.reviews.reviews.length - 4].newReviews;
					let five = e.reviews.reviews[e.reviews.reviews.length - 5].newReviews;
					month = one + two + three + four + five;
				} else {
					month = 1;
					newC = true;
				}
				if (process.env.REACT_APP_SF_SECURITY_TOKEN) {
					if (cns <= 0 && e.c_api.salesforce.sf_id) {
						// UPDATE SF
						conn.sobject('Account').update(
							{
								Id: e.c_api.salesforce.sf_id,
								need_reviews_list__c: true,
							},
							function (err, ret) {
								if (err || !ret.success) {
									return console.error('Record/CustCount', err, ret);
								}
							},
						);
					}
				}
				let auto = await DefaultFun.setting_auto_amt(cns, month, e);
				if ((auto !== 'NA' && !trial && e.auto_amt.amt !== 0 && !newC) || e.auto_amt.pause) {
					await db.update.record.auto_amt([e.c_id, { amt: auto }]);
				}
				await db.update.record.customers_reviews([e.c_id, e.customers]);
				// console.log(e.c_id, e.customers.reviews.length);
			});
		} catch (e) {
			Err.emailMsg(e, 'Record/custCount');
			console.log('ERROR Record/custCount', e);
		}
	},
	unsubscribe: async (req, res) => {
		try {
			let { cor_id, cust_id, client_id } = req.body;
			if (isNaN(cor_id)) {
				client_id = DefaultFun.cUnHash(client_id);
				cust_id = DefaultFun.cUnHash(cust_id);
				cor_id = DefaultFun.cUnHash(cor_id);
			}
			// Get Customer + Company
			let info = await req.app.get('db').info.cust_comp([client_id, cust_id]);
			if (info[0]) {
				// Update Activity and Mark as not active
				if (!info[0].activity.active.some((e) => e.type === 'Unsubscribed' && e.date === Moment().format('YYYY-MM-DD'))) {
					await info[0].activity.active.push({ date: Moment().format('YYYY-MM-DD'), type: `Unsubscribed` });
					let activity = info[0].activity;
					await req.app.get('db').record.update_activity([cust_id, activity]);
					await req.app.get('db').record.unsub([cust_id, Moment().format('YYYY-MM-DD-/-LTS')]);
				}
				res.status(200).send({ msg: 'GOOD', info: info[0] });
			} else {
				res.status(200).send({ msg: 'There was an Error in unsubscribing' });
			}
		} catch (error) {
			Err.emailMsg(error, 'Record/unsubscribe');
			console.log('ERROR Record/unsubscribe', error);
			res.status(200).send({ msg: 'There was an Error in unsubscribing', error });
		}
	},
	depletedEmails: async (allComp, am) => {
		am.map((e) => {
			let { email, name } = e;
			let fil = allComp.filter((el) => {
				if (el.c_api.salesforce) {
					if (el.c_api.salesforce.accountManager) {
						if (el.c_api.salesforce.accountManager.email === email && el.customers.reviews[el.customers.reviews.length - 1].remaining <= 50) {
							return el;
						}
					}
				}
			});
			fil = fil.sort((a, b) =>
				a.customers.reviews[a.customers.reviews.length - 1].remaining > b.customers.reviews[b.customers.reviews.length - 1].remaining ? 1 : -1,
			);
			let emailFormat = [
				{
					to: { name, email },
					from: { name: 'Ya Boi Ryan', email: `rhutchison@${process.env.REACT_APP_COMPANY_EXTENSION}.com` },
					replyTo: `rhutchison@${process.env.REACT_APP_COMPANY_EXTENSION}.com`,
					subject: `You have ${fil.length} clients with depleated lists`,
					text: `${fil.map((el) => el.company_name + ' ' + el.customers.reviews[el.customers.reviews.length - 1].remaining + '\n').join('')}`,
					html: `
					<h3>Here are your weekly depleated lists!</h3>
					<br/>
					${fil
						.map(
							(el) => `
						<div>
							<a href='https://liftlocal.lightning.force.com/lightning/r/Account/${el.c_api.salesforce.sf_id}/view'>${el.company_name}</a>
							-
							${el.customers.reviews[el.customers.reviews.length - 1].remaining}
						</div>
						<br/>
						`,
						)
						.join('')}
						`,
					category: ['depleated', 'notification', '0', '1'],
				},
			];
			require('./Mail/Reviews').sendMail(emailFormat);
		});
	},
};
