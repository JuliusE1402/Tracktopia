function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomChar() {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const randomIndex = Math.floor(Math.random() * characters.length);
	return characters[randomIndex];
}

function getRandomTrack(spotifyApi, req) {
	return new Promise((resolve, reject) => {
		const promises = [];
		let randomTrack = [];
		for (let i = 0; i < 20; i++) {
			const promise = spotifyApi
				.searchTracks(getRandomChar(), {
					limit: 1,
					offset: getRandomInt(0, 999),
				})
				.then(function (data) {
					randomTrack[i] = {
						id: data.body.tracks.items[0].id,
						title: data.body.tracks.items[0].name,
						url: data.body.tracks.items[0].external_urls.spotify,
						previewLink: data.body.tracks.items[0].preview_url,
						artist: data.body.tracks.items[0].artists[0].name,
						image: data.body.tracks.items[0].album.images[0].url,
					};
				})
				.catch(function (err) {
					console.log("Something went wrong!", err);
					reject(err); // Reject the promise with the error
				});
			promises.push(promise);
		}
		Promise.all(promises)
			.then(() => {
				req.session.randomTrack = randomTrack;
			})
			.then(() => resolve(randomTrack))
			.catch((err) => reject(err));
	});
}

module.exports = {
	getRandomTrack: getRandomTrack,
};
