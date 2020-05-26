import React from 'react';
import Moment from 'moment';
import { Line } from 'react-chartjs-2';

function ReviewsGraph(props) {
	let { og } = props;
	let randomColor = () => {
		let first = Math.floor(Math.random(50) * Math.floor(255));
		let sec = Math.floor(Math.random(50) * Math.floor(255));
		let third = Math.floor(Math.random(50) * Math.floor(255));
		let fill = Math.floor(Math.random() * (6 - 1) + 1);
		let color = `rgba(${first}, ${sec}, ${third}, .${fill})`;
		return color;
	};
	let Graph = () => {
		let chartData = {};
		if (og.c_id) {
			let arr = og.reviews.reviews
				.sort((a, b) => (Moment(a.date).format('x') > Moment(b.date).format('x') ? 1 : -1))
				.filter((e) => e.totalReviews && e.totalReviews !== 0);
			chartData = {
				labels: arr.map((e) => e.date),
				datasets: [
					{
						label: 'Total Reviews',
						data: arr.map((e) => e.totalReviews),
						backgroundColor: [randomColor()],
						borderColor: [randomColor()],
						// fill: false,
					},
				],
			};
			return (
				<Line
					height={5}
					width={20}
					options={{
						maintainAspectRatio: false,
						// responsive: false,
						title: {
							display: false,
							text: 'All Reviews',
							fontSize: 25,
						},
						legend: {
							display: true,
							position: 'top',
						},
						hover: {
							mode: 'nearest',
							intersect: true,
						},
						scales: {
							xAxes: [
								{
									gridLines: {
										color: 'rgba(0, 0, 0, 0)',
									},
								},
							],
							yAxes: [
								{
									gridLines: {
										color: 'rgba(0, 0, 0, 0)',
									},
									ticks: {
										suggestedMin: arr[0].totalReviews - 2 >= 0 ? arr[0].totalReviews - 2 : 0,
										suggestedMax: arr[arr.length - 1].totalReviews + 5,
									},
								},
							],
						},
					}}
					data={chartData}
				/>
			);
		}
	};

	return (
		<div style={{ width: '100%', height: '20vh' }} className="card">
			{Graph()}
		</div>
	);
}

export default ReviewsGraph;
