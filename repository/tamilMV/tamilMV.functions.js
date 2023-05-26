const telegram = require('../../services/telegram.service');
const { Movie } = require('../../models/movie');
const config = require('../../config/config');
const axios = require('axios');
const cheerio = require('cheerio');
const winston = require('winston');


/**
 * Parses Movie Id from Movie Url
 * @param {string} movieUrl 
 * @returns {string}
 */
function parseMovieId(movieUrl) {
	try {
		return movieUrl.split('/').pop().split('-')[0];
	} catch {
		return null;
	}
}


/**
 * Filters array of strings w.r.t search string
 * @param {array} array 
 * @param {string} filterString 
 * @returns {array}
 */
function filterArrayOfStrings(array, filterString) {
	try {
		return array.filter(
			(item) => {
				if (item && item.search(filterString) != -1) return true;

				return false;
			}
		);
	} catch {
		return [];
	}
}


/**
 * Finds newly published Movies & Links from TamilMV and sends to telegram group
 * @returns {Object} newMovies
 */
exports.tamilMvMovieFinder = async () => {
    try {
        try {
            var { data } = await axios.get('https://www.1tamilmv.autos/', { headers: config.axiosHeader });
        } catch(error) {
            winston.error('tamilMvMovieFinder Function - Error in fetching tamilmv mainpage API');

            telegram.sendMessage('tamilMvMovieFinder Function - Error in fetching tamilmv mainpage API');

            return null;
        }

        const $ = cheerio.load(data);

        // Fetching individual movie details page urls for fetching magnet links
        let movieUrls = $('.ipsWidget_inner.ipsPad.ipsType_richText a').get().map(x => $(x).attr('href'));

        // Fetching saved movies
        let movies = []//await Movie.find({}, 'movieId isNotified').sort('-_id').limit(20).lean();

        let savedMovieIds = {};
        movies.forEach(item => {
            savedMovieIds[item.movieId] = item.isNotified;
        });

        let movieDetails = {};
         // Bulk Save Telegram Notified Movies to DB
        let movieBulkSave = [];

        await movieUrls.forEach(async (item) => {
            let movieId = parseMovieId(item);

            // winston.info(`MovieId: ${movieId}`);

            if (savedMovieIds[movieId]) return;

            try {
                var { data } = await axios.get(item, { headers: config.axiosHeader });
            } catch(error) {
                // winston.info(`Error in fetching tamilmv movie API, ${item}`);

                return;
            }

            let S = cheerio.load(data);

            let movieName = S('.ipsType_break.ipsContained span').text();

            // winston.info(`MovieName: ${movieName}`);

            let movieQualityNames =  S('.cPost_contentWrap a').get().map(x => $(x).text());
            let movieMagnetLinks = S('.cPost_contentWrap a').get().map(x => $(x).attr('href'));

            let strippedMovieName = movieName.split(' (')[0];
            let telegramMessage = `<b><a href='${item}'>${movieName}</a></b>\n\n\n`;
            console.log('aaaa', telegramMessage)

            movieQualityNames = filterArrayOfStrings(movieQualityNames, strippedMovieName);
            movieMagnetLinks = filterArrayOfStrings(movieMagnetLinks, 'magnet:');

            movieDetails[movieId] = { 
                name: movieName,
                link: item,
                magnetLinks: [] 
            };

            console.log(movieDetails)

            // Skip Movies with no magnet links
            if (!movieMagnetLinks.length) return;

            await movieMagnetLinks.forEach((item, index) => {
                movieDetails[movieId].magnetLinks.push({
                    name: movieQualityNames[index],
                    url: item
                });

                telegramMessage = telegramMessage + `${movieQualityNames[index]}<a href='https://mvrff5.deta.dev/?url=${encodeURIComponent(item)}'> Magnet Link 🧲</a>\n\n`;
            });

            let telegramResponse = await telegram.sendMessage(telegramMessage);

            if (telegramResponse) {
                movieBulkSave.push(new Movie({
                    movieId: movieId,
                    name: movieName,
                    strippedName: strippedMovieName,
                    types: movieDetails[movieId].links
                }));
            }
        });

        // Saving to DB
        // if (movieBulkSave.length) await Movie.insertMany(movieBulkSave);

        return movieDetails;
    } catch(error) {
        winston.error('tamilMvMovieFinder function error', error);

        telegram.sendMessage('tamilMvMovieFinder function error', 'gideon');

        return null;
    }
};
