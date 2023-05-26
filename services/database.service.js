const mongoose = require('mongoose');
const config = require('../config/config');


const dbUrl = config.dbUrl;


module.exports = () => {

	mongoose.connect(dbUrl);

	mongoose.connection.on('connected', () => {
		console.log(`connected to mongoDB ${ dbUrl }`);
	});

	// mongoose.set('debug', true);

	mongoose.connection.on('error', (err) => {
		console.log(`MongoDB has occured ${ err }`);
	});

	mongoose.connection.on('disconnected', () => {
		console.log('MongoDB disconnected');
	});

	process.on('SIGINT', () => {
		mongoose.connection.close(() => {
			console.log('MongoDB is disconnected due to application termination');
			process.exit(0);
		});
	});
};
