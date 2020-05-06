import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

class StatusDonut extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let { statuses } = this.props;
		let status = statuses ? statuses : { slow: 0, good: 0, needattn: 0, urgent: 0, critical: 0, na: 0 };
		let chartData = {
			labels: ['Critical', 'Urgent', 'Needs Attention', 'Good', 'Slow', 'N/A'],
			datasets: [
				{
					data: [status.critical, status.urgent, status.needattn, status.good, status.slow, status.na],
					backgroundColor: ['rgba(234, 67, 53, 1)', 'rgba(251, 188, 5, 1)', 'rgba(255, 241, 153, 1)', 'rgba(52, 168, 83, 1)', 'rgba(3, 150, 166, 1)'],
					hoverBackgroundColor: ['rgba(234, 67, 53, .5)', 'rgba(251, 188, 5, .5)', 'rgba(255, 241, 153, .5)', 'rgba(52, 168, 83, .5)', 'rgba(3, 150, 166, .5)'],
				},
			],
		};
		return (
			<Doughnut
				options={{
					maintainAspectRatio: false,
					title: {
						display: false,
						text: 'Status',
						fontSize: 25,
					},
					legend: {
						display: true,
						position: 'top',
					},
				}}
				data={chartData}
			/>
		);
	}
}

export default StatusDonut;
