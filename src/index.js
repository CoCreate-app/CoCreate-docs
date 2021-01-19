const CoCreateExtract = require('./extract')
const fs = require('fs');
const path = require('path');
const { directory, ignores, extensions, socket, sources} = require(path.resolve(process.cwd(), 'CoCreate.config.json'));
const {CoCreateSocketInit, CoCreateUpdateDocument, CoCreateCreateDocument } = require("./socket_process.js")
/**
 * Socket init 
 */
CoCreateSocketInit(socket)

/**
 * Extract comments
 */
let result = CoCreateExtract(directory, ignores, extensions);
fs.writeFileSync('result.json', JSON.stringify(result), 'utf8')


/**
 * Store data into db
 */
result.forEach((docs) => {
	docs.forEach((doc) => {
		if (!doc.document_id) {
			CoCreateCreateDocument(doc, socket.config);		
		} else {
			CoCreateUpdateDocument(doc, socket.config);
		}
	})
})

/**
 * update document by config sources
 */



sources.forEach(({path, collection, document_id, name, category, ...rest}) => {
	if (!path) return;
	let content = fs.readFileSync(path, 'utf8');
	if (content) {
		CoCreateUpdateDocument({
			collection,
			document_id,
			data: {
				[name]: content,
				category,
				...rest
			},
			upsert: true
		}, socket.config);
	}
})

