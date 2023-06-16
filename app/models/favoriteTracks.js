function getMostStreamedTracks(spotifyApi, time_span, songLimit, req) {
	return new Promise((resolve, reject) => {
		spotifyApi
			.getMyTopTracks({ time_range: time_span, limit: songLimit, offset: 0 })
			.then(function (data) {
				let usersMostStreamedTracks = [];
				for (let i = 0; i < data.body.items.length; i++) {
					usersMostStreamedTracks[i] = {
						id: data.body.items[i].id,
						title: data.body.items[i].name,
						url: data.body.items[i].external_urls.spotify,
						previewLink: data.body.items[i].preview_url,
						artist: data.body.items[i].artists[0].name,
						image: data.body.items[i].album.images[0].url,
					};
				}
				req.session.usersMostStreamedTracks = usersMostStreamedTracks; // Store the tracks in the session
				resolve(usersMostStreamedTracks); // Resolve the promise with the result
			})
			.catch(function (err) {
				console.log("Something went wrong!", err);
				reject(err); // Reject the promise with the error
			});
	});
}

module.exports = {
	getMostStreamedTracks: getMostStreamedTracks,
};
