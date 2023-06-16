const playlistSection = document.getElementById("playlist-selection");
const timePeriod = document.getElementById("time-span-selection");
const listeningTime = document.getElementById("listening-time-selection");
const countdown = document.getElementById("countdown-selection");
const checkbox = document.getElementById("multiple-choice");
const playButton = document.getElementById("play-button");

const baseUrl = "http://localhost:5500/";

let optionListeningTime = 1;
let optionCountdown = 10;
let optionCheckbox = "false";

window.addEventListener("load", getInfoPlaylists);

playlistSection.addEventListener("change", handlePlaylistSelection);
listeningTime.addEventListener("change", handleSelectChange);
countdown.addEventListener("change", handleSelectChange);
checkbox.addEventListener("change", handleSelectChange);

function getInfoPlaylists() {
	playlistSection.innerHTML = "";
	setTimeout(() => {
		fetch(baseUrl + "getPlaylists", {
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => {
				for (let i = 0; i < data.length; i++) {
					const option = document.createElement("option");
					const playlist = data[i];
					option.innerHTML = playlist.name + `(${playlist.total} tracks)`;
					option.value = playlist.id;
					playlistSection.appendChild(option);
				}
				playlistSection.addEventListener("change", handlePlaylistSelection);
				handlePlaylistSelection(); // Call the function once to initialize the selectedPlaylistID
			})
			.catch((error) => {
				console.error(error);
			});
	}, 500);
}

function handlePlaylistSelection() {
	selectedPlaylistID = playlistSection.value;
}

function handleSelectChange(event) {
	const selectedOption = event.target.value;

	// Update the listening time option and select the corresponding dropdown menu option
	if (selectedOption === "1second") {
		optionListeningTime = 1;
		listeningTime.selectedIndex = 0;
	} else if (selectedOption === "3seconds") {
		optionListeningTime = 3;
		listeningTime.selectedIndex = 1;
	} else if (selectedOption === "5seconds") {
		optionListeningTime = 5;
		listeningTime.selectedIndex = 2;
	} else if (selectedOption === "10seconds") {
		optionListeningTime = 10;
		listeningTime.selectedIndex = 3;
	} else if (selectedOption === "15seconds") {
		optionListeningTime = 15;
		listeningTime.selectedIndex = 4;
	}

	// Update the countdown option and select the corresponding dropdown menu option
	if (selectedOption === "10seconds") {
		optionCountdown = 10;
		countdown.selectedIndex = 0;
	} else if (selectedOption === "20seconds") {
		optionCountdown = 20;
		countdown.selectedIndex = 1;
	} else if (selectedOption === "30seconds") {
		optionCountdown = 30;
		countdown.selectedIndex = 2;
	} else if (selectedOption === "40seconds") {
		optionCountdown = 40;
		countdown.selectedIndex = 3;
	}

	// Update the checkbox option
	optionCheckbox = checkbox.checked ? "true" : "false";

	console.log(
		selectedPlaylistID,
		optionListeningTime,
		optionCountdown,
		optionCheckbox
	);
}

playButton.addEventListener("click", () => {
	playButton.disable = "true";

	fetch(`${baseUrl}playlistGame`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			playlistID: selectedPlaylistID,
			listeningTime: optionListeningTime,
			countdown: optionCountdown,
			checkbox: optionCheckbox,
			output: "playlistTracks",
		}),
	})
		.then(() => {
			window.location.href = `${baseUrl}game?output=playlistGame`;
		})
		.catch((error) => {
			console.error("Error sending HTTP POST request:", error);
		});
});
