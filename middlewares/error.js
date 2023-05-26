const winston = require('winston');
const Response = require('./response');


/**
 * Any exceptions thrown in the app will end up in here
 * Here we log it to our logging DB/File
 * Send an alert to the developer by Email or in any other form
 * Return a structured response to the end user
 */
module.exports = async (err, req, res, next) => {
	try {
		// Log the exception
		winston.error(err.message, err);

		// Send response
		let response = Response('error', 'Sorry, Something went wrong', {}, 500);
		res.status(response.statusCode).send(response);
	} catch(error) {}
};
