const axios = require('axios');
const cheerio = require('cheerio');
const winston = require('winston');
const stringSimilarity = require("string-similarity");
const telegram = require('../../services/telegram.service');
const { Movie } = require('../../models/movie');
const config = require('../../config/config');


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
 * Check if a String contains similar name
 * @param {string} string 
 * @param {string} comparingString 
 * @returns {boolean} boolean
 */
function isStringSimilar(string, comparingString) {
    try {
        let strings = string.split(' ');

        for (let item of strings) {
            if (stringSimilarity.compareTwoStrings(item, comparingString) > 0.3) return true;
        }

        return false;
    } catch(error) {
        return false;
    }
}


/**
 * Filters array of strings w.r.t search string
 * @param {array} array 
 * @param {string} filterString 
 * @param {boolean} checkSimilar
 * @returns {array} array
 */
function filterArrayOfStrings(array, filterString, checkSimilar=false) {
	try {
		return array.filter(
			(item) => {
                if (!item) return false;

				if (item.search(filterString) != -1) return true;
                else if (checkSimilar && isStringSimilar(item, filterString)) return true;

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
        winston.info('tamilMvMovieFinder func call started');

        try {
            var { data } = await axios.get('https://www.1tamilmv.autos/', { headers: config.axiosHeader });
        } catch(error) {
            winston.error('tamilMvMovieFinder Function - Error in fetching tamilmv mainpage API');

            // telegram.sendMessage('tamilMvMovieFinder Function - Error in fetching tamilmv mainpage API');

            return null;
        }

        const $ = cheerio.load(data);

        // Fetching individual movie details page urls for fetching magnet links
        let movieUrls = $('.ipsWidget_inner.ipsPad.ipsType_richText a').get().map(x => $(x).attr('href'));

        // Fetching saved movies
        let movies = await Movie.find({ isNotified: true }, 'movieId isNotified').sort('-_id').limit(20).lean();

        let savedMovieIds = {};
        movies.forEach(item => { savedMovieIds[item.movieId] = item.isNotified; });

        // Bulk Save Telegram Notified Movies to DB
        let movieBulkSave = [];

        let movieDetails = {};

        for (let item of movieUrls) {

            let movieId = parseMovieId(item);

            // winston.info(`MovieId: ${movieId}`);

            // Skip Rest Movies - assuming preceding items are already notified
            if (savedMovieIds[movieId]) break; // continue;

            try {
                var { data } = await axios.get(item, { headers: config.axiosHeader });
            } catch(error) {
                winston.info(`Error in fetching tamilmv movie API, ${item}`);

                continue;
            }

            let S = cheerio.load(data);

            let movieName = S('.ipsType_break.ipsContained span').text();

            // winston.info(`MovieName: ${movieName}`);

            let movieQualityNames =  S('.cPost_contentWrap a').get().map(x => $(x).text());
            let movieMagnetLinks = S('.cPost_contentWrap a').get().map(x => $(x).attr('href'));

            let strippedMovieName = movieName.split(' (')[0];
            let telegramMessage = `<b><a href='${item}'>${movieName}</a></b>\n\n\n`;

            movieQualityNames = filterArrayOfStrings(movieQualityNames, strippedMovieName, true);
            movieMagnetLinks = filterArrayOfStrings(movieMagnetLinks, 'magnet:');

            movieDetails[movieId] = {
                name: movieName,
                link: item,
                magnetLinks: [] 
            };

            // Skip Movies with no magnet links
            if (!movieMagnetLinks.length) continue;

            movieMagnetLinks.forEach((item, index) => {
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
                    types: movieDetails[movieId].links,
                    isNotified: true
                }));
            }
        }

        // Saving to DB
        if (movieBulkSave.length) await Movie.insertMany(movieBulkSave);

        winston.info('tamilMvMovieFinder func call ended');

        return movieDetails;
    } catch(error) {
        winston.error('tamilMvMovieFinder function error', error);

        // telegram.sendMessage('tamilMvMovieFinder function error');

        return null;
    }
};
