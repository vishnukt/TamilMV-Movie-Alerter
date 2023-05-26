const winston = require('winston');


let response = {
	success: {
		status: 'success',
		statusCode: 200,
		message: 'Operation Successful',
		data: {}
	},
	error: {
		status: 'failed',
		statusCode: 400,
		message: 'Operation Failed',
		data: {}
	}
};


module.exports = (status = 'success', message = '', data = {}, statusCode = 0) => {
	try {
		if (status === 'success') {
			response.success.message = message ? message : 'Operation Successful';
			response.success.statusCode = statusCode ? statusCode : 200;
			response.success.data = data;

			return response.success;
		}

		response.error.message = message ? message : 'Operation Failed';
		response.error.statusCode = statusCode ? statusCode : 400;
		response.error.data = data;

		return response.error;
	} catch (error) {
		winston.error('Response MiddleWare Error', error);
		return null;
	}
};
