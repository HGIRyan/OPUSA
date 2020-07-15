import React from 'react';
import ReactTooltip from 'react-tooltip';

function NPSBreakdown(props) {
	let { promoters, demoters, passives, responses } = props;
	let nps = 100;
	let tot = 0;
	let promPerc = Math.floor((promoters.length / responses) * 100);
	let demPerc = Math.floor((demoters.length / responses) * 100);
	let passPerc = Math.floor((passives.length / responses) * 100);
	if (promPerc + demPerc + passPerc !== 100) {
		let num = Math.abs(promPerc + demPerc + passPerc - 100);
		if (promPerc + demPerc + passPerc > 100) {
			promPerc = promPerc - num;
		} else {
			promPerc = promPerc + num;
		}
	}
	if (Array.isArray(promoters) && Array.isArray(passives) && Array.isArray(demoters)) {
		tot = promoters.length + passives.length + demoters.length;
		nps = promPerc - demPerc;
	}
	let def = { padding: '0', margin: '0', display: 'flex', alignItems: 'center' };
	return (
		<div style={(def, { display: 'flex', flexDirection: 'column', width: '30%', height: '35vh', alignItems: 'center' })} className="card">
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '5%', paddingBottom: '0' }}>
				<h4 style={{ width: '60%', paddingLeft: '0', margin: '0', padding: '0', marginBottom: '2.5%' }} className="left-align">
					NPS BreakDown
				</h4>
			</div>
			<div style={{ height: '25%', width: '95%', display: 'flex', justifyContent: 'space-between' }}>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90%', width: '30%' }}>
					<h1 style={{ margin: '0', color: 'rgba(52, 168, 83, 1)' }}>{promPerc}%</h1>
					<h6>Promoters</h6>
				</div>
				<h1 style={{ margin: '2.5% 0 0' }}>-</h1>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90%', width: '30%' }}>
					<h1 style={{ margin: '0', color: 'rgba(234, 67, 53, 1)' }}>{demPerc}%</h1>
					<h6>Detractors</h6>
				</div>
				<h1 style={{ margin: '2.5% 0 0' }}>=</h1>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '90%', width: '30%' }}>
					<h1 style={{ margin: '0', color: nps <= 0 ? '#ea4335' : nps <= 30 ? '#fbbc05' : nps <= 70 ? '#0396a6' : '#34a853' }}>
						{promoters[0] ? Math.abs(promPerc - demPerc) : 0}
					</h1>
					<h6>NPScore</h6>
				</div>
			</div>
			<hr />
			<div style={{ display: 'flex', flexDirection: 'column', width: '85%' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
					<h5>
						Promoters (4-5) <b>{promoters.length}</b>
					</h5>
					<div className="progress" style={{ width: '50%', marginTop: '5%' }} data-tip data-for="promoter1">
						<div className="determinate" style={{ width: `${(promoters.length / tot) * 100}%`, backgroundColor: 'rgba(52, 168, 83, 1)' }}></div>
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
					<h5>
						Passives (3) <b>{passives.length}</b>
					</h5>
					<div className="progress" style={{ width: '50%', marginTop: '5%' }} data-tip data-for="passive1">
						<div className="determinate" style={{ width: `${(passives.length / tot) * 100}%`, backgroundColor: 'rgba(255, 241, 153, 1)' }}></div>
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
					<h5>
						Detractors (1-2) <b>{demoters.length}</b>
					</h5>
					<div className="progress" style={{ width: '50%', marginTop: '5%' }} data-tip data-for="demoter1">
						<div className="determinate" style={{ width: `${(demoters.length / tot) * 100}%`, backgroundColor: 'rgba(234, 67, 53, 1)' }}></div>
					</div>
				</div>
				<ReactTooltip id="promoter1" type="dark" effect="float" place="bottom">
					<span>{((promoters.length / tot) * 100).toFixed(0)}%</span>
				</ReactTooltip>
				<ReactTooltip id="demoter1" type="dark" effect="float" place="bottom">
					<span>{((demoters.length / tot) * 100).toFixed(0)}%</span>
				</ReactTooltip>
				<ReactTooltip id="passive1" type="dark" effect="float" place="bottom">
					<span>{((passives.length / tot) * 100).toFixed(0)}%</span>
				</ReactTooltip>
			</div>
		</div>
	);
}

export default NPSBreakdown;
