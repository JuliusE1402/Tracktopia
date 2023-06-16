function getTracksFromPlaylist(spotifyApi, playlistID, req) {
	return new Promise((resolve, reject) => {
		let offset = 0;
		let playlistTracks = [];

		const getPlaylistTracksRecursive = () => {
			spotifyApi
				.getPlaylistTracks(playlistID, {
					offset: offset,
					limit: 100,
					fields: "items",
				})
				.then(function (data) {
					for (let i = 0; i < data.body.items.length; i++) {
						playlistTracks[offset + i] = {
							id: data.body.items[i].track.id,
							title: data.body.items[i].track.name,
							url: data.body.items[i].track.external_urls.spotify,
							previewLink: data.body.items[i].track.preview_url,
							artist: data.body.items[i].track.artists[0].name,
							image: data.body.items[i].track.album.images[0].url,
						};
					}
					offset += 100;
					if (data.body.items.length < 100) {
						req.session.playlistTracks = playlistTracks;
						resolve(playlistTracks); // Resolve the promise with the result
					} else {
						getPlaylistTracksRecursive(); // Call the function recursively to fetch the next set of tracks
					}
				})
				.catch(function (err) {
					console.log("Something went wrong!", err);
					reject(err); // Reject the promise with the error
				});
		};

		getPlaylistTracksRecursive(); // Start fetching tracks recursively
	});
}

module.exports = {
	getTracksFromPlaylist: getTracksFromPlaylist,
};
