const cron = require('node-cron');
const winston = require('winston');
const telegram = require('../services/telegram.service');
const rewardsCronJob = require('../repository/cron-jobs/rewards.cron-job');


// At 03:00 AM (IST) (9:30 PM UST)
cron.schedule('30 21 * * *', async function() {
	await rewardsCronJob.expireRewards();

	telegram('CRON JOB - EXPIRE REWARDS', 'cron_job');
	winston.log('CRON JOB - EXPIRE REWARDS');
});
