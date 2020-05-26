import React from 'react';
import { Modal, Select } from 'react-materialize';
import Moment from 'moment';
import ReactToolTip from 'react-tooltip';
import { DateRangePicker } from 'react-dates';

function FilterOptions(props) {
	let filterStyle = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		minHeight: '20vh',
		// border: 'solid black',
	};
	let { state, addFilters, updateState } = props;
	return (
		<Modal
			style={{ outline: 'none', padding: '0', minHeight: state.customDates ? '' : '70vh' }}
			header="Filter Customers"
			options={{
				dismissible: true,
				endingTop: '10%',
				inDuration: 250,
				onCloseEnd: null,
				onCloseStart: null,
				onOpenEnd: null,
				onOpenStart: null,
				opacity: 0.5,
				outDuration: 250,
				preventScrolling: true,
				startingTop: '4%',
			}}
			trigger={
				<button className="btn primary-color primary-hover" style={{ margin: '5%', display: 'flex', justifyContent: 'center', width: '25%' }}>
					Filter
				</button>
			}
		>
			<div style={{ outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
				<div style={filterStyle}>
					<h5>Rating</h5>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'dem')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'dem')) {
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'dem'),
									);
								} else {
									await updateState('filters', state.filters.concat('dem'));
								}
								await addFilters();
							}}
						/>
						<span>Detractors (1 & 2)</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'pass')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'pass')) {
									// await setState( { filters: state.filters.filter( ( e ) => e !== 'pass' ) } );
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'pass'),
									);
								} else {
									await updateState('filters', state.filters.concat('pass'));
								}
								await addFilters();
							}}
						/>
						<span>Passives (3)</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'prom')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'prom')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'prom') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'prom'),
									);
								} else {
									// await setState({ filters: state.filters.concat('prom') });
									await updateState('filters', state.filters.concat('prom'));
								}
								await addFilters();
							}}
						/>
						<span>Promoters (4 & 5)</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'feed')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'feed')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'feed') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'feed'),
									);
								} else {
									// await setState({ filters: state.filters.concat('feed') });
									await updateState('filters', state.filters.concat('feed'));
								}
								await addFilters();
							}}
						/>
						<span>Left Feedback</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'active')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'active')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'active') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'active'),
									);
								} else {
									// await setState({ filters: state.filters.concat('active') });
									await updateState('filters', state.filters.concat('active'));
								}
								await addFilters();
							}}
						/>
						<span>Active</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'inactive')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'inactive')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'inactive') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'inactive'),
									);
								} else {
									// await setState({ filters: state.filters.concat('inactive') });
									await updateState('filters', state.filters.concat('inactive'));
								}
								await addFilters();
							}}
						/>
						<span>Inactive</span>
					</label>
					<div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
						{state.customDates ? (
							<div className="input-field noselect">
								<label style={{ margin: '0' }}>{state.startDate.format('YYYY-MM-DD') === '2005-05-05' ? '' : state.startDate.format('YYYY-MM-DD')}</label>
								<Select
									value={state.startDate.format('YYYY-MM-DD')}
									onChange={async (e) => {
										// e.target.value === 'custom'
										// 	? setState({ customDates: false, startDate: Moment().subtract(7, 'days') })
										// 	: setState({ startDate: Moment(e.target.value) });
										e.target.value === 'custom'
											? updateState([
													{ t: 'customDates', v: false },
													{ t: 'startDate', v: Moment().subtract(7, 'days') },
											  ])
											: updateState('startDate', Moment(e.target.value));
										if (e.target.value !== Moment('2005-05-05').format('YYYY-MM-DD')) {
											// await setState({ filters: state.filters.concat('last_sent') });
											await updateState('filters', state.filters.concat('last_sent'));
										} else {
											// await setState({ filters: state.filters.filter((e) => e !== 'last_sent') });
											await updateState(
												'filters',
												state.filters.filter((e) => e !== 'last_sent'),
											);
										}
										await addFilters();
									}}
									style={{ margin: '0', padding: '0', height: '1vh' }}
								>
									<option value={Moment('2005-05-05').format('YYYY-MM-DD')}>All Time</option>
									<option value={Moment().subtract(7, 'days').format('YYYY-MM-DD')}>Past Week</option>
									<option value={Moment().subtract(1, 'month').format('YYYY-MM-DD')}>Past Month</option>
									<option value={Moment().subtract(3, 'month').format('YYYY-MM-DD')}>Past Quarter</option>
									<option value={Moment().subtract(1, 'year').format('YYYY-MM-DD')}>Past Year</option>
									{/* <option value="custom">Custom Range</option> */}
								</Select>
							</div>
						) : (
							<div>
								<DateRangePicker
									startDate={state.startDate} // momentPropTypes.momentObj or null,
									startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
									endDate={state.endDate} // momentPropTypes.momentObj or null,
									endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
									onDatesChange={async ({ startDate, endDate }) => {
										// await setState({ startDate, endDate });
										await updateState([
											{ t: 'startDate', v: startDate },
											{ t: 'endDate', v: endDate },
										]);
										await addFilters();
									}} // PropTypes.func.isRequired,
									focusedInput={state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
									onFocusChange={(focusedInput) => updateState('focusInput', focusedInput)} // PropTypes.func.isRequired,
									isOutsideRange={() => false}
								/>
								<button
									className="btn primary-color primary-hover"
									onClick={async () => {
										// await setState({
										// 	customDates: true,
										// 	startDate: Moment('2005-05-05'),
										// 	filters: state.filters.filter((e) => e !== 'last_sent'),
										// });
										await updateState([
											{ t: 'customDates', v: true },
											{ t: 'startDate', v: Moment('2005-05-05') },
											{ t: 'filters', v: state.filters.filter((e) => e !== 'last_sent') },
										]);
										await addFilters();
									}}
								>
									All Time
								</button>
							</div>
						)}
					</div>
					<ReactToolTip id="last_sent" type="dark" effect="float" place="bottom">
						<span>
							Filters through to get customers where <br />
							last sent date is within parameters
						</span>
					</ReactToolTip>
				</div>
				<div style={filterStyle}>
					<h5>Activity</h5>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'open')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'open')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'open') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'open'),
									);
								} else {
									// await setState( { filters: state.filters.concat( 'open' ) } );
									await updateState('filters', state.filters.concat('open'));
								}
								await addFilters();
							}}
						/>
						<span>Opened</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'sent')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'sent')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'sent') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'sent'),
									);
								} else {
									// await setState({ filters: state.filters.concat('sent') });
									await updateState('filters', state.filters.concat('sent'));
								}
								await addFilters();
							}}
						/>
						<span>Sent</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'sr')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'sr')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'sr') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'sr'),
									);
								} else {
									// await setState( { filters: state.filters.concat( 'sr' ) } );
									await updateState('filters', state.filters.concat('sr'));
								}
								await addFilters();
							}}
						/>
						<span>Second Reminder</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'or')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'or')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'or') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'or'),
									);
								} else {
									// await setState({ filters: state.filters.concat('or') });
									await updateState('filters', state.filters.concat('or'));
								}
								await addFilters();
							}}
						/>
						<span>Opened Reminder</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'pr')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'pr')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'pr') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'pr'),
									);
								} else {
									// await setState( { filters: state.filters.concat( 'pr' ) } );
									await updateState('filters', state.filters.concat('pr'));
								}
								await addFilters();
							}}
						/>
						<span>Positive Reminder</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'spr')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'spr')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'spr') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'spr'),
									);
								} else {
									// await setState( { filters: state.filters.concat( 'spr' ) } );
									await updateState('filters', state.filters.concat('spr'));
								}
								await addFilters();
							}}
						/>
						<span>Second Positive Reminder</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'click')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'click')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'click') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'click'),
									);
								} else {
									// await setState({ filters: state.filters.concat('click') });
									await updateState('filters', state.filters.concat('click'));
								}
								await addFilters();
							}}
						/>
						<span>Clicked Review Site</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'added')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'added')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'added') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'added'),
									);
								} else {
									// await setState( { filters: state.filters.concat( 'added' ) } );
									await updateState('filters', state.filters.concat('added'));
								}
								await addFilters();
							}}
						/>
						<span>Customer Added - Not Sent</span>
					</label>
					<label>
						<input
							type="checkbox"
							checked={state.filters.some((e) => e === 'remaining')}
							onChange={async () => {
								if (state.filters.some((e) => e === 'remaining')) {
									// await setState({ filters: state.filters.filter((e) => e !== 'remaining') });
									await updateState(
										'filters',
										state.filters.filter((e) => e !== 'remaining'),
									);
								} else {
									// await setState({ filters: state.filters.concat('remaining') });
									await updateState('filters', state.filters.concat('remaining'));
								}
								await addFilters();
							}}
						/>
						<span>Remaining</span>
					</label>
				</div>
			</div>
		</Modal>
	);
}

export default FilterOptions;
