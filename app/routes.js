const session = require("express-session");
const querystring = require("querystring");
const request = require("request");
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const favoriteTracks = require("./models/favoriteTracks");
const favoriteArtists = require("./models/favoriteArtists");
const getUsersPlaylists = require("./models/getUsersPlaylist");
const tracksFromPlaylist = require("./models/getTracksFromPlaylist");
const getRandomTrack = require("./models/getRandomTrack");
const getArtistsTracks = require("./models/getAllTracksByArtist");
const getAllTracksByArtist = require("./models/getAllTracksByArtist");

var artistName;
var playlistID;
var timePeriod;
var listeningTime;
var countdown;
var checkbox;

var redirect_uri = `http://localhost:${process.env.PORT}/callback`;
var domain = `http://localhost:${process.env.PORT}/`;

var topTracksGame = {};


module.exports = function (app) {
	function generateRandomString(length) {
		let result = "";
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < length) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	}

	//session management
	app.use(
		session({
			secret: "your-secret-key",
			resave: false,
			saveUninitialized: true,
		})
	);

	app.get("/login", function (req, res) {
		var state = generateRandomString(16);
		var scope =
			"user-read-private user-top-read playlist-read-private playlist-read-collaborative playlist-modify-public";

		res.redirect(
			"https://accounts.spotify.com/authorize?" +
				querystring.stringify({
					response_type: "code",
					client_id: process.env.CLIENT_ID,
					scope: scope,
					redirect_uri: redirect_uri,
					state: state,
				})
		);
	});

	app.get("/callback", function (req, res) {
		var code = req.query.code || null;
		var state = req.query.state || null;

		if (state === null) {
			res.redirect(
				"/#" +
					querystring.stringify({
						error: "state_mismatch",
					})
			);
		} else {
			var authOptions = {
				url: "https://accounts.spotify.com/api/token",
				form: {
					code: code,
					redirect_uri: redirect_uri,
					grant_type: "authorization_code",
				},
				headers: {
					Authorization:
						"Basic " +
						new Buffer.from(
							process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
						).toString("base64"),
				},
				json: true,
			};
			request.post(authOptions, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					req.session.access_token = body.access_token;

					res.redirect(`${domain}home.html`);
				} else {
					res.redirect(`${domain}index.html`);
				}
			});
		}
	});

	app.get("/stats", function (req, res) {
		const timeSpan = req.query.timeSpan;
		const access_token = req.session.access_token;
	
		const spotifyApi = new SpotifyWebApi({
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			redirectUri: redirect_uri,
			accessToken: access_token, // Use the access token from the session
		});
	
		favoriteArtists
			.getMostStreamedArtist(spotifyApi, timeSpan, req)
			.then(() => {
				favoriteTracks
					.getMostStreamedTracks(spotifyApi, timeSpan, 50, req)
					.then(() => {
						res.redirect(`${domain}stats.html`);
					})
					.catch((err) => {
						console.log("Error getting favorite tracks:", err);
						res.redirect("index.html");
					});
			})
			.catch((err) => {
				console.log("Error getting favorite artist:", err);
				res.redirect("index.html");
			});
	});
	

	app.get("/favoriteTracks", (req, res) => {
		const usersMostStreamedTracks = req.session.usersMostStreamedTracks || [];
		res.json(usersMostStreamedTracks);
	});

	app.get("/favoriteArtists", (req, res) => {
		const usersMostStreamedArtists = req.session.usersMostStreamedArtists || [];
		res.json(usersMostStreamedArtists);
	});

	app.get("/getPlaylists", (req, res) => {
		const usersPlaylists = req.session.usersPlaylists || [];
		res.json(usersPlaylists);
	});

	app.get("/artistTracks", (req, res) => {
		const artistsTracks = req.session.artistsTracks;
		res.json(artistsTracks);
	});

	app.get("/playlistTracks", (req, res) => {
		const playlistTracks = req.session.playlistTracks || [];
		res.json(playlistTracks);
	});

	app.get("/randomTrack", (req, res) => {
		const randomTrack = req.session.randomTrack || [];
		res.json(randomTrack);
	});

	app.get("/play", async (req, res) => {
		const access_token = req.session.access_token;

		await getUsersPlaylists.getPlaylists(
			new SpotifyWebApi({
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				redirectUri: redirect_uri,
				accessToken: access_token, // Use the access token from the session
			}),
			0,
			req
		);

		res.redirect(`${domain}play.html`);
	});

	app.post("/topTracksGame", async (req, res) => {
		try {
			timePeriod = req.body.timePeriod;
			listeningTime = req.body.listeningTime;
			countdown = req.body.countdown;
			checkbox = req.body.checkbox;
			output = req.body.output;

			topTracksGame = req.body;

			const access_token = req.session.access_token;

			await favoriteTracks.getMostStreamedTracks(
				new SpotifyWebApi({
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					redirectUri: redirect_uri,
					accessToken: access_token, // Use the access token from the session
				}),
				topTracksGame.timePeriod,
				50,
				req
			);

			// Once all the tasks are finished, send the response
			res.send();
		} catch (error) {
			// Handle any errors that occurred during the processing
			console.error(error);
			res.status(500).send("An error occurred.");
		}
	});

	app.post("/artistsGame", async (req, res) => {
		try {
			artistName = req.body.artistName;
			listeningTime = req.body.listeningTime;
			countdown = req.body.countdown;
			checkbox = req.body.checkbox;
			output = req.body.output;

			topTracksGame = req.body;

			const access_token = req.session.access_token;

			await getArtistsTracks.getTracksFromArtist(
				new SpotifyWebApi({
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					redirectUri: redirect_uri,
					accessToken: access_token, // Use the access token from the session
				}),
				artistName,
				req
			);

			// Once all the tasks are finished, send the response
			res.send();
		} catch (error) {
			// Handle any errors that occurred during the processing
			console.error(error);
			res.status(500).send("An error occurred.");
		}
	});

	app.post("/playlistGame", async (req, res) => {
		try {
			playlistID = req.body.playlistID;
			timePeriod = req.body.timePeriod;
			listeningTime = req.body.listeningTime;
			countdown = req.body.countdown;
			checkbox = req.body.checkbox;
			output = req.body.output;

			topTracksGame = req.body;

			const access_token = req.session.access_token;

			await tracksFromPlaylist.getTracksFromPlaylist(
				new SpotifyWebApi({
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					redirectUri: redirect_uri,
					accessToken: access_token, // Use the access token from the session
				}),
				topTracksGame.playlistID,
				req
			);

			// Once all the tasks are finished, send the response
			res.send();
		} catch (error) {
			// Handle any errors that occurred during the processing
			console.error(error);
			res.status(500).send("An error occurred.");
		}
	});

	app.post("/randomTracksGame", async (req, res) => {
		try {
			listeningTime = req.body.listeningTime;
			countdown = req.body.countdown;
			checkbox = req.body.checkbox;
			output = req.body.output;

			topTracksGame = req.body;

			const access_token = req.session.access_token;

			await getRandomTrack.getRandomTrack(
				new SpotifyWebApi({
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					redirectUri: redirect_uri,
					accessToken: access_token, // Use the access token from the session
				}),
				req
			);

			// Once all the tasks are finished, send the response
			res.send();
		} catch (error) {
			// Handle any errors that occurred during the processing
			console.error(error);
			res.status(500).send("An error occurred.");
		}
	});

	app.get("/game", (req, res) => {
		try {
			const queryParams = new URLSearchParams({
				artistName: artistName,
				playlistID: playlistID,
				timePeriod: timePeriod,
				listeningTime: listeningTime,
				countdown: countdown,
				checkbox: checkbox,
				output: output,
			});

			res.redirect(`${domain}game.html?${queryParams}`);
		} catch (error) {
			console.error(error);
			res.status(500).send("Something went wrong");
		}
	});
};
