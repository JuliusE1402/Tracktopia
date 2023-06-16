const listeningTime = document.getElementById("listening-time-selection");
const countdown = document.getElementById("countdown-selection");
const checkbox = document.getElementById("multiple-choice");
const playButton = document.getElementById("play-button");

const baseUrl = "http://localhost:5500/";

let optionListeningTime = 1;
let optionCountdown = 10;
let optionCheckbox = "false";

listeningTime.addEventListener("change", handleSelectChange);
countdown.addEventListener("change", handleSelectChange);
checkbox.addEventListener("change", handleSelectChange);

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

	console.log(optionListeningTime, optionCountdown, optionCheckbox);
}

playButton.addEventListener("click", () => {
	playButton.disable = "true";

	fetch(`${baseUrl}randomTracksGame`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			listeningTime: optionListeningTime,
			countdown: optionCountdown,
			checkbox: optionCheckbox,
			output: "randomTrack",
		}),
	})
		.then(() => {
			window.location.href = `${baseUrl}game?output=randomTracksGame`;
		})
		.catch((error) => {
			console.error("Error sending HTTP POST request:", error);
		});
});
