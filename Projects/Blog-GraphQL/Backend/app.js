require('dotenv').config();

const path = require('path');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { createHandler } = require('graphql-http/lib/use/express');
const expressPlayground =
	require('graphql-playground-middleware-express').default;

const graphQlSchema = require('./graphql/schema');
const graphQlResolver = require('./graphql/resolvers');

const app = express();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(cors());
app.use(bodyParser.json());
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(__dirname + '/images'));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

app.use(
	'/graphql',
	createHandler({
		schema: graphQlSchema,
		rootValue: graphQlResolver,
		formatError(err) {
			if (!err.originalError) {
				return err;
			}
			const message = err.message || 'An error occurred.';
			const code = err.originalError.code || 500;
			const data = err.originalError.data || [];
			return { message: message, status: code, data: data };
		},
	})
);
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

app.use((error, req, res, next) => {
	console.log(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({
		message: message,
		data: data,
	});
});

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(8080);
	})
	.catch((err) => {
		console.log(err);
	});
