function getTracksFromArtist(spotifyApi, artistName, req) {
	return new Promise((resolve, reject) => {
		let artistsTracks = [];
		spotifyApi
			.searchArtists(artistName)
			.then(function (data) {
				const artist = data.body.artists.items[0];
				return spotifyApi.getArtistTopTracks(artist.id, "US");
			})
			.then(function (data) {
				for (let i = 0; i < data.body.tracks.length; i++) {
					artistsTracks[i] = {
						id: data.body.tracks[i].id,
						title: data.body.tracks[i].name,
						url: data.body.tracks[i].external_urls.spotify,
						previewLink: data.body.tracks[i].preview_url,
						artist: data.body.tracks[i].artists[0].name,
						image: data.body.tracks[i].album.images[0].url,
					};
				}
				req.session.artistsTracks = artistsTracks;
				resolve(artistsTracks);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}

module.exports = {
	getTracksFromArtist: getTracksFromArtist,
};
