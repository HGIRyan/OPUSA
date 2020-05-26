import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ReactTooltip from 'react-tooltip';

function FeedDonut(props) {
	let { nps, og, promoters, demoters, tot, passives } = props;
	let ratings = {};
	if (og.reviews) {
		let llRating = 0;
		promoters
			.concat(demoters)
			.concat(passives)
			.filter((e) => e.rating)
			.map((e) => (llRating = e.rating + llRating));
		llRating = (llRating / (promoters.length + demoters.length + passives.length)).toFixed(1);
		ratings = { gRating: og.reviews.reviews[og.reviews.reviews.length - 1].rating, llRating };
	}
	let def = { padding: '0', margin: '0', display: 'flex', alignItems: 'center' };
	let feedbackChart = () => {
		let chartData = {
			labels: ['Promoters', 'Passives', 'Demoters'],
			datasets: [
				{
					data: [promoters.length, passives.length, demoters.length],
					backgroundColor: ['rgba(52, 168, 83, 1)', '#fbbc05', 'rgba(234, 67, 53, 1)'],
					hoverBackgroundColor: ['rgba(52, 168, 83, .5)', 'rgba(251, 188, 5, 0.5)', 'rgba(234, 67, 53, .5)'],
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
	};
	return (
		<div style={(def, { display: 'flex', flexDirection: 'column', width: '30%', height: '35vh' })} className="card ">
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '5%', paddingBottom: '0' }}>
				<h4 className="left-align" style={{ margin: '0', marginLeft: '-2.5vw' }}>
					Feedback Donut
				</h4>
				<div className="left-align" style={{ display: 'flex', alignItems: 'center', margin: '0', padding: '0' }} data-tip data-for="NPS">
					<h4 style={{ margin: '0', padding: '0' }}>Star Diff:</h4>
					<h4
						style={{
							fontWeight: 'bold',
							margin: '0 0 0 .5vw',
							padding: '0',
							color: nps <= 0 ? '#ea4335' : nps <= 30 ? '#fbbc05' : nps <= 70 ? '#0396a6' : '#34a853',
						}}
					>
						{og.reviews ? Math.abs(ratings.gRating - ratings.llRating).toFixed(1) : null}
					</h4>
				</div>
				<ReactTooltip id="NPS" type="dark" effect="float" place="bottom">
					<span>
						{((promoters.length / tot) * 100).toFixed(0)}% - {((demoters.length / tot) * 100).toFixed(0)}% = {nps}
					</span>
					<br />
					<span>Promoters - Detractors = NPS</span>
				</ReactTooltip>
			</div>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '70%' }}>{feedbackChart()}</div>
		</div>
	);
}

export default FeedDonut;
