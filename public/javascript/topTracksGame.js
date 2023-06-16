const timePeriod = document.getElementById("time-span-selection");
const listeningTime = document.getElementById("listening-time-selection");
const countdown = document.getElementById("countdown-selection");
const checkbox = document.getElementById("multiple-choice");
const playButton = document.getElementById("play-button");

let baseUrl = "http://localhost:5500/";

let optionTimePeriod = "long_term";
let optionListeningTime = 1;
let optionCountdown = 10;
let optionCheckbox = "false";

window.addEventListener("load", handleSelectChange);

timePeriod.addEventListener("change", handleSelectChange);
listeningTime.addEventListener("change", handleSelectChange);
countdown.addEventListener("change", handleSelectChange);
checkbox.addEventListener("change", handleSelectChange);

playButton.addEventListener("click", () => {
	playButton.disable = "true";

	// Send the updated options to the server
	fetch(`${baseUrl}topTracksGame`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			timePeriod: optionTimePeriod,
			listeningTime: optionListeningTime,
			countdown: optionCountdown,
			checkbox: optionCheckbox,
			output: "favoriteTracks",
		}),
	})
		.then(() => {
			window.location.href = `${baseUrl}game?output=topTracksGame`;
		})
		.catch((error) => {
			console.error("Error sending HTTP POST request:", error);
		});
});

function handleSelectChange(event) {
	const selectedOption = event.target.value;

	// Update the time period option and select the corresponding dropdown menu option
	if (selectedOption == "long_term") {
		optionTimePeriod = "long_term";
		timePeriod.selectedIndex = 0;
	} else if (selectedOption == "medium_term") {
		optionTimePeriod = "medium_term";
		timePeriod.selectedIndex = 1;
	} else if (selectedOption == "short_term") {
		optionTimePeriod = "short_term";
		timePeriod.selectedIndex = 2;
	}

	// Update the listening time option and select the corresponding dropdown menu option
	if (selectedOption == "1second") {
		optionListeningTime = 1;
		listeningTime.selectedIndex = 0;
	} else if (selectedOption == "3seconds") {
		optionListeningTime = 3;
		listeningTime.selectedIndex = 1;
	} else if (selectedOption == "5seconds") {
		optionListeningTime = 5;
		listeningTime.selectedIndex = 2;
	} else if (selectedOption == "10seconds") {
		optionListeningTime = 10;
		listeningTime.selectedIndex = 3;
	} else if (selectedOption == "15seconds") {
		optionListeningTime = 15;
		listeningTime.selectedIndex = 4;
	}

	// Update the countdown option and select the corresponding dropdown menu option
	if (selectedOption == "10seconds") {
		optionCountdown = 10;
		countdown.selectedIndex = 0;
	} else if (selectedOption == "20seconds") {
		optionCountdown = 20;
		countdown.selectedIndex = 1;
	} else if (selectedOption == "30seconds") {
		optionCountdown = 30;
		countdown.selectedIndex = 2;
	} else if (selectedOption == "40seconds") {
		optionCountdown = 40;
		countdown.selectedIndex = 3;
	}

	// Update the checkbox option
	if (checkbox.checked) {
		optionCheckbox = true;
	} else {
		optionCheckbox = false;
	}
}
