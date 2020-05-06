import React, { Component } from 'react';
import { Select } from 'react-materialize';
import { Infobox } from '../../../../utilities/index';

class Page2 extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let { page, updateInput, add, siteLogo, link, lookup } = this.props;
		let { links, site } = this.props.state;
		return (
			<div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '50vh' }}>
				<h3 style={{ right: '32%', position: 'relative' }}>Online Review Links</h3>
				<hr />
				<div style={{ width: '100%', padding: '2.5%' }}>
					<Infobox direction="row" just="flex-start" width="90%">
						<Select value={site} onChange={e => add(e.target.value)}>
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
										<input style={{ minWidth: '20vw' }} value={item.link} onChange={e => link(i, e.target.value)} />
										{/* <button className="btn primary-color primary-hover" style={{ margin: '0 2.5%' }} onClick={() => save()}>
									Save
								</button> */}
									</div>
									{/* {this.siteLogo(item.site)} */}
									<Infobox direction="row" width="auto">
										<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => this.moveUp(i)}>
											<i className="material-icons">arrow_upward</i>
										</button>
										<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => this.moveDown(i)}>
											<i className="material-icons">arrow_downward</i>
										</button>
										<button className="btn btn-small primary-color primary-hover" style={{ margin: '2.5% 2.5%' }} onClick={() => this.delete(i)}>
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
				<button
					className="btn primary-color primary-hover"
					onClick={() => updateInput('page', page + 1)}
					style={{ width: '100%', position: 'absolute', bottom: '2.5vh', right: '0vw' }}
				>
					Next Page
				</button>
			</div>
		);
	}
}

export default Page2;
