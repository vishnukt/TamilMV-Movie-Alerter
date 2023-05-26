const winston = require('winston');


module.exports = function() {
	try {
		process.on('uncaughtException', (e) => {
			winston.error(e.message, e);
		});
        
		process.on('unhandledRejection', (e) => {
			winston.error(e.message, e);
		});
        
		// winston.add(new winston.transports.File({ filename: 'logfile.log' }));
 
		winston.add(
			new winston.transports.Console({ 
				format: winston.format.combine(winston.format.prettyPrint())
			})
		);
	} catch(error) {}
};
