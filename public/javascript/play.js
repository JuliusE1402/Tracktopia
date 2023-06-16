const topTracksGameButton = document.getElementById("top-tracks-game-button");
const artistsGameButton = document.getElementById("artists-game-button");
const playlistGameButton = document.getElementById("playlist-game-button");
const randomTracksGameButton = document.getElementById(
	"random-tracks-game-button"
);

const baseUrl = "http://localhost:5500/";

let trackOptions = [];

topTracksGameButton.addEventListener("click", () => {
	location.href = "topTracksGame.html";
});

artistsGameButton.addEventListener("click", () => {
	location.href = "artistsGame.html";
});

playlistGameButton.addEventListener("click", () => {
	location.href = "playlistGame.html";
});

randomTracksGameButton.addEventListener("click", () => {
	location.href = "randomTracksGame.html";
});
