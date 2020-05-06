import React, { Component } from 'react';

class CompanyList extends Component {
	constructor() {
		super();

		this.state = {};
	}
	handleCompanyClick(totLoc, pos, comp) {
		let { cor_id } = this.props;
		if ((cor_id === '0' && pos === 1 && totLoc.length === 1) || comp.searched) {
			this.props.history.push(`/client-dash/${totLoc[pos - 1].cor_id}/${totLoc[pos - 1].c_id}`, this.props.location.state);
		} else if (cor_id === '0') {
			// this.CompanyInfo(this.state.og, totLoc[pos - 1]);
			this.props.history.push(`/home/${totLoc[0].cor_id}/1`, this.props.location.state);
		} else {
			this.props.history.push(`/client-dash/${totLoc[pos - 1].cor_id}/${totLoc[pos - 1].c_id}`, this.props.location.state);
		}
	}
	render() {
		let { i, e, info, cor_id, comp } = this.props;
		let total = e.customers.reviews[e.customers.reviews.length - 1].size;
		let remaining = e.customers.reviews[e.customers.reviews.length - 1].remaining;
		let totLoc = info.filter(el => el.cor_id === e.cor_id).sort((a, b) => (a.c_id > b.c_id ? 1 : -1));
		let pos = totLoc.findIndex(el => el.c_id === e.c_id) + 1;
		if (cor_id || pos === 1 || comp.searched) {
			return (
				<div
					className="card hoverable"
					key={i}
					style={{
						border: `${
							total === 0 || !e.active
								? 'solid rgba(250, 0, 0, .9) 5px'
								: remaining === 0
								? 'solid rgba(250, 0, 0, .5) 5px'
								: remaining <= 50
								? 'solid yellow 5px'
								: ''
						}`,
						margin: '1vh 0',
						backgroundColor: `${i % 2 !== 0 ? '' : 'lightgray'}`,
						zIndex: '1',
					}}
				>
					<div className="card-content center-align" style={{ cursor: 'pointer', display: 'flex', height: '5vh', padding: '0 2.5%' }}>
						<h6 className="left-align valign-wrapper" style={{ marginTop: '.5%', width: '30%' }} onClick={() => this.handleCompanyClick(totLoc, pos, comp)}>
							{e.company_name.slice(0, 60)}
						</h6>
						<div
							className="left-align valign-wrapper"
							style={{ width: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}
							onClick={() => this.handleCompanyClick(totLoc, pos, comp)}
						>
							<h6 style={{ margin: '0', fontSize: '1em' }}>{e.address.city.slice(0, 12)}</h6>
							<h6 style={{ margin: '0', fontSize: '1em' }}>{`, ${e.address.state}`}</h6>
						</div>
						<div
							style={{
								backgroundColor: `${parseInt(total) === 0 ? 'rgba(240, 52, 52, .5)' : ''}`,
								width: '60%',
								height: '100%',
								display: 'flex',
							}}
						>
							<h6 className="left-align " style={{ width: '10%' }} onClick={() => this.handleCompanyClick(totLoc, pos, comp)}>
								{e.auto_amt.amt}
							</h6>
							<h6 className="left-align " style={{ width: '10%' }} onClick={() => this.handleCompanyClick(totLoc, pos, comp)}>
								{total}
							</h6>
							<h6 className="left-align " style={{ width: '11%' }} onClick={() => this.handleCompanyClick(totLoc, pos, comp)}>
								{remaining}
							</h6>
							<div className="left-align valign-wrapper" style={{ marginTop: '.1%', padding: '0', width: '40%' }}>
								<h6 style={{ margin: '0' }}>
									{e.place_id && e.place_id !== 'N/A' ? (
										<a
											className={`btn primary-color primary-hover`}
											href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${e.place_id}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											Google Listing
										</a>
									) : (
										<a
											className={`btn primary-color primary-hover`}
											href={`https://www.google.com/search?q=${e.company_name + ' ' + e.address.street + ' ' + e.address.city + ' ' + e.address.zip}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											Google Listing
										</a>
									)}
								</h6>
							</div>
							<h6 className="left-align " style={{ width: '10%' }} onClick={() => this.handleCompanyClick(totLoc, pos, comp)}>
								{pos}/{totLoc.length}
							</h6>
							<h6 className="left-align " style={{ width: '10%' }} onClick={() => this.handleCompanyClick(totLoc, pos, comp)}>
								{e.created.split('T')[0]}
							</h6>
							<div style={{ position: 'relative' }}>
								{!e.active ||
								total === 0 ||
								remaining === 0 ||
								e.reviews.reviews[e.reviews.reviews.length - 1].newReviews === 0 ||
								!e.reviews.reviews[e.reviews.reviews.length - 1].newReviews ? (
									<h6 className="left-align " style={{ width: '10%' }}>
										{!e.active ? <i className="material-icons">money_off</i> : null}
										{total === 0 ? <i className="material-icons">sports_kabaddi</i> : null}
										{remaining === 0 ? <i className="material-icons">sentiment_very_dissatisfied</i> : null}
										{e.reviews.reviews[e.reviews.reviews.length - 1].newReviews === 0 || !e.reviews.reviews[e.reviews.reviews.length - 1].newReviews ? (
											<i className="material-icons">star_border</i>
										) : null}
									</h6>
								) : null}
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}

export default CompanyList;
