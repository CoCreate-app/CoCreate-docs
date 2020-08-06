const ExtractComment = require('./extract')
const path = require('path')
const fs = require('fs');
const glob = require('glob');
const config = require('../config.json');

const directory = config.directory
const ignoreFolders = config.ignores;


const extractInstance = new ExtractComment()
let result = {};
const addtionalObject = {
	collection: 'module_activity',
	document_id: '_id',
	name: 'test'
}

const files = glob.sync(directory + '/**/*.js', {});

files.forEach((file) => {
	var regex = new RegExp(ignoreFolders.join("|"), 'g');
	if (!regex.test(file)) {
		const docData = extractInstance.run(file, addtionalObject);
		console.log(file);
		if (docData.length > 0) {
			const fileName = path.basename(file);
			result[fileName] = docData
		}
	}
})

fs.writeFileSync('result.json', JSON.stringify(result), 'utf8')


