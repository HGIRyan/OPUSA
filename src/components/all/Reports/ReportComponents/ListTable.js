import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import withFixedColumns from 'react-table-hoc-fixed-columns';
import 'react-table-hoc-fixed-columns/lib/styles.css';
const ReactTableFixedColumns = withFixedColumns(ReactTable);

class ListTable extends Component {
	constructor() {
		super();

		this.state = {
			pageAMT: 250,
		};
	}

	render() {
		let { pinfo, dates, sunday, Pagination } = this.props;
		return (
			<ReactTableFixedColumns
				data={pinfo}
				columns={[
					{
						fixed: 'left',
						columns: [
							// {
							// 	Header: 'I',
							// 	Cell: row => {
							// 		return row.index + 1;
							// 	},
							// 	width: 40,
							// },
							{
								Header: 'ID',
								accessor: 'c_id',
								width: 50,
							},
							{
								Header: 'Corporation',
								accessor: 'industry',
								width: 150,
							},
							{
								Header: 'Company Name',
								id: 'company_name',
								accessor: (info) => (
									<h6
										className="left-align"
										style={{ fontSize: '1.m', marginTop: '.8%', width: '30%', cursor: 'pointer' }}
										onClick={() => this.props.history.push(`/client-dash/${info.cor_id}/${info.c_id}`, this.props.location.state)}
									>
										{info.company_name.slice(0, 35)}
									</h6>
								),
								width: 250,
							},
							{
								Header: 'City',
								id: 'company_city',
								accessor: (info) => (
									<h6
										className="left-align"
										style={{ fontSize: '1.m', marginTop: '.8%', width: '10%', cursor: 'pointer' }}
										onClick={() => this.props.history.push(`/client-dash/${info.cor_id}/${info.c_id}`, this.props.location.state)}
									>
										{info?.address?.city.slice(0, 35)}
									</h6>
								),
								width: 75,
							},
							{
								Header: 'Total',
								id: 'c_id + 9',
								accessor: (info) => {
									return info.reviews.reviews[info.reviews.reviews.length - 1].facebook
										? info.reviews.reviews[info.reviews.reviews.length - 1].facebook.total !== 0
											? `${info.reviews.reviews[info.reviews.reviews.length - 1].totalReviews} / ${
													info.reviews.reviews[info.reviews.reviews.length - 1].facebook.total
											  }`
											: info.reviews.reviews[info.reviews.reviews.length - 1].totalReviews
										: info.reviews.reviews[info.reviews.reviews.length - 1].totalReviews;
								},
								width: 50,
							},
							{
								Header: 'Auto',
								accessor: 'auto_amt.amt',
								width: 50,
							},
							{
								Header: 'Link',
								id: 'c_id + 1',
								accessor: (info) => (
									<a href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${info.place_id}`} target="_blank" rel="noopener noreferrer">
										<i className="material-icons">web</i>
									</a>
								),
								width: 50,
							},
							{
								Header: 'List Size',
								id: 'c_id + 3',
								accessor: (info) => parseInt(info.customers.reviews[info.customers.reviews.length - 1].size),
								width: 50,
							},
							{
								Header: 'Remaining List',
								id: 'c_id + 4',
								accessor: (info) => parseInt(info.customers.reviews[info.customers.reviews.length - 1].remaining),
								width: 50,
							},
							{
								Header: 'Not Sent',
								id: 'c_id + 14',
								accessor: (info) =>
									!isNaN(info.customers.reviews[info.customers.reviews.length - 1].notSent)
										? parseInt(info.customers.reviews[info.customers.reviews.length - 1].notSent)
										: 0,
								width: 50,
							},
							{
								Header: 'Status',
								id: 'c_id + 6',
								accessor: (info) => {
									let filt = info.reviews.reviews.filter((dat) => dat.date === sunday); //CHANGE TO SAT WHEN ACTUALLY RECORDING
									return filt[0] ? filt[0].status : 'NA';
								},
								width: 100,
							},
						],
					},
					{
						columns: dates
							? dates.slice(dates.length - 7, dates.length).map((date) => {
									return {
										Header: date.date.split('T')[0],
										width: 100,
										id: date.date.split('T')[0],
										accessor: (info) => {
											let filter = info.reviews.reviews.filter((dat) => dat.date === date.date.split('T')[0])[0];
											let fb = filter?.facebook;
											if (fb?.new) {
												if (fb.new > 0) {
													fb = true;
												} else {
													fb = false;
												}
											} else {
												fb = false;
											}
											return filter ? (
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														height: '100%',
														padding: '0',
														margin: '0',
														backgroundColor:
															(parseInt(filter.newReviews) <= 0 && !fb) || filter.newReviews === null
																? 'red'
																: parseInt(filter.newReviews) >= 6
																? 'purple'
																: 'green',
														color: (parseInt(filter.newReviews) <= 0 && !fb) || filter.newReviews === null ? 'black' : 'white',
													}}
												>
													{filter.newReviews === null
														? 0
														: filter.facebook
														? filter.facebook.new !== 0
															? `${filter.newReviews >= 0 ? filter.newReviews : 0} / ${filter.facebook.new}`
															: `${filter.newReviews >= 0 ? filter.newReviews : 0}`
														: `${filter.newReviews >= 0 ? filter.newReviews : 0}`}
												</div>
											) : (
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														height: '100%',
														padding: '0',
														margin: '0',
														backgroundColor: 'black',
														color: 'white',
													}}
												>
													N/A
												</div>
											);
										},
									};
							  })
							: null,
					},
				]}
				PaginationComponent={Pagination}
				showPaginationBottom={pinfo.length >= this.state.pageAMT ? true : false}
				defaultPageSize={this.state.pageAMT}
				className="-striped"
				style={{ maxHeight: '90vh', maxWidth: '100%', minWidth: '60vw', zIndex: '0', padding: '0' }}
				minRows={1}
			/>
		);
	}
}

export default ListTable;
