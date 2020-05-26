import React from 'react';
import Moment from 'moment';
import { Select } from 'react-materialize';
import { DateRangePicker } from 'react-dates';

function RangeSelect(props) {
	let { state, updateSate, settingState } = props;
	return (
		<div style={{ display: 'flex', alignItems: 'center', height: '5vh' }}>
			<div style={{ width: '90%', display: 'flex', alignItems: 'center' }}>
				{!state.customDates ? (
					<div className="input-field noselect" style={{ width: '12vw' }}>
						<label>
							{state.startDate.format('YYYY-MM-DD') === '2005-05-05' ? `` : `${state.startDate.format('MMM Do, YY')} - ${state.endDate.format('MMM Do, YY')}`}
						</label>
						<Select
							value={state.startDate.format('YYYY-MM-DD')}
							onChange={(e) => {
								if (e.target.value === 'custom') {
									// setState({ customDates: true, startDate: Moment().subtract(7, 'days') });
									updateSate('customDates', true);
									updateSate('startDate', Moment().subtract(7, 'days'));
								} else {
									settingState({ change: true, customDates: e.target.value === 'custom', startDate: Moment(e.target.value) });
								}
							}}
							style={{ margin: '0', padding: '0' }}
						>
							<option value={Moment('2005-01-05').format('YYYY-MM-DD')}>All Time</option>
							<option value={Moment().subtract(7, 'days').format('YYYY-MM-DD')}>Past Week</option>
							<option value={Moment().subtract(1, 'month').format('YYYY-MM-DD')}>Past Month</option>
							<option value={Moment().subtract(3, 'month').format('YYYY-MM-DD')}>Past Quarter</option>
							<option value={Moment().subtract(1, 'year').format('YYYY-MM-DD')}>Past Year</option>
							<option value="custom">Custom Range</option>
						</Select>
					</div>
				) : (
					<div style={{ display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'row' }}>
						<div style={{ display: 'flex', alignItems: 'center', width: '20vw', flexDirection: 'row' }}>
							<DateRangePicker
								startDate={state.startDate} // momentPropTypes.momentObj or null,
								startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
								endDate={state.endDate} // momentPropTypes.momentObj or null,
								endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
								onDatesChange={async ({ startDate, endDate }) => {
									// await setState({ startDate, endDate });
									await updateSate('startDate', startDate);
									await updateSate('endDate', endDate);
									await settingState({ change: true, customDates: state.customDates, startDate: startDate });
								}} // PropTypes.func.isRequired,
								focusedInput={state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
								onFocusChange={(focusedInput) => {
									// setState({ focusedInput });
									updateSate('focusInput', focusedInput);
								}} // PropTypes.func.isRequired,
								isOutsideRange={() => false}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default RangeSelect;
