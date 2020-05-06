import React, { Component } from 'react';
import { pagination } from '../../../../utilities/index';

class Pagination extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let width = window.innerWidth;
		let { current, perPage, info, changePage } = this.props;
		return (
			<div
				style={{
					marginTop: '-5%',
					width: `${width >= 1500 ? '80vw' : '90vw'}`,
					// zIndex: 5,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-around',
					marginLeft: `${width >= 1500 ? '2vw' : '12.5%'}`,
					paddingBottom: '.5%',
				}}
			>
				<button className={`btn ${current === 1 ? 'secondary-color noCursor' : 'primary-color primary-hover'}`} onClick={() => this.chanegPage('-1')}>
					<i className="material-icons">arrow_back_ios </i>
				</button>
				{pagination(info, current, perPage).pages.map(number => {
					return (
						<button
							key={number}
							id={number}
							onClick={() => {
								changePage(number);
								this.props.history.push(`/home/${this.props.match.params.cor_id}/${number}`, this.props.location.state);
							}}
							className={`btn ${current === number ? 'secondary-color noCursor' : 'primary-color primary-hover'}`}
						>
							{number}
						</button>
					);
				})}
				<button
					className={`btn ${current === Math.ceil(info.length / perPage) ? 'secondary-color' : 'primary-color primary-hover'}`}
					onClick={() => this.chanegPage('+1')}
				>
					<i className="material-icons">arrow_forward_ios</i>
				</button>
			</div>
		);
	}
}

export default Pagination;
