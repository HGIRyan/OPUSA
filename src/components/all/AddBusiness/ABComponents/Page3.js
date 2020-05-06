import React, { Component } from 'react';
import { ColorExtractor } from 'react-color-extractor';
import { LoadingWrapper, LoadingWrapperSmall } from '../../../../utilities/index';
import { Modal } from 'react-materialize';
class Page3 extends Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		let { page, img, getColors, renderSwatches, uploader, getUploaded, updateInput } = this.props;
		let { formData, color, msg, uploading, imgLoaded, modalOpen, images } = this.props.state;
		return (
			<div>
				<h2 style={{ marginLeft: '-60%' }}>Brand & Colors</h2>
				<hr />
				{msg ? <h6>{msg}</h6> : null}
				<div style={{ display: 'flex', justifyContent: 'space-between', width: '70vw', minHeight: '50vh' }}>
					<div style={{ width: '45%', marginRIght: '5%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
						{/*Info Side*/}
						<h4>Logo</h4>
						<blockquote>
							This image is used in the header of your feedback request email as well as on the feedback blockquoteage. The maximum image file size is 2MB. We
							will scale your image for you. For best results we recommend re-sizing the image before uploading
						</blockquote>
						<div style={{ height: '20vh' }} />
						<h4>Accent Colors</h4>
						<blockquote>
							The accent color is used in email designs and landing page designs. We have detected the colors below from your logo uploaded. Click on one of
							these colors to use it as your accent color, click the selection box for a small sample of base colors or enter a color's Hex number in the field
							to use that color. Please note that "white" (hex color:#fff) is not available. Choosing a white accent color would result in white buttons on
							white background.
						</blockquote>
					</div>
					<div style={{ width: '45%', marginLeft: '5%', display: 'flex', flexDirection: 'column' }}>
						{/*Logo Side*/}
						{/* <div style={{ height: '5vh' }} /> */}
						<div style={{ height: '40vh' }}>
							<ColorExtractor getColors={getColors}>
								<img src={img} alt="COMPANY NAME" style={{ width: 'auto', maxWidth: '200px', height: 'auto', maxHeight: '200px' }} />
							</ColorExtractor>
							<form action="#" style={{ cursor: 'pointer' }}>
								<div className="file-field input-field" style={{ display: 'flex', flexDirection: 'column' }}>
									<div>
										<div className="btn  primary-color primary-hover">
											<span style={{ display: 'flex' }}>
												Upload
												<i className="material-icons" style={{ marginLeft: '5%' }}>
													cloud_upload
												</i>
											</span>
											<input type="file" name="file" onChange={e => uploader(e)} accept="image/jpg, image/png, image/jpeg" size="0px" />
										</div>
									</div>
									<div className="file-path-wrapper" style={{ maxWidth: '20vw' }}>
										<input className="file-path validate" type="text" />
									</div>
								</div>
							</form>
							{formData.file ? (
								<LoadingWrapperSmall loading={uploading}></LoadingWrapperSmall>
							) : (
								<div onClick={() => getUploaded()}>
									<Modal
										trigger={
											<button className="btn primary-color primary-hover" style={{ width: '7.5vw', marginLeft: '-24vw' }}>
												Search
											</button>
										}
										style={{ outline: 'none', minHeight: !imgLoaded ? '30vh' : 'auto' }}
										bottomSheet={false}
										fixedFooter={false}
										open={modalOpen}
										options={{
											dismissible: true,
										}}
										id="search"
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												height: Array.isArray(images) ? 'auto' : '5vh',
											}}
										>
											<LoadingWrapper loading={imgLoaded}>
												<div style={{ width: '90%' }}>
													{Array.isArray(images)
														? images.map((e, i) => {
																return (
																	<img
																		src={e.secure_url}
																		alt=""
																		className="hoverable"
																		style={{ maxWidth: '200px', maxHeight: '200px', margin: '1vh', border: 'solid black 1px', cursor: 'pointer' }}
																		key={i}
																		onClick={() => {
																			updateInput('img', e.secure_url);
																			updateInput('images', {});
																			updateInput('logo', e.secure_url);
																			updateInput('modalOpen', false);
																		}}
																	/>
																);
														  })
														: null}
												</div>
											</LoadingWrapper>
										</div>
									</Modal>
								</div>
							)}
						</div>
						<div
							style={{
								backgroundColor: `${color ? (color.includes('#') ? color : `#${color}`) : null}`,
								width: 100,
								height: 100,
								margin: '20px',
								border: 'solid black 2px',
							}}
						>
							{' '}
							SELECTED {color}{' '}
						</div>
						<div style={{ display: 'flex', flexWrap: 'wrap', width: '90%' }}>{renderSwatches()}</div>
					</div>
				</div>
				<button className="btn primary-color primary-hover" onClick={() => updateInput('page', page + 1)} style={{ width: '100%', marginLeft: '-4%' }}>
					Next Page
				</button>
			</div>
		);
	}
}

export default Page3;
