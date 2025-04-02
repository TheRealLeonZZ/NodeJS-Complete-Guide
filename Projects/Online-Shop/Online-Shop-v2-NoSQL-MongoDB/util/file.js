const fs = require('fs');

const deleteFile = (filePath) => {
	fs.unlink(filePath, (err) => {
		if (err) {
			throw new Error('Error deleting file: ' + err);
		}
	});
};

exports.deleteFile = deleteFile;
