import React from 'react';

function UploadScren(props) {
	let { og, onUpload } = props;
	return (
		<form action="#" style={{ cursor: 'pointer' }}>
			<img src={og.logo ? og.logo : ''} alt="" style={{ maxWidth: '200px' }} />
			<h4>Upload {og.company_name}'s List</h4>
			<div className="file-field input-field">
				<div className="btn  primary-color primary-hover">
					<span style={{ display: 'flex' }}>
						Upload{' '}
						<i className="material-icons" style={{ marginLeft: '5%' }}>
							cloud_upload
						</i>
					</span>
					<input type="file" onChange={onUpload} accept=".xls, .csv, .xlsx" />
				</div>
				<div className="file-path-wrapper">
					<input className="file-path validate" type="text" />
				</div>
			</div>
		</form>
	);
}

export default UploadScren;
