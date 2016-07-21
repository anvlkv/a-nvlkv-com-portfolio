let googleapis = require('googleapis');

Meteor.startup(()=>{
	if (Meteor.settings.admin.googleAPI.privateKey.private_key_id) {
		console.log('running apis code');
		let credentials = Meteor.settings.admin.googleAPI.privateKey,
			jwt = new googleapis.auth.JWT(credentials.client_email, null, credentials.private_key, 'https://www.googleapis.com/auth/analytics.readonly'),
			oauth2Client = new googleapis.auth.OAuth2();


		jwt.authorize(function(err, result) {
			if (err) {
				console.log('The JWT returned an error: ' + err);
				return;
			}

			oauth2Client.setCredentials({
				access_token: result.access_token
			});

			var service = googleapis.analyticsreporting('v4');
				service.reports.batchGet({
					'headers': {'Content-Type': 'application/json'},
					"auth": oauth2Client,
					"resource":{
						reportRequests:[
							{
								"viewId": "ga:"+Meteor.settings.admin.googleAPI.viewID,
								"dateRanges":[{
									"startDate": '2016-07-01',
									"endDate": moment().format('YYYY-MM-DD'),
								}],
								"metrics": [{"expression":"ga:pageviews"},{"expression":"ga:avgtimeonpage"}],
								"dimensions": [{"name":"ga:pagepath"},{"name":"ga:segment"}],
								"segments": [{
									"dynamicSegment":
										{
											"name": "version_bw",
											"userSegment":
												{
													"segmentFilters": [
														{
															"simpleSegment":
																{
																	"orFiltersForSegment": [
																	{
																	"segmentFilterClauses": [
																		{
																		"dimensionFilter":
																			{
																				"dimensionName": "ga:eventAction",
																				"operator": "EXACT",
																				"expressions": ["set-visual-code"]
																			}
																		},{
																		"dimensionFilter":
																			{
																				"dimensionName": "ga:eventLabel",
																				"operator": "EXACT",
																				"expressions": ["bw"]
																			}
																		}
																	]
																}]
															}
													}]
												}
									}
								},{
									"dynamicSegment":
										{
											"name": "version_color",
											"userSegment":
												{
													"segmentFilters": [
														{
															"simpleSegment":
																{
																"orFiltersForSegment": [
																	{
																	"segmentFilterClauses": [
																		{
																		"dimensionFilter":
																			{
																				"dimensionName": "ga:eventAction",
																				"operator": "EXACT",
																				"expressions": ["set-visual-code"]
																			}
																		},{
																		"dimensionFilter":
																			{
																				"dimensionName": "ga:eventLabel",
																				"operator": "EXACT",
																				"expressions": ["color"]
																			}
																		}
																	]
																}]
															}
													}]
												}
									}
								}]
							}
						]
					}
					
				}, function(err, response) {
					if (err) {
						console.log('API Error: '+ err);
						return;
					}
					let rows = response.reports[0].data.rows;
					for (var i = 0; i < rows.length; i++) {
						console.log(rows[i].dimensions);
						console.log(rows[i].metrics);
					}
					console.log();
					// var files = response.items;
					// if (files.length === 0) {
					// 	console.log('No files found.');
					// } else {

					// 	for (var i = 0; i < files.length; i++) {
					// 		var file = files[i];
					// 		console.log('%s (%s)', file.title, file.id);
					// 	}
					// }
				});
			});







	}
});




// /*
// var googleapis = require('googleapis');
// var googleAuth = require('google-auth-library');
// var fs = require('fs');

// (function(){
// 	"use strict";

// 	// Load client secrets from a local file.
// 	fs.readFile('privateSettings.json', function processClientSecrets(err, content) {
// 	if (err) {
// 		console.log('Error loading client secret file: ' + err);
// 		return;
// 	}

// 	// Authorize a client with the loaded credentials, then call the
// 	// Drive API.
// 	authorize(JSON.parse(content));
// 	});

// 	var authorize = function(credentials) {
// 		var auth = new googleAuth();
// 		var oauth2Client = new auth.OAuth2();
// 		var jwt = new googleapis.auth.JWT(
// 			credentials.serviceAccountKey.client_email,
// 			null,
// 			credentials.serviceAccountKey.private_key,
// 			['https://www.googleapis.com/aut...']);	
// 	jwt.authorize(function(err, result) {
		
// 		oauth2Client.setCredentials({
// 			access_token: result.access_token
// 		});

// 		var service = googleapis.drive('v2');
// 			service.files.list({
// 				auth: oauth2Client,
// 				maxResults: 10,
// 			}, function(err, response) {
// 				if (err) {
// 					console.log('The API returned an error: ' + err);
// 					return;
// 				}

// 				var files = response.items;
// 				if (files.length === 0) {
// 					console.log('No files found.');
// 				} else {
// 					console.log('Files:');
// 					for (var i = 0; i < files.length; i++) {
// 						var file = files[i];
// 						console.log('%s (%s)', file.title, file.id);
// 					}
// 				}
// 			});
// 		});
// 	};
// })();
// */