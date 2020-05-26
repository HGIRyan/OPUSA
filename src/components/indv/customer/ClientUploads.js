import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout1, LoadingWrapper, NoDiv, proper } from '../../../utilities/index';
import XLSX from 'xlsx';
import axios from 'axios';
import { UploadSplash, OrderSplash, SplitList } from './Upload';
class ClientUpload extends Component {
	constructor() {
		super();
		this.state = {
			og: { c_id: 24, owner_name: { first: 'Boi' }, company_name: process.env.REACT_APP_COMPANY_NAME },
			corp: [{ c_id: 24, owner_name: { first: 'Boi' }, company_name: process.env.REACT_APP_COMPANY_NAME }],
			uploadTo: '1',
			highlight: false,
			file: {},
			data: [],
			cols: [],
			ws_og: {},
			order: ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6', 'Column 7'],
			ordering: false,
			reset: false,
			service: 'reviews',
			length: 0,
		};
		this.onUpload = this.onUpload.bind(this);
		this.upload = this.upload.bind(this);
	}
	componentDidMount() {
		document.title = `Client Upload`;
		let { client_id, cor_id } = this.props.match.params;
		if (Array.isArray(this.props.location.state.info)) {
			let item = this.props.location.state.info.filter((item) => item.c_id === parseInt(client_id));
			if (item[0]) {
				let corp = this.props.location.state.info.filter((item) => item.cor_id === parseInt(cor_id));
				this.setState({ og: item[0], corp, uploadTo: item[0].c_id.toString() });
			} else {
				this.props.history.goBack();
			}
		} else {
			this.props.history.push('/');
		}
	}
	async onUpload(e) {
		const files = e.target.files;
		if (files && files[0]) {
			await this.setState({ file: files[0] });
			await this.upload();
		}
	}
	make_cols = (refstr) => {
		let o = [],
			C = XLSX.utils.decode_range(refstr).e.c + 1;
		for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
		return o;
	};
	upload() {
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			/* Parse data */
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			this.setState({ ws_og: ws });
			let data = XLSX.utils.sheet_to_json(ws, { header: ['first', 'second', 'third', 'fourth', 'fith', 'sixth', 'seventh'] });
			/* Update state */
			// eslint-disable-next-line
			data.map((e) => {
				e.first = e.first ? e.first.toString() : null;
				e.second = e.second ? e.second.toString() : null;
				e.third = e.third ? e.third.toString() : null;
				e.fourth = e.fourth ? e.fourth.toString() : null;
				e.fith = e.fith ? e.fith.toString() : null;
				e.sixth = e.sixth ? e.sixth.toString() : null;
				e.seventh = e.seventh ? e.seventh.toString() : null;
			});
			// eslint-disable-next-line
			data.map((e) => {
				e.first = e.first ? proper(e.first) : null;
				e.second = e.second ? proper(e.second) : null;
				e.third = e.third ? proper(e.third) : null;
				e.fourth = e.fourth ? proper(e.fourth) : null;
				e.fith = e.fith ? proper(e.fith) : null;
				e.sixth = e.sixth ? proper(e.sixth) : null;
				e.seventh = e.seventh ? proper(e.seventh) : null;
			});

			this.setState({ data: data.slice(1, data.length), cols: this.make_cols(ws['!ref']), length: data.slice(1, data.length).length }, () => {
				this.defaultValue(data[0]);
			});
		};
		if (rABS) {
			reader.readAsBinaryString(this.state.file);
		} else {
			reader.readAsArrayBuffer(this.state.file);
		}
	}

	async formatOrder() {
		let { order, ws_og, corp, og, uploadTo, reset, service } = this.state;
		let arr = ['first_name', 'last_name', 'email'];
		// order = order.filter((e) => !e.includes('Column') && !e.includes('ignore'));
		if (arr.every((e) => order.includes(e))) {
			this.setState({ ordering: true });
			let data = XLSX.utils.sheet_to_json(ws_og, { header: order });
			data = data.slice(1, data.length);
			if (data[0].first_name && data[0].last_name && (data[0].phone || data[0].email)) {
				data = data.map((e) => {
					if (e.email && e.phone) {
						return {
							first_name: e.first_name,
							last_name: e.last_name,
							email: e.email,
							phone: e.phone,
						};
					} else if (e.email) {
						return {
							first_name: e.first_name,
							last_name: e.last_name,
							email: e.email,
						};
					} else {
						return {
							first_name: e.first_name,
							last_name: e.last_name,
							phone: e.phone,
						};
					}
				});
				data.map((e) => {
					if (e.email) {
						e.first_name = e.first_name ? e.first_name : 'Valued Customer';
						e.last_name = e.last_name ? e.last_name : '.';
					}
					return '';
				});
				data
					.filter((e) => e.email && e.first_name && e.last_name && e.email.emailValidate())
					.filter((value, index, self) => self.map((x) => x.email.toLowerCase()).indexOf(value.email.toLowerCase()) === index);
				await axios.post('/api/upload-customers', { og, data, corp, uploadTo, reset, service }).then((res) => {
					this.setState({ ordering: false });
					if (res.data.msg === 'GOOD') {
						alert(res.data.list);
						this.props.location.state.focus_cust = res.data.cust;
						this.props.history.push(`/client-dash/${og.cor_id}/${uploadTo === 'all' ? og.c_id : uploadTo}`, this.props.location.state);
					} else {
						alert(res.data.msg);
						if (res.data.msg === 'ERROR: Session not found') {
							this.props.history.push('/');
						}
					}
				});
			} else {
				this.setState({ ordering: false });
				alert('Please Make Sure there is atleast a Last Name, First Name and Email Column');
			}
		} else {
			this.setState({ ordering: false });
			alert('Please Make Sure there is atleast a Last Name, First Name and Email Column');
		}
		// SEND TO CLOUD
	}
	async changeOrder(i, v) {
		let { order } = this.state;
		let ind = await order.indexOf(v);
		if (v !== 'ignore') {
			await order.splice(ind, 1, `Column ${ind + 1}`);
		}
		await order.splice(i, 1, v);
		await this.setState({ order });
	}
	defaultValue(cell) {
		let { order } = this.state;
		let arr = ['first_name', 'last_name', 'email', 'phone'];
		let cellArr = [cell.first, cell.second, cell.third, cell.fourth, cell.fith, cell.sixth, cell.seventh];
		cellArr.map((str, i) => {
			if (!arr.includes(str) && str) {
				str = str.toLowerCase();
				if (str.includes('first') && order[i] !== 'first_name') {
					order.splice(i, 1, 'first_name');
					this.setState({ order });
					return 'first_name';
				} else if (str.includes('last') && order[i] !== 'last_name') {
					order.splice(i, 1, 'last_name');
					this.setState({ order });
					return 'last_name';
				} else if (str.includes('email') && order[i] !== 'email') {
					order.splice(i, 1, 'email');
					this.setState({ order });
					return 'email';
				} else if (str.includes('phone') && order[i] !== 'phone') {
					order.splice(i, 1, 'phone');
					this.setState({ order });
					return 'phone';
				} else {
					order.splice(i, 1, `Column ${i + 1}`);
					this.setState({ order });
					return `Column ${i + 1}`;
				}
			} else {
				return `Column ${i + 1}`;
			}
		});
	}

	render() {
		let { loc } = this.props.match.params;
		let { og, highlight, data } = this.state;

		return (
			<>
				<Layout1 view={{ sect: 'indv', data: og, loc }} match={this.props.match ? this.props.match.params : null} props={this.props}>
					<LoadingWrapper loading={this.state.loading}>
						<SplitList {...this.props} state={this.state} data={data} />
						<NoDiv
							style={{ marginTop: '2.5vh' }}
							border={`solid ${highlight ? 'blue' : 'white'} 5px`}
							height={`${data[0] ? 'auto' : '40vh'}`}
							width="60vw"
							align="center"
							just="center"
						>
							{!data[0] ? (
								<UploadSplash {...this.props} og={og} onUpload={this.onUpload.bind(this)} />
							) : (
								<OrderSplash
									{...this.props}
									data={data}
									state={this.state}
									changeOrder={this.changeOrder.bind(this)}
									formatOrder={this.formatOrder.bind(this)}
									updateState={(t, v) => this.setState({ [t]: v })}
								/>
							)}
						</NoDiv>
					</LoadingWrapper>
				</Layout1>
			</>
		);
	}
}

function mapStateToProps(state) {
	return { ...state };
}
export default connect(mapStateToProps, {})(ClientUpload);
