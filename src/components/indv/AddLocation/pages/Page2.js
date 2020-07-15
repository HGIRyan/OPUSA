import React, { useState } from 'react';
import { Infobox } from '../../../../utilities/index';
import { Select } from 'react-materialize';

function Page2(props) {
	let { state } = props;
	const [site, setSite] = useState('');
	const [links, setLinks] = useState(() => props.links);
	let siteLogo = (site) => {
		if (site === 'Google') {
			return 'https://centerlyne.com/wp-content/uploads/2016/10/Google_-G-_Logo.svg_.png';
		} else {
			return 'https://image.flaticon.com/icons/png/512/124/124010.png';
		}
	};
	let link = (i, value) => {
		let opt = [...links];
		opt.splice(i, 1, { site: opt[i].site, link: value });
		setLinks(opt);
	};
	let add = (siteType) => {
		let opt = [...links];
		if (!opt.filter((e) => e.site === siteType)[0]) {
			opt.unshift({ site: siteType, link: '' });
			setLinks(opt);
			setSite(siteType);
		} else {
			alert('Site already added to review links');
		}
	};
	let remove = (i) => {
		let opt = [...links];
		opt.splice(i, 1);
		setLinks(opt);
	};
	let lookup = (site, i) => {
		let opt = [...links];
		let { placeId } = state;
		if (site === 'Google') {
			opt.splice(i, 1, { site, link: `https://search.google.com/local/writereview?placeid=${placeId}` });
			setLinks(opt);
		}
	};
	let moveUp = (i) => {
		let opt = [...links];
		if (i !== 0) {
			let first = opt[i - 1];
			let current = opt[i];
			opt.splice(i - 1, 1, current);
			opt.splice(i, 1, first);
			setLinks(opt);
		}
	};
	let moveDown = (i) => {
		let opt = [...links];
		if (i !== opt.length - 1) {
			let first = opt[i + 1];
			let current = opt[i];
			opt.splice(i + 1, 1, current);
			opt.splice(i, 1, first);
			setLinks(opt);
		}
	};
	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			<h3 style={{ right: '32%', position: 'relative' }}>Online Review Links</h3>
			<hr />
			<div style={{ width: '100%', padding: '2.5%' }}>
				<Infobox direction="row" just="flex-start" width="90%">
					<Select value={site} onChange={(e) => add(e.target.value)}>
						<option value="">Select A Site</option>
						<option value="Google">Google</option>
						<option value="Facebook">Facebook</option>
					</Select>
				</Infobox>
				<div style={{ width: '60vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					{links.map((item, i) => {
						let logo = item.site ? siteLogo(item.site) : null;
						return (
							<div
								className="card hoverable"
								style={{
									width: '75%',
									display: 'flex',
									alignItems: 'flex-start',
									flexDirection: 'column',
									backgroundColor: 'rgba(182, 182, 182, 0.2)',
								}}
								key={i}
							>
								<div style={{ display: 'flex', alignItems: 'center', height: '5vh', marginLeft: '5%' }}>
									<img style={{ maxWidth: '4vw', maxHeight: '4vh' }} src={logo} alt={`${item.site} Logo`} />
									<h4 style={{ margin: '0 2.5%' }}>{item.site}</h4>
									<input style={{ minWidth: '20vw' }} value={item.link} onChange={(e) => link(i, e.target.value)} />
									<button className="btn primary-color primary-hover" style={{ margin: '0 2.5%' }}>
										Save
									</button>
								</div>
								{/* {siteLogo(item.site)} */}
								<Infobox direction="row" width="auto">
									<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => moveUp(i)}>
										<i className="material-icons">arrow_upward</i>
									</button>
									<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => moveDown(i)}>
										<i className="material-icons">arrow_downward</i>
									</button>
									<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => remove(i)}>
										Delete
									</button>
									{item.link ? (
										<a rel="noopener noreferrer" target="_blank" href={item.link.includes('http') ? item.link : `http://${item.link}`}>
											<button className="btn btn-small primary-color primary-hover" style={{ width: '7.5vw' }}>
												Test URL
											</button>
										</a>
									) : null}
									<button className="btn btn-small primary-color primary-hover" onClick={() => lookup(item.site, i)} style={{ margin: '2.5% 2.5%' }}>
										Lookup
									</button>
								</Infobox>
							</div>
						);
					})}
				</div>
			</div>
			<button className="btn primary-color primary-hover" onClick={() => props.nex2({ links })}>
				Next Page
			</button>
		</div>
	);
}

export default Page2;
