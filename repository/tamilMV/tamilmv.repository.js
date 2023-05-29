const winston = require('winston');
const Response = require('../../middlewares/response');
const telegram = require('../../services/telegram.service');
const { tamilMvMovieFinder } = require('./tamilMV.functions');


/**
 * Finds newly published Movies & Links from TamilMV and sends to telegram group
 * @returns {boolean}
 */
exports.listTamilMVLatestMovies = async (req, res, next) => {
    try {
        const tamilMvMovieFinderResponse = await tamilMvMovieFinder();

        if (!tamilMvMovieFinderResponse) {
            winston.info('Error in finding tamilmv movies');

            let response = Response('error');
            return res.status(response.statusCode).send(response);
        }

        let response = Response('success', '', { newMovies: tamilMvMovieFinderResponse });
		return res.status(response.statusCode).send(response);
    } catch(error) {
        winston.error('tamilMvMovieFinder function error', error);

        telegram.sendMessage('tamilMvMovieFinder function error');

        let response = Response('error');
		return res.status(response.statusCode).send(response);
    }
};
