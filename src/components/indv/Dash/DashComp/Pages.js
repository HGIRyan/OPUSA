import React from 'react';
import { pagination } from '../../../../utilities/index';
function Pages(props) {
	let { current, info, perPage, updateState } = props;
	let width = window.innerWidth;
	let changePage = async (num) => {
		let pages = Math.ceil(info.length / perPage);
		if (num !== '-1' && num !== '+1') {
			updateState('current', num);
		} else {
			if (num === '+1' && current !== pages) {
				updateState('current', current + 1);
			} else if (num === '-1' && current !== 1) {
				updateState('current', current - 1);
			}
		}
	};
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				marginLeft: `${width >= 1500 ? '2vw' : '12.5%'}`,
				borderBottom: 'solid gray 1px',
				paddingBottom: '.5%',
			}}
		>
			<button className={`btn ${current === 1 ? 'secondary-color' : 'primary-color primary-hover'}`} onClick={() => changePage('-1')}>
				<i className="material-icons">arrow_back_ios </i>
			</button>
			{pagination(info, current, perPage)
				.pages.slice(current <= 4 ? current - 1 : current - 5, current + 4)
				.map((number) => {
					return (
						<button
							key={number}
							id={number}
							onClick={() => changePage(number)}
							style={{ margin: '0 2.5%' }}
							className={`btn ${current === number ? 'secondary-color' : 'primary-color primary-hover'}`}
						>
							{number === current - 4 ? '...' : ''}
							{number}
							{number === current + 4 ? '...' : ''}
						</button>
					);
				})}
			<button
				className={`btn ${current === Math.ceil(info.length / perPage) ? 'secondary-color' : 'primary-color primary-hover'}`}
				onClick={() => changePage('+1')}
			>
				<i className="material-icons">arrow_forward_ios</i>
			</button>
		</div>
	);
}

export default Pages;
