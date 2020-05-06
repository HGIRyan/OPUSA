import React, { Component } from 'react';
import { ColorExtractor } from 'react-color-extractor';
import { Modal } from 'react-materialize';
import { LoadingWrapper } from '../../../../utilities/index';

class LogoCom extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let {
			msg,
			getColors,
			uploader,
			img,
			renderSwatches,
			color,
			images,
			link,
			imgLoaded,
			modalOpen,
			getUploaded,
			// upload,
			removeImg,
			updateCom,
			updateLinks,
		} = this.props;
		return (
			<div style={{ marginLeft: '5%', display: 'flex', width: '90%', flexDirection: 'column', padding: '0' }} className="card hoverable">
				<div style={{ display: 'flex' }}>
					<div style={{ display: 'flex', alignItems: 'center', height: '15vh' }}>
						<form action="#" style={{ cursor: 'pointer' }}>
							<div className="file-field input-field" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<ColorExtractor getColors={getColors}>
										<img src={img} alt="COMPANY NAME" style={{ maxWidth: '200px', maxHeight: '100px' }} />
									</ColorExtractor>
									<input type="file" name="file" onChange={e => uploader(e)} accept="image/jpg, image/png, image/jpeg" size="0px" />
								</div>
							</div>
						</form>
						<div
							style={{
								width: '',
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'space-around',
								marginLeft: '5%',
							}}
						>
							{/* <button
								className="btn primary-color primary-hover"
								style={{ display: 'flex', justifyContent: 'center' }}
								onClick={() => {
									upload();
								}}
							>
								<i className="material-icons">cloud_upload</i> Upload
							</button> */}
							<div onClick={() => getUploaded()}>
								<Modal
									open={modalOpen}
									trigger={<button className="btn primary-color primary-hover">Search</button>}
									style={{ outline: 'none' }}
									bottomSheet={false}
									fixedFooter={false}
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											minHeight: Array.isArray(images) ? '15vh' : '5vh',
										}}
									>
										<LoadingWrapper loading={imgLoaded}>
											<div style={{ width: '90%' }}>
												{link ? (
													<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '15vh' }}>
														<img src={link} alt="" style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '5vh' }} />
														<div style={{ display: 'flex', width: '60%', justifyContent: 'space-around', alignItems: 'center' }}>
															<button className="btn primary-color primary-hover" onClick={() => removeImg()}>
																Back
															</button>
															{img === link ? (
																<h3>Cool, updated Bro</h3>
															) : (
																<button className="btn primary-color primary-hover" onClick={() => updateCom()}>
																	Update Logo
																</button>
															)}
														</div>
													</div>
												) : Array.isArray(images) ? (
													images.map((e, i) => {
														return (
															<img
																src={e.secure_url}
																alt=""
																className="hoverable"
																style={{ maxWidth: '200px', maxHeight: '200px', margin: '1vh', border: 'solid black 1px', cursor: 'pointer' }}
																key={i}
																onClick={() => updateLinks(e.secure_url)}
															/>
														);
													})
												) : null}
											</div>
										</LoadingWrapper>
									</div>
								</Modal>
							</div>
						</div>
					</div>
				</div>
				<div
					style={{
						backgroundColor: color.includes('#') ? color : `#${color}`,
						width: '75px',
						height: '75px',
						margin: '5px',
						border: 'solid black 2px',
						fontSize: '.8em',
					}}
				>
					SELECTED {color.includes('#') ? color : `#${color}`}{' '}
				</div>
				<div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderSwatches()}</div>
				<h2>{msg ? msg : null}</h2>
			</div>
		);
	}
}

export default LogoCom;
