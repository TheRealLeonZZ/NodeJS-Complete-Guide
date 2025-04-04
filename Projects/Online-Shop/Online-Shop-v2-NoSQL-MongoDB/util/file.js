const fs = require('fs');
const path = require('path'); // Import path module

const deleteFile = (filePath) => {
	const absolutePath = path.join(__dirname, '..', filePath); // Resolve to an absolute path
	fs.unlink(absolutePath, (err) => {
		if (err) {
			throw new Error('Error deleting file: ' + err);
		}
	});
};

exports.deleteFile = deleteFile;
