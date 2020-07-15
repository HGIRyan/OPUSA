import React, { useState } from 'react';
import { ColorExtractor } from 'react-color-extractor';

function Page3(props) {
	let { cor_id } = props.match.params;
	const bus = props.location.state.info.filter((e) => e.cor_id === parseInt(cor_id))[0];
	const [img, setImg] = useState(() => bus.logo);
	const [form, setForm] = useState({});
	const [msg, setMsg] = useState('');
	const [color, setColor] = useState(() => bus.accent_color);
	const [colors, setColors] = useState([]);
	let uploader = (e) => {
		let files = e.target.files;
		let reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = (el) => {
			const formData = { file: el.target.result };
			setImg(el.target.result);
			setForm(formData);
		};
	};
	let renderSwatches = () => {
		return colors.map((color, id) => {
			return (
				<div
					key={id}
					onClick={() => setColor(color.split('#')[1])}
					style={{
						backgroundColor: color,
						width: 75,
						height: 75,
						margin: '5px',
						cursor: 'pointer',
					}}
				>
					{color}
				</div>
			);
		});
	};
	let getColors = (col) => {
		setColors([]);
		setColors(col);
	};
	return (
		<div>
			<h2 style={{ marginLeft: '-60%' }}>Brand & Colors</h2>
			<hr />
			{msg ? <h6>{msg}</h6> : null}
			<div style={{ display: 'flex', justifyContent: 'space-between', width: '70vw' }}>
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
						The accent color is used in email designs and landing page designs. We have detected the colors below from your logo uploaded. Click on one of these
						colors to use it as your accent color, click the selection box for a small sample of base colors or enter a color's Hex number in the field to use
						that color. Please note that "white" (hex color:#fff) is not available. Choosing a white accent color would result in white buttons on white
						background.
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
										<input type="file" name="file" onChange={(e) => uploader(e)} accept="image/jpg, image/png, image/jpeg" size="0px" />
									</div>
								</div>
								<div className="file-path-wrapper" style={{ maxWidth: '20vw' }}>
									<input className="file-path validate" type="text" />
								</div>
							</div>
						</form>
					</div>
					<div
						style={{
							backgroundColor: `${color.includes('#') ? color : `#${color}`}`,
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
			<button className="btn primary-color primary-hover" onClick={() => props.nex3({ color, img, form })}>
				Next Page
			</button>
		</div>
	);
}

export default Page3;
