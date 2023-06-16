import { config } from "./config.js";

const listeningTime = document.getElementById("listening-time-selection");
const countdown = document.getElementById("countdown-selection");
const checkbox = document.getElementById("multiple-choice");
const playButton = document.getElementById("play-button");
const artistName = document.getElementById("artist");
const datalist = document.getElementById("artist-list");
const baseUrl = "http://localhost:5500/";

let optionListeningTime = 1;
let optionCountdown = 10;
let optionCheckbox = "false";

listeningTime.addEventListener("change", handleSelectChange);
countdown.addEventListener("change", handleSelectChange);
checkbox.addEventListener("change", handleSelectChange);

window.addEventListener("load", () => {
	artistName.innerHTML = "";
});

artistName.addEventListener("input", async () => {
	datalist.innerHTML = "";

	// Fetch artist suggestions from Last.fm API
	const response = await fetch(
		`https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistName.value}&api_key=${config.API_KEY}&format=json`
	);

	const data = await response.json();

	// Filter out options with multiple artists, undesirable characters, and non-artist names, and add remaining options to datalist
	data.results.artistmatches.artist
		.filter((artist) => {
			const invalidChars = ["/", "&", "feat", "vs", "feat.", "and", "ft", "+"];
			return (
				artist.listeners > 10000 &&
				artist.name.split(",").length === 1 &&
				!invalidChars.some((char) => artist.name.toLowerCase().includes(char))
			);
		})
		.forEach((artist) => {
			// Only add option if it doesn't already exist in the datalist
			if (
				![...datalist.options].some((option) => option.value === artist.name)
			) {
				const option = document.createElement("option");
				option.value = artist.name;
				datalist.appendChild(option);
			}
		});
});

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
}

playButton.addEventListener("click", () => {
	playButton.disable = "true";

	fetch(`${baseUrl}artistsGame`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			artistName: artistName.value,
			listeningTime: optionListeningTime,
			countdown: optionCountdown,
			checkbox: optionCheckbox,
			output: "artistTracks",
		}),
	})
		.then(() => {
			window.location.href = `${baseUrl}game?output=artistsGame`;
		})
		.catch((error) => {
			console.error("Error sending HTTP POST request:", error);
		});
});
