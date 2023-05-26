const axios = require('axios');
const config = require('../config/config');


/**
 * Telegram notification (HTML message format)  
 * @param {string} message 
 * @param {string} group  
 */
exports.sendMessage = async (message) => {
	try {
		if (!message) return null;

		const chatId = config.telegramChatId;
		const apiKey = config.telegramAPIKey;

        const response = await axios.post(
			`https://api.telegram.org/bot${apiKey}/sendMessage?parse_mode=HTML`,
			{
				'chat_id': chatId,
				'text': message
			}
		);

        if (response.status != 200) return null;

        return 'success';
	} catch (error) {
		console.log('Telegram Service Error');

		return null;
	}
};
