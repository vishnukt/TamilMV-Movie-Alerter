const cron = require('node-cron');
const winston = require('winston');
const { tamilMvMovieFinder } = require('../repository/tamilMV/tamilMV.functions');
const config = require('../config/config');


// Schedule Cron Job only if Cron Env variable is set
if (config.cronJobIntervalInMinutes) {
	cron.schedule(`*/${config.cronJobIntervalInMinutes} * * * *`, async function() {
		winston.info('CRON JOB - Find TamilMV Movies - Started');

		await tamilMvMovieFinder();

		winston.info('CRON JOB - Find TamilMV Movies - Ended');
	});
}
