const fs = require('fs-extra');
const axios = require('axios');
const token = process.env.WHATSAPP_TOKEN;
var request = require('request');
module.exports = async function DownloadMedia(media_id, filename) {
			const MediaIdPromise = new Promise((resolve, reject) => {
				var options = {
					'method': 'GET',
					'url': 'https://graph.facebook.com/v16.0/' + media_id + '/',
					'headers': {
						'Authorization': 'Bearer ' + token,
						'Content-Type': 'application/json'
					}
				};
				request(options, function(error, response) {
					if (error) throw new Error(error);
					resolve(JSON.parse(response.body));
				});
			});

			MediaIdPromise.then((data) => {
					console.log(data.url);
					var config = {
						method: 'get',
						responseType: 'stream',
						//maxBodyLength: Infinity,
						url: '' + data.url,
						headers: {
							'Authorization': 'Bearer ' + token
						}
					};

				

				});

			}