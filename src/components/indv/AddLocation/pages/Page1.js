import React, { useState } from 'react';
import { Select } from 'react-materialize';
import DoubleRingSVG from './../../../../Assets/Double Ring-3s-200px.svg';
import axios from 'axios';

function Page1(props) {
	const [service, setService] = useState({ reviews: true, cross: false, referral: false, winback: false, leadgen: false });
	const [searching, setSearch] = useState('');
	const [industry, setIndustry] = useState('');
	const [website, setWebsite] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [timezone, setTimezone] = useState('');
	const [address, setAddress] = useState({ street: '', country: '', state: '', zip: '', city: '' });
	const [geo, setGeo] = useState({ lat: '', lng: '' });
	const [places, setPlaces] = useState([]);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [placeId, setPlaceId] = useState('');
	const [rating, setRating] = useState('');
	const [reviews, setReviews] = useState('');
	const [businessName, setBusinessName] = useState('');
	const [links, setLinks] = useState([]);
	let { page, next1 } = props;
	const locationState = props.location.state;

	let getDetails = async (placeId) => {
		// if (this.state.customPlace) {
		// 	placeId = this.state.placeId;
		// }
		setPlaceId(placeId);
		setLinks([{ site: 'Google', link: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}` }]);
		setSearch(true);
		setPlaces([]);
		await axios
			.post('/api/google/place/placeid/details', { placeId })
			.then((res) => {
				if (res.data.msg === 'GOOD') {
					let data = res.data.data;
					let address = data.formatted_address.split(',');
					let street = address[0];
					let state = address[2].split(' ')[1];
					let city = address[1];
					let zip = address[2].split(' ')[2];
					let geo = { lat: data.geometry.location.lat, lng: data.geometry.location.lng };
					let website = data.website;
					let timezone = data.utc_offset;
					let phone = data.international_phone_number;
					let reviews = data.user_ratings_total ? data.user_ratings_total : 0;
					let rating = data.rating ? data.rating : 5;
					if (website && phone && timezone) {
						setBusinessName(data.name);
						setAddress({ street, country: 'United States', state, zip, city });
						setGeo(geo);
						setWebsite(website);
						setTimezone(timezone);
						setPhone(phone);
						setRating(rating);
						setReviews(reviews);
						setSearch(false);
					} else {
						alert("This GMB Profile Doesn't Have All Required Information");
					}
				} else {
				}
			})
			.catch((err) => console.log('ERROR::', err));
	};
	let getPlaces = async (searchTerm) => {
		setSearch(true);
		await axios
			.post('/api/google/place/search', { searchTerm })
			.then((res) => {
				res = res.data;
				if (res.msg === 'GOOD') {
					if (res.data.length !== 0) {
						setPlaces(res.data);
						setSearch(false);
					} else {
						alert('No Results');
					}
				} else {
					alert(res.msg);
				}
			})
			.catch((err) => console.log('ERROR::', err));
	};
	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			{!locationState.industry.some((e) => e.industry.toLowerCase() === industry.toLowerCase()) ? (
				<div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
					<Select value={''} onChange={(e) => setIndustry(e.target.value)}>
						{locationState.industry.map((i) => (
							<option value={i.industry.toLowerCase()} key={i.industry}>
								{i.industry.toProper()}
							</option>
						))}
						<option value="">New</option>
					</Select>
					<div className="input-field">
						<input id="industry" type="text" className="validate" value={industry} onChange={(e) => setIndustry(e.target.value)} />
						<label htmlFor="industry">New Industry: </label>
					</div>
				</div>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
					<Select value={industry} onChange={(e) => setIndustry(e.target.value)}>
						{locationState.industry.map((i) => (
							<option value={i.industry.toLowerCase()} key={i.industry}>
								{i.industry.toProper()}
							</option>
						))}
						<option value="">New</option>
					</Select>
				</div>
			)}
			<div style={{ display: 'flex', width: '100%', height: '100%' }}>
				<div style={{ display: 'flex', flexDirection: 'column', width: '45%', alignItems: 'center', marginRight: '5%' }}>
					<h5>Bussiness Info</h5>
					<hr />
					<div className="input-field" style={{ width: '70%' }}>
						<h2 style={{ margin: '0' }}>
							<input
								id="bussiness_name"
								type="text"
								autoComplete="new-password"
								className="validate"
								value={businessName}
								onChange={(e) => {
									if (locationState.industry.some((el) => e.target.value.toLowerCase().includes(el.industry.toLowerCase()))) {
										setIndustry(locationState.industry.filter((el) => e.target.value.toLowerCase().includes(el.industry.toLowerCase()))[0].industry);
									}
									setBusinessName(e.target.value);
								}}
								onKeyPress={(e) => (e.key === 'Enter' ? getPlaces(businessName) : null)}
							/>
							<button className="btn primary-color primary-hover" onClick={() => getPlaces(businessName)}>
								Search
							</button>
						</h2>
						<label htmlFor="business_name">Business Name:</label>
						{/* {PUT MAPPED LIST OF RETURNED FROM GOOGLE SEARCH} */}
						{places[0] ? (
							<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
								{places.map((e, i) => {
									return (
										<div
											onClick={() => getDetails(e.place_id)}
											key={i}
											className="card hoverable"
											style={{
												width: '100%',
												minHeight: '5vh',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'flex-start',
												margin: '1.5% 0',
												cursor: 'pointer',
											}}
										>
											{e.description}
											{/* {e.structured_formatting.main_text} */}
										</div>
									);
								})}
							</div>
						) : null}
						{searching ? <img style={{ width: '35px', height: '35px' }} src={DoubleRingSVG} alt="Searching SVG" /> : null}
					</div>
					<div className="input-field" style={{ width: '70%' }}>
						<h2 style={{ margin: '0' }}>
							<input
								id="street"
								type="text"
								className="validate"
								value={address.street}
								name="street"
								onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })}
							/>
						</h2>
						<label htmlFor="street">Street Address: </label>
					</div>
					<div className="input-field" style={{ width: '70%' }}>
						<h2 style={{ margin: '0' }}>
							<input
								id="city"
								type="text"
								className="validate"
								value={address.city}
								name="city"
								onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })}
							/>
						</h2>
						<label htmlFor="city">City: </label>
					</div>
					<div style={{ display: 'flex', alignItems: 'flex-start', width: '70%', justifyContent: 'space-between' }}>
						<div className="input-field">
							<Select name="state" onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })} value={address.state}>
								<option value="">Select State</option>
								<option value="AL">Alabama</option>
								<option value="AK">Alaska</option>
								<option value="AZ">Arizona</option>
								<option value="AR">Arkansas</option>
								<option value="CA">California</option>
								<option value="CO">Colorado</option>
								<option value="CT">Connecticut</option>
								<option value="DE">Delaware</option>
								<option value="DC">District Of Columbia</option>
								<option value="FL">Florida</option>
								<option value="GA">Georgia</option>
								<option value="HI">Hawaii</option>
								<option value="ID">Idaho</option>
								<option value="IL">Illinois</option>
								<option value="IN">Indiana</option>
								<option value="IA">Iowa</option>
								<option value="KS">Kansas</option>
								<option value="KY">Kentucky</option>
								<option value="LA">Louisiana</option>
								<option value="ME">Maine</option>
								<option value="MD">Maryland</option>
								<option value="MA">Massachusetts</option>
								<option value="MI">Michigan</option>
								<option value="MN">Minnesota</option>
								<option value="MS">Mississippi</option>
								<option value="MO">Missouri</option>
								<option value="MT">Montana</option>
								<option value="NE">Nebraska</option>
								<option value="NV">Nevada</option>
								<option value="NH">New Hampshire</option>
								<option value="NJ">New Jersey</option>
								<option value="NM">New Mexico</option>
								<option value="NY">New York</option>
								<option value="NC">North Carolina</option>
								<option value="ND">North Dakota</option>
								<option value="OH">Ohio</option>
								<option value="OK">Oklahoma</option>
								<option value="OR">Oregon</option>
								<option value="PA">Pennsylvania</option>
								<option value="RI">Rhode Island</option>
								<option value="SC">South Carolina</option>
								<option value="SD">South Dakota</option>
								<option value="TN">Tennessee</option>
								<option value="TX">Texas</option>
								<option value="UT">Utah</option>
								<option value="VT">Vermont</option>
								<option value="VA">Virginia</option>
								<option value="WA">Washington</option>
								<option value="WV">West Virginia</option>
								<option value="WI">Wisconsin</option>
								<option value="WY">Wyoming</option>
							</Select>
							<label>State</label>
						</div>
						<div className="input-field" style={{ height: '5vh', marginTop: '2.5%' }}>
							<h2 style={{ margin: '0' }}>
								<input value={address.zip} onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })} name="zip" />
							</h2>
							<label>Zip Code</label>
						</div>
					</div>
					<div className="input-field" style={{ width: '70%' }}>
						<label style={{ margin: '0' }}>Country</label>
						<Select name="country" onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })} value={address.country}>
							<option value="Select Country">Select Country</option>
							<option value="United States">United States</option>
							<option value="Canada">Canada</option>
						</Select>
					</div>
					<div style={{ display: 'flex', width: '70%', justifyContent: 'space-between' }}>
						<div className="input-field">
							<h2 style={{ margin: '0' }}>
								<input value={phone} onChange={(e) => setPhone(e.target.value)} />
							</h2>
							<label>Phone Number</label>
						</div>
						<div className="input-field">
							<h2 style={{ margin: '0' }}>
								<input value={website} onChange={(e) => setWebsite(e.target.value)} readOnly disabled="disabled" />
							</h2>
							<label>Website</label>
						</div>
					</div>
					<h5>Technicals</h5>
					<hr />
					<div className="input-field" style={{ width: '70%' }}>
						<h2 style={{ margin: '0' }}>
							<input value={timezone} onChange={(e) => setTimezone(e.target.value)} readOnly disabled="disabled" />
						</h2>
						<label> UTC Offset</label>
					</div>
					<div style={{ width: '70%' }}>
						<div style={{ display: 'flex' }}>
							<div className="input-field">
								<h2 style={{ margin: '0' }}>
									<input
										value={geo.lat}
										// onChange={e => setState(prevState => ({ geo: { ...prevState, lat: e.target.value } }))}
										readOnly
										disabled="disabled"
									/>
								</h2>
								<label>LAT</label>
							</div>
							<div className="input-field">
								<h2 style={{ margin: '0' }}>
									<input
										value={geo.lng}
										// onChange={ e => setState( { lat: e.target.value } ) }
										readOnly
										disabled="disabled"
									/>
								</h2>
								<label>LNG</label>
							</div>
						</div>
						<div className="input-field" style={{ width: '70%' }}>
							<h2 style={{ margin: '0' }}>
								<input value={placeId} onChange={(e) => setPlaceId(e.target.value)} disabled={geo.lng} />
								{placeId ? (
									<a
										className="btn primary-color primary-hover"
										target="_blank"
										rel="noopener noreferrer"
										href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`}
									>
										Google.com
									</a>
								) : null}
							</h2>
							<label>Place ID</label>
						</div>
					</div>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', width: '45%', marginLeft: '5%', alignItems: 'center' }}>
					<h5>Owner Info</h5>
					<hr />
					<div style={{ display: 'flex', width: '70%', justifyContent: 'space-between' }}>
						<div className="input-field">
							<h2 style={{ margin: '0' }}>
								<input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
							</h2>
							<label> Owner First Name</label>
						</div>
						<div className="input-field">
							<h2 style={{ margin: '0' }}>
								<input value={lastName} onChange={(e) => setLastName(e.target.value)} />
							</h2>
							<label> Owner Last Name</label>
						</div>
					</div>
					<div className="input-field" style={{ width: '70%' }}>
						<h2 style={{ margin: '0' }}>
							<input value={email} onChange={(e) => setEmail(e.target.value)} />
						</h2>
						<label> Owner Email</label>
					</div>
					<h5>Purchased Products</h5>
					<hr />
					<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%', marginTop: '2.5%' }}>
						<input type="checkbox" checked={service.reviews} onChange={() => setService({ ...service, reviews: !service.reviews })} />
						<span className="tab">Review Gen</span>
					</label>
					<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
						<input type="checkbox" checked={service.winbacks} onChange={() => setService({ ...service, winbacks: !service.winbacks })} />
						<span className="tab">Winbacks</span>
					</label>
					<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
						<input type="checkbox" checked={service.leadgen} onChange={() => setService({ ...service, leadgen: !service.leadgen })} />
						<span className="tab">Lead Gen</span>
					</label>
					<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
						<input type="checkbox" checked={service.cross} onChange={() => setService({ ...service, cross: !service.cross })} />
						<span className="tab">Cross Sell</span>
					</label>
					<label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
						<input type="checkbox" checked={service.referral} onChange={() => setService({ ...service, referral: !service.referral })} />
						<span className="tab">Referral Gen</span>
					</label>
				</div>
			</div>
			<button
				className="btn primary-color primary-hover"
				onClick={() => {
					// setState({ page: page + 1 });
					next1({ businessName, address, geo, website, timezone, phone, rating, reviews, industry, firstName, lastName, email, service, links, placeId });
				}}
			>
				Next Page
			</button>
		</div>
	);
}

export default Page1;
