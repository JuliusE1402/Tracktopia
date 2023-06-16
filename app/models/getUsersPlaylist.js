async function getPlaylists(spotifyApi, offset, req) {
	try {
		const data = await spotifyApi.getUserPlaylists({
			limit: 50,
			offset: offset,
		});

		const usersPlaylists = data.body.items.map((item) => ({
			name: item.name,
			id: item.id,
			total: item.tracks.total,
		}));

		if (offset === 0) {
			req.session.usersPlaylists = usersPlaylists;
		} else {
			req.session.usersPlaylists =
				req.session.usersPlaylists.concat(usersPlaylists);
		}

		if (data.body.next) {
			const nextOffset = offset + 50;
			await getPlaylists(spotifyApi, nextOffset, req); // retrieve next set of playlists
		}
	} catch (error) {
		console.error("Error retrieving user playlists: ", error);
	}
}

module.exports = {
	getPlaylists: getPlaylists,
};
