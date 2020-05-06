import React, { Component } from 'react';
import { Select} from 'react-materialize'
import DoubleRingSVG from './../../../../Assets/Double Ring-3s-200px.svg';

class Page1 extends Component {
	constructor() {
		super();

        this.state = {
            industry: ''
        };
	}

    render () {
        let { service, page, updateInput, getPlaces, serpedSearch, getDefault, getDetails } = this.props
        let h2Margin = {margin:'5% 0'}
        let {places, geo, placeId,  industry, businessName, serpSearch, searching, street, city, state, zip, country, phone, website, timezone, firstName, lastName, email} = this.props.state
		return <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {!this.props.location.state.industry.some(e => e.industry.toLowerCase() === industry.toLowerCase()) ? (
            <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                <Select value={''} onChange={e => updateInput('industry', e.target.value)}>
                    <option value="">New</option>
                    {this.props.location.state.industry.map(i => (
                        <option value={i.industry.toLowerCase()} key={i.industry}>
                            {i.industry.toProper()}
                        </option>
                    ))}
                </Select>
                <div className="input-field">
                    <input
                        id="industry"
                        type="text"
                        className="validate"
                        value={industry}
                        onChange={e => updateInput('industry', e.target.value)}
                    />
                    <label htmlFor="industry">New Industry: </label>
                </div>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                <Select value={industry} onChange={e => updateInput('industry', e.target.value)}>
                    <option value="">New</option>
                    {this.props.location.state.industry.map(i => (
                        <option value={i.industry.toLowerCase()} key={i.industry}>
                            {i.industry.toProper()}
                        </option>
                    ))}
                </Select>
            </div>
        )}
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '45%', alignItems: 'center', marginRight: '5%' }}>
                <h5>Bussiness Info</h5>
                <hr />
                <div className="input-field" style={{ width: serpSearch ? '110%' : '70%', marginLeft: serpSearch ? '40%' : '' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <input
                            id="bussiness_name"
                            type="text"
                            autoComplete="new-password"
                            className="validate"
                            value={businessName}
                            style={{ width: serpSearch ? '40%' : '75%' }}
                            onChange={e => {
                                if (this.props.location.state.industry.some(el => e.target.value.toLowerCase().includes(el.industry.toLowerCase()))) {
                                    let industry = this.props.location.state.industry.filter(el =>
                                        e.target.value.toLowerCase().includes(el.industry.toLowerCase()),
                                    );
                                    updateInput('industry', industry[0].industry)
                                }
                                document.title = `${process.env.REACT_APP_COMPANY_NAME} - ${e.target.value}`;
                                updateInput('businessName', e.target.value)
                            }}
                            onKeyPress={e => (e.key === 'Enter' ? getPlaces(businessName) : null)}
                        />

                        <button
                            className="btn primary-color primary-hover"
                            onClick={() => getPlaces(businessName)}
                            disabled={!businessName}
                        >
                            Search
                        </button>
                        {serpSearch ? (
                            <button className="btn primary-color primary-hover" onClick={() => serpedSearch()}>
                                SERP Search
                            </button>
                        ) : null}
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
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                    {searching ? <img style={{ width: '35px', height: '35px' }} src={DoubleRingSVG} alt="Double Ring SVG Loading" /> : null}
                </div>
                <div className="input-field" style={{ width: '70%' }}>
                    <h2 style={h2Margin}>
                        <input
                            id="street"
                            type="text"
                            className="validate"
                            value={street}
                            onChange={e => updateInput('street', e.target.value)}
                        />
                    </h2>
                    <label htmlFor="street">Street Address: </label>
                </div>
                <div className="input-field" style={{ width: '70%' }}>
                    <h2 style={h2Margin}>
                        <input id="city" type="text" className="validate" value={city} onChange={e => updateInput('city', e.target.value)} />
                    </h2>
                    <label htmlFor="city">City: </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', width: '70%', justifyContent: 'space-between' }}>
                    <div className="input-field">
                        <Select name="state" onChange={e =>updateInput('state', e.target.value)} value={state}>
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
                    <div className="input-field" style={{ height: '5vh', marginTop: '5%' }}>
                        <h2 style={h2Margin}>
                            <input value={zip} onChange={e => updateInput('zip', e.target.value)} />
                        </h2>
                        <label>Zip Code</label>
                    </div>
                </div>
                <div className="input-field" style={{ width: '70%' }}>
                    <label style={{margin: '0'}}>Country</label>
                    <Select name="country" onChange={e => updateInput('country', e.target.value)} value={country}>
                        <option value="Select Country">Select Country</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                    </Select>
                </div>
                <div style={{ display: 'flex', width: '70%', justifyContent: 'space-between' }}>
                    <div className="input-field">
                        <h2 style={h2Margin}>
                            <input value={phone} onChange={e => updateInput('phone', e.target.value)} />
                        </h2>
                        <label>Phone Number</label>
                    </div>
                    <div className="input-field">
                        <h2 style={h2Margin}>
                            <input value={website} onChange={e => updateInput('website', e.target.value)} readOnly disabled="disabled" />
                        </h2>
                        <label>Website</label>
                    </div>
                </div>
                <h5>Technicals</h5>
                <hr />
                <div className="input-field" style={{ width: '70%' }}>
                    <h2 style={h2Margin}>
                        <input value={timezone} onChange={e => updateInput('timezone', e.target.value)} readOnly disabled="disabled" />
                    </h2>
                    <label> UTC Offset</label>
                </div>
                <div style={{ width: '70%' }}>
                    <div style={{ display: 'flex' }}>
                        <div className="input-field">
                            <h2 style={h2Margin}>
                                <input
                                    value={geo.lat}
                                    // onChange={e => this.setState(prevState => ({ geo: { ...prevState, lat: e.target.value } }))}
                                    readOnly
                                    disabled="disabled"
                                />
                            </h2>
                            <label>LAT</label>
                        </div>
                        <div className="input-field">
                            <h2 style={h2Margin}>
                                <input
                                    value={geo.lng}
                                    // onChange={ e => this.setState( { lat: e.target.value } ) }
                                    readOnly
                                    disabled="disabled"
                                />
                            </h2>
                            <label>LNG</label>
                        </div>
                    </div>
                    <div className="input-field" style={{ width: '70%' }}>
                        <h2 style={h2Margin}>
                            <input
                                value={placeId}
                                    onChange={ e => {
                                        updateInput( 'placeId', e.target.value )
                                        updateInput('customPlace', true)
                                }}
                                // readOnly
                                disabled={geo.lng}
                            />
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
                        <h2 style={h2Margin}>
                                <input value={ firstName } onChange={ e => updateInput( 'firstName', e.target.value ) } />
                        </h2>
                        <label> Owner First Name</label>
                    </div>
                    <div className="input-field">
                        <h2 style={h2Margin}>
                            <input value={lastName} onChange={e => updateInput('lastName', e.target.value)} />
                        </h2>
                        <label> Owner Last Name</label>
                    </div>
                </div>
                <div className="input-field" style={{ width: '70%' }}>
                    <h2 style={{ margin: '2.5% 0 5% 0' }}>
                        <input value={email} onChange={e => updateInput('email', e.target.value)} />
                    </h2>
                    <label> Owner Email</label>
                </div>

                {/* <div className="input-field" style={{ width: '70%' }}></div> */}
                {/* <div className="input-field" style={{ width: '70%' }}></div> */}
                {/* <div className="input-field" style={{ width: '70%' }}></div> */}
                <h5>Purchased Products</h5>
                <hr />
                <label
                    style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%', marginTop: '2.5%' }}
                >
                    <input
                        type="checkbox"
                        checked={service.reviews}
                        onChange={() => this.setState(prevState => ({ service: { ...prevState.service, reviews: !service.reviews } }))}
                    />
                    <span className="tab">Review Gen</span>
                </label>
                <label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
                    <input
                        type="checkbox"
                        checked={service.winbacks}
                        onChange={() => this.setState(prevState => ({ service: { ...prevState.service, winback: !service.winback } }))}
                    />
                    <span className="tab">Winbacks</span>
                </label>
                <label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
                    <input
                        type="checkbox"
                        checked={service.leadgen}
                        onChange={() => this.setState(prevState => ({ service: { ...prevState.service, leadgen: !service.leadgen } }))}
                    />
                    <span className="tab">Lead Gen</span>
                </label>
                <label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
                    <input
                        type="checkbox"
                        checked={service.cross}
                        onChange={() => this.setState(prevState => ({ service: { ...prevState.service, cross: !service.cross } }))}
                    />
                    <span className="tab">Cross Sell</span>
                </label>
                <label style={{ width: '50%', display: 'flex', justifyContent: 'flex-start', marginLeft: '20%', marginBottom: '2.5%' }}>
                    <input
                        type="checkbox"
                        checked={service.referral}
                        onChange={() => this.setState(prevState => ({ service: { ...prevState.service, referral: !service.referral } }))}
                    />
                    <span className="tab">Referral Gen</span>
                </label>
            </div>
        </div>
        <button
            className="btn primary-color primary-hover"
            style={{ width: '100%' }}
            disabled={!industry || !businessName}
                    onClick={ () => {
                        updateInput('page', page + 1)
                getDefault();
            }}
        >
            Next Page
        </button>
    </div>;
	}
}

export default Page1;
