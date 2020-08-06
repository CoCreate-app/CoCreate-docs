const extract = require('extract-comments');
const fs = require('fs');

class ExtractComment {
	constructor() {

	}

	run(path, addtionalObj) {
		let content = fs.readFileSync(path, 'utf8');
		let comments = extract(content)

		let docItems = [];

		comments.forEach(({value}) => {
			let ret_value = this.extractValue(value)
			if (ret_value) {
				docItems.push({
					...addtionalObj, 
					value: ret_value
				})
			}
		})
		return docItems;
	}

	extractValue(valueStr) {
		var regResult = /@value_start(?<value>.*?)@value_end/gs.exec(valueStr);
		if (regResult) {
			return regResult.groups.value.trim()
		} else {
			return null
		}
	}
}

module.exports = ExtractComment

