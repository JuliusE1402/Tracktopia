function getMostStreamedArtist(spotifyApi, time_span, req) {
	return new Promise((resolve, reject) => {
		let usersMostStreamedArtists = [];
		spotifyApi
			.getMyTopArtists({ time_range: time_span, limit: 50, offset: 0 })
			.then(
				function (data) {
					for (let i = 0; i < data.body.items.length; i++) {
						usersMostStreamedArtists[i] = {
							name: data.body.items[i].name,
							image: data.body.items[i].images[2].url,
							url: data.body.items[i].external_urls.spotify,
						};
					}

					req.session.usersMostStreamedArtists = usersMostStreamedArtists;
					resolve(); // Resolve the promise since the operation is successful
				},
				function (err) {
					console.log("Something went wrong!", err);
					reject(err); // Reject the promise with the error
				}
			);
	});
}

module.exports = {
	getMostStreamedArtist: getMostStreamedArtist,
};
