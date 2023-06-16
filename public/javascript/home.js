const statsButton = document.getElementById("stats-button");
const githubButton = document.getElementById("github-button");
const playButton = document.getElementById("play-button");

localStorage.setItem("selectionIndex", 0);
localStorage.setItem("statSelection", "tracks");

statsButton.addEventListener("click", () => {
	location.href = "stats?timeSpan=long_term";
});

githubButton.addEventListener("click", () => {
	window.open("https://github.com/JuliusE1402/spotify_quiz", "_blank");
});

playButton.addEventListener("click", () => {
	location.href = "play";
});
