const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema(
	{
		movieId: {
			type: String,
			// required: true
		},
		name: {
			type: String
		},
		strippedName: {
			type: String
		},
		types: {},
		isNotified: {
			type: Boolean,
			default: false
		}
	}, { timestamps: true }
);


exports.Movie = mongoose.model('Movie', movieSchema);
