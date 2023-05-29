module.exports = {
	axiosHeader: {
		'accept-encoding': '*',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
	},
	dbUrl: process.env.dbUrl,
	telegramAPIKey: process.env.telegramAPIKey,
	telegramChatId: process.env.telegramChatId,
	cronJobIntervalInMinutes: process.env.cronJobIntervalInMinutes
};
