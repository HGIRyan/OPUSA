// const { GOOGLE_PLACE_API } = process.env;
let axios = require('axios');
let Defaults = require('./Defaults');
const { SF_SECRET, REACT_APP_SF_SECURITY_TOKEN, SF_USERNAME, SF_PASSWORD } = process.env;
var jsforce = require('jsforce');

module.exports = {
	syncSF: async (app) => {
		if (process.env.REACT_APP_SF_SECURITY_TOKEN) {
			let db = app.get('db');
			let allComp = await db.info.all_record_business([]);
			var conn = new jsforce.Connection();
			await conn
				.login(SF_USERNAME, SF_PASSWORD + REACT_APP_SF_SECURITY_TOKEN, function (err, userInfo) {
					if (err) {
						return console.error('This error is in the auth callback: ' + err);
					}
				})
				.then((res) => {
					console.log(res);
				});
			allComp
				.filter((e) => e.c_api)
				.forEach(async (e) => {
					if (e.c_api.salesforce) {
						let key = e.c_api.salesforce.sf_id;
						//prettier-ignore
						let info = await conn
							.query( `
							select asset.name,asset.quantity, account.name, asset.asset_status__c, account.id, account.ownerid, account.status__c,
							account.close_date__c from asset where asset.accountid = '${key}'`,
								function ( err, result ) {
									if (err) {
										return console.error('This error is in the auth callback: ' + err);
									}
								 } )
							.then(res => {
								return res;
							} );
						let accountManager;
						let account_status;
						let assets = [];
						// {asset: '', quantity:'', status:''}
						info.records.forEach((el) => {
							let name;
							if (el.Name.includes('inback')) {
								name = 'winback';
							} else if (el.Name.includes('ross')) {
								name = 'cross_sell';
							} else if (el.Name.includes('eview')) {
								name = 'reviews';
							} else if (el.Name.includes('aps')) {
								name = 'maps';
							}
							assets.push({ asset: name, quantity: el.Quantity, status: el.Asset_Status__c });
							account_status = el.Account.Status__c;
							accountManager = Defaults.accountManager(el.Account.OwnerId);
							e.active_prod[name] = el.Asset_Status__c.toLowerCase().includes('active') ? true : false;
						});
						e.c_api.salesforce.accountManager = accountManager;
						e.c_api.salesforce.assets = assets;
						let active = account_status.toLowerCase().includes('active') ? true : false;
						// Update Company Table Row
						await db.update.sf_company_sync([e.c_id, active, e.active_prod, e.c_api]);
					}
				});
		}
	},
	overDueAccounts: async (app) => {
		if (process.env.REACT_APP_SF_SECURITY_TOKEN) {
			var jsforce = require('jsforce');
			var conn = new jsforce.Connection();
			await conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD + process.env.REACT_APP_SF_SECURITY_TOKEN, function (err, userInfo) {});
			console.log('STARTING SF');
			let accounts = await conn
				.query(
					`select id, name, status__c, phone, Days_to_Next_Contact_Date__c, Next_Contact_Date__c ,close_date__c, ownerid from account where ownerid = '0056A000002o98TQAQ' and status__c != 'Cancelled' and status__c != 'Prospecting' and status__c != 'Temporary Hold' and status__c != 'Sold' and status__c != 'Pending Cancellation' order by Next_Contact_Date__c `,
					function (err, result) {
						if (err) {
							return console.error('This error is in the auth callback: ' + err);
						}
					},
				)
				.then((res) => {
					return res;
				});
			accounts = accounts.records.filter((e) => e.Days_to_Next_Contact_Date__c >= 0 && e.Days_to_Next_Contact_Date__c !== null);
			accounts.map(async (e) => {
				await conn.sobject('Account').update(
					{
						Id: e.Id,
						Next_Contact_Date__c: moment()
							.add(Math.floor(Math.random() * (8 - 4) + 3), 'days')
							.format(),
					},
					function (err, ret) {
						if (err || !ret.success) {
							return console.error('Record/CustCount', err, ret);
						}
					},
				);
			});
			console.log('Accounts', accounts);
		}
	},
};
