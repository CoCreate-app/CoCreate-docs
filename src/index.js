const CoCreateCrud = require('@cocreate/crud-client')
const mime = require('mime-types')
const fs = require('fs');
const path = require('path');

// ToDo: throwing error
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

let CoCreateConfig;
let configFile = path.resolve(process.cwd(), 'CoCreate.config.js');
if (fs.existsSync(configFile)) {
	CoCreateConfig = require(configFile);
} else {
	console.log('config not found.')
	process.exit()
}

const { config, sources, crud  } = CoCreateConfig;

CoCreateCrud.socket.create(config)
config.broadcast = false


/**
 * update and create document by config crud
 */

 if (crud) {
	crud.forEach(async (data) => {
		await runStore(data, 'crud')
	})
}


/**
 * Store html files by config sources
 **/
if (sources) {
	let new_sources_list = [];

	async function runSources() {
		for (let i = 0; i < sources.length; i++) {
			const { entry, collection, document } = sources[i];
			
			let new_source = {...sources[i]};
			let Key
			let response = {};
			if (entry) {
				try {
					let read_type = 'utf8'
					let mime_type = mime.lookup(entry) || 'text/html';
					if (/^(image|audio|video)\/[-+.\w]+/.test(mime_type)) {
						read_type = 'base64'
					}
					
					let binary = fs.readFileSync(entry);
					
					let content = new Buffer.from(binary).toString(read_type);

					if (content && collection) {
						if (!document) 
							document = {};
						else
							for (const key of Object.keys(document)) {
								if (document[key] == '{{source}}') {
									document[key] = content
									Key = key
									break;
								}
							}

						response = await runStore({collection, document});
					}
				} catch (err) {
					console.log(err)
				}
				if (response.document && response.document[0] && response.document[0]._id) {
					new_source.document[Key] = '{{source}}'
					new_source.document._id = response.document[0]._id
				} else {
					console.log('_id could not be found')
					process.exit()
				}
			}
			new_sources_list.push(new_source)
		}

		return new_sources_list
	}
	
	runSources().then(() => {
		let new_config = {
			config,
			sources: new_sources_list,
			crud: crud,
		}
		delete new_config.config.broadcast
		let write_str = JSON.stringify(new_config, null, 4)
		write_str = "module.exports = " + write_str;

		fs.writeFileSync(configFile, write_str);
		setTimeout(function(){
			process.exit()
		}, 2000)		
	})
}

async function runStore(data) {
	try {
		let response;
		if (!data.document._id) {
			response = await CoCreateCrud.createDocument({
				...config,
				...data
			})
		} else {
			response = await  CoCreateCrud.updateDocument({
				...config,
				...data,
				upsert: true
			})
		}
		if (response) {
			return response;
		}
	} catch (err) {
		console.log(err);
		return null;
	}
} 