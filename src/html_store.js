const fs = require('fs');
const path = require('fs');
const { sources, socket} = require(path.resolve(process.cwd(), 'CoCreate.config.json'));

const {CoCreateSocketInit, CoCreateUpdateDocument } = require("./socket_process.js")

/**
 * Socket init 
 */
CoCreateSocketInit(socket);

/**
 * Store data into dab
 */
sources.forEach(({path, collection, document_id, name, category, ...rest}) => {
	let content = fs.readFileSync(path, 'utf8');
	if (content) {
		CoCreateUpdateDocument({
			collection,
			document_id,
			data: {
				[name]: content,
				category,
				...rest
			}
		}, socket.config);
	}
})
