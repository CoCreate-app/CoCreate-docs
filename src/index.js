const CoCreateExtract = require('./extract')
const fs = require('fs');
const { directory, ignores, extensions, socket} = require('../config.json');
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
 * Store data into dab
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

