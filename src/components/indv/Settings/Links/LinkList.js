import React from 'react';
import { Infobox } from '../../../../utilities/index';
function LinkList(props) {
	let perm = props.location.state.permissions;
	let { links, link, moveUp, moveDown, lookup, remove, info } = props;
	let siteLogo = (site) => {
		if (site === 'Google') {
			return process.env.REACT_APP_GOOGLE_LOGO;
		} else if (site === 'Facebook') {
			return process.env.REACT_APP_FACEBOOK_LOGO;
		} else if (site === 'Trustpilot') {
			return process.env.REACT_APP_TRUSTPILOT_LOGO;
		} else if (site === 'Custom') {
			return info.logo;
		}
	};
	return (
		<div style={{ width: '60vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			{links.map((item, i) => {
				let logo = item.site ? siteLogo(item.site) : null;
				return (
					<div
						className="card hoverable"
						style={{ width: '75%', display: 'flex', alignItems: 'flex-start', flexDirection: 'column', backgroundColor: 'rgba(182, 182, 182, 0.2)' }}
						key={i}
					>
						<div style={{ display: 'flex', alignItems: 'center', height: '5vh', marginLeft: '5%' }}>
							<img style={{ maxWidth: '4vw', maxHeight: '4vh' }} src={logo} alt={`${item.site} Logo`} />
							<h4 style={{ margin: '0 2.5%' }}>{item.site}</h4>
							<input
								style={{ width: '30vw' }}
								value={item.link}
								onChange={(e) => link(i, e.target.value, item.site)}
								disabled={perm !== 'admin' ? true : false}
							/>
						</div>
						{/* {siteLogo(item.site)} */}
						<Infobox direction="row" width="auto">
							{perm === 'admin' ? (
								<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => moveUp(i)}>
									<i className="material-icons">arrow_upward</i>
								</button>
							) : null}
							{perm === 'admin' ? (
								<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => moveDown(i)}>
									<i className="material-icons">arrow_downward</i>
								</button>
							) : null}
							{perm === 'admin' ? (
								<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => remove(i)}>
									Delete
								</button>
							) : null}
							{item.link ? (
								<a rel="noopener noreferrer" target="_blank" href={item.link.includes('http') ? item.link : `http://${item.link}`}>
									<button className="btn btn-small primary-color primary-hover" style={{ width: '7.5vw' }}>
										Test URL
									</button>
								</a>
							) : null}
							{perm === 'admin' ? (
								<button className="btn btn-small primary-color primary-hover" onClick={() => lookup(item.site, i)} style={{ margin: '2.5% 2.5%' }}>
									Lookup
								</button>
							) : null}
						</Infobox>
					</div>
				);
			})}
		</div>
	);
}

export default LinkList;
