const textField = document.getElementById("text-field");
const winLoseIndicator = document.getElementById("win-lose");
const trackAudio = document.getElementById("track-audio-box");
const submitButton = document.getElementById("submit-button");
const modal = document.getElementById("modal");
const nextButton = document.getElementById("next-button");
const img = document.getElementById("image-of-song");
const anchor = document.getElementById("link-of-image");
const paragraph = document.getElementById("solution-text");
const audioPlayer = document.getElementById("solution-audio");
const exitButton = document.getElementById("exit-button");
const resultModal = document.getElementById("result-modal");
const roundCounter = document.getElementById("round-counter");
const resultScore = document.getElementById("result-score");
const playAgainButton = document.getElementById("play-again");
const finalExitButton = document.getElementById("final-exit-button");
const twitterGithubParagraph = document.getElementById("twitter-github");
const notPlayable = document.getElementById("not-playable");
const chooseAnotherMode = document.getElementById("choose-another-mode");

const queryParams = new URLSearchParams(window.location.search);

const gameModeQuery = queryParams.get("output");
const playlistID = queryParams.get("playlistID");
const timePeriod = queryParams.get("timePeriod");
const listeningTime = queryParams.get("listeningTime");
const countdown = queryParams.get("countdown");
const checkbox = queryParams.get("checkbox");

const audio = document.createElement("audio-player");

let baseUrl = "http://localhost:5500/";
let gameTracks = [];
const sayings = [
	"You listen to this song all the time, but you did not get this?",
	"You listen to this song constantly, yet you didn't catch that?",
	"How can you play this track on repeat and not get it?",
	"You've heard this song countless times, but it didn't click?",
	"You've been jamming to this tune, but it didn't register?",
	"You've been immersed in this song, yet it didn't sink in?",
	"You've had this on repeat, but it didn't resonate with you?",
	"You've been hooked on this track, but it slipped past you?",
	"You've been vibing to this music, but missed the essence?",
	"You've been rocking out to this, but missed its essence?",
	"You've been grooving to this beat, yet missed its essence?",
];
const sayingsCountdown = [
	"You snooze, you lose.",
	"Missed the mark with your turtle-like speed.",
	"The world moved on while you took your time.",
	"Too slow to catch the train of opportunity.",
	"You were a turtle in a hare's race.",
	"Snail's pace won't get you far.",
	"Time outran your sluggish progress.",
	"You lagged behind while others sprinted ahead.",
	"You were dragging your feet while others soared.",
	"Slow and steady doesn't always win the race.",
];

let randomNumber;
let roundCount = 1;
let previousNumbers = [];
let score = 0;
let timeOut;

localStorage.setItem("round", roundCount);

function nextRound() {
	let previousNumber = parseInt(localStorage.getItem("randomNumber")); // Get the previous random number
	previousNumbers[parseInt(localStorage.getItem("round")) - 1] = parseInt(
		localStorage.getItem("randomNumber")
	);
	let newNumber = getRandomNumber(gameTracks.length);

	// Generate a new random number until it's different from the previous one
	while (previousNumbers.includes(newNumber)) {
		newNumber = getRandomNumber(gameTracks.length);
	}

	randomNumber = newNumber;

	if (parseInt(localStorage.getItem("round")) === 5) {
		modal.close();
		resultScore.innerHTML = `You had ${score}/5 tracks right!`;
		resultScore.style.color = "black";
		resultScore.style.fontSize = "20px";
		resultScore.style.textAlign = "left";

		twitterGithubParagraph.style.color = "black";

		resultModal.style.backgroundColor = "rgba(60, 138, 255, 1)";
		resultModal.showModal();
	} else {
		roundCounter.innerHTML = `Round: ${
			parseInt(localStorage.getItem("round")) + 1
		}`;
		localStorage.setItem("round", parseInt(localStorage.getItem("round")) + 1);
		localStorage.setItem("randomNumber", newNumber); // Store the new random number
		modal.close();
		game(countdown, newNumber);
	}
}

function reloadRound() {
	let previousNumber = parseInt(localStorage.getItem("randomNumber")); // Get the previous random number
	previousNumbers[parseInt(localStorage.getItem("round")) - 1] = parseInt(
		localStorage.getItem("randomNumber")
	);
	let newNumber = getRandomNumber(gameTracks.length);

	// Generate a new random number until it's different from the previous one
	while (previousNumbers.includes(newNumber)) {
		newNumber = getRandomNumber(gameTracks.length);
	}

	randomNumber = newNumber;

	localStorage.setItem("randomNumber", newNumber); // Store the new random number

	game(countdown, newNumber);
}

function checkPreviewLinks() {
	let count = 0;
	for (let i = 0; i < gameTracks.length; i++) {
		if (gameTracks[i].previewLink !== null) {
			count++;
		}
	}
	return count >= 5;
}

function game(countdown, numberForArray) {
	if (gameTracks[numberForArray] && gameTracks[numberForArray].previewLink) {
		audio.setAttribute("src", `${gameTracks[numberForArray].previewLink}`);
		audio.setAttribute("bar-width", "5");
		audio.setAttribute("bar-gap", "2");
		audio.setAttribute("crossorigin", "");
		audio.setAttribute("preload", "");

		trackAudio.appendChild(audio);
	} else {
		reloadRound();
	}
}

function getRandomNumber(n) {
	return Math.floor(Math.random() * n);
}

function clearOptions() {
	const dataList = document.getElementById("track-titles");
	if (dataList) {
		while (dataList.firstChild) {
			dataList.removeChild(dataList.firstChild);
		}
	}
}

nextButton.addEventListener("click", () => {
	audioPlayer.setAttribute("src", "");
	textField.value = "";

	nextRound();
});

playAgainButton.addEventListener("click", () => {
	window.location.href = "play";
});

finalExitButton.addEventListener("click", () => {
	window.location.href = "home.html";
});

submitButton.addEventListener("click", () => {
	clearTimeout(timeOut);

	anchor.setAttribute("href", gameTracks[randomNumber].url);

	img.setAttribute("src", gameTracks[randomNumber].image);
	img.style.width = "20%";
	img.style.paddingBottom = "2%";
	anchor.appendChild(img);

	paragraph.innerHTML =
		gameTracks[randomNumber].title + " by " + gameTracks[randomNumber].artist;
	paragraph.style.color = "black";
	paragraph.style.fontSize = "20px";
	paragraph.style.textAlign = "left";

	audioPlayer.setAttribute("src", `${gameTracks[randomNumber].previewLink}`);
	audioPlayer.setAttribute("bar-width", "5");
	audioPlayer.setAttribute("bar-gap", "2");
	audioPlayer.setAttribute("crossorigin", "");

	winLoseIndicator.style.fontSize = "25px";

	nextButton.style.marginTop = "2%";

	audio.setAttribute("src", "");

	modal.appendChild(paragraph);
	modal.appendChild(anchor);
	modal.appendChild(audioPlayer);
	modal.appendChild(nextButton);
	modal.showModal();

	if (textField.value == gameTracks[randomNumber].title) {
		winLoseIndicator.innerHTML = "You are right the song was: ";
		modal.style.backgroundColor = "rgba(138, 255, 138, 1)";

		score = score + 1;
	} else {
		if (gameModeQuery === "randomTrack") {
			winLoseIndicator.innerHTML = "You are wrong, the song would have been: ";
		} else {
			winLoseIndicator.innerHTML = sayings[randomSayingNumber];
		}
		modal.style.backgroundColor = "rgba(255, 138, 138, 1)";
	}

	textField.value = "";
	console.log(gameTracks[randomNumber].title);
});

audio.addEventListener("timeupdate", function (event) {
	const currentTime = event.detail.currentTime;
	if (currentTime >= listeningTime) {
		event.target.pauseAudio();
		event.target.resetAudio();
	}
});

audio.addEventListener("playButtonPressed", () => {
	timeOut = setTimeout(() => {
		textField.value = "";

		anchor.setAttribute("href", gameTracks[randomNumber].url);

		img.setAttribute("src", gameTracks[randomNumber].image);
		img.style.width = "20%";
		img.style.paddingBottom = "2%";
		anchor.appendChild(img);

		paragraph.innerHTML =
			gameTracks[randomNumber].title + " by " + gameTracks[randomNumber].artist;
		paragraph.style.color = "black";
		paragraph.style.fontSize = "20px";
		paragraph.style.textAlign = "left";

		audioPlayer.setAttribute("src", `${gameTracks[randomNumber].previewLink}`);
		audioPlayer.setAttribute("bar-width", "5");
		audioPlayer.setAttribute("bar-gap", "2");
		audioPlayer.setAttribute("crossorigin", "");

		winLoseIndicator.style.fontSize = "25px";

		nextButton.style.marginTop = "2%";

		audio.setAttribute("src", "");

		winLoseIndicator.innerHTML = sayings[randomSayingNumber];
		modal.style.backgroundColor = "rgba(255, 138, 138, 1)";

		modal.appendChild(paragraph);
		modal.appendChild(anchor);
		modal.appendChild(audioPlayer);
		modal.appendChild(nextButton);
		modal.showModal();
	}, countdown * 1000);
});

textField.addEventListener("keydown", function (event) {
	if (event.key === "Enter") {
		clearTimeout(timeOut);

		anchor.setAttribute("href", gameTracks[randomNumber].url);
		anchor.addEventListener("keypress", function (event) {
			if (event.keyCode === 13) {
				// Check if Enter key was pressed
				event.preventDefault(); // Prevent the default action
			}
		});

		img.setAttribute("src", gameTracks[randomNumber].image);
		img.style.width = "20%";
		img.style.paddingBottom = "2%";
		anchor.appendChild(img);

		paragraph.innerHTML =
			gameTracks[randomNumber].title + " by " + gameTracks[randomNumber].artist;
		paragraph.style.color = "black";
		paragraph.style.fontSize = "20px";
		paragraph.style.textAlign = "left";

		audioPlayer.setAttribute("src", `${gameTracks[randomNumber].previewLink}`);
		audioPlayer.setAttribute("bar-width", "5");
		audioPlayer.setAttribute("bar-gap", "2");
		audioPlayer.setAttribute("crossorigin", "");

		winLoseIndicator.style.fontSize = "25px";

		nextButton.style.marginTop = "2%";

		audio.setAttribute("src", "");

		modal.appendChild(paragraph);
		modal.appendChild(anchor);
		modal.appendChild(audioPlayer);
		modal.appendChild(nextButton);
		modal.showModal();

		if (textField.value == gameTracks[randomNumber].title) {
			winLoseIndicator.innerHTML = "You are right the song was: ";
			modal.style.backgroundColor = "rgba(138, 255, 138, 1)";

			score = score + 1;
		} else {
			if (gameModeQuery === "randomTrack") {
				winLoseIndicator.innerHTML =
					"You are wrong, the song would have been: ";
			} else {
				winLoseIndicator.innerHTML = sayings[randomSayingNumber];
			}
			modal.style.backgroundColor = "rgba(255, 138, 138, 1)";
		}
	} else {
		// clear existing options
		clearOptions();

		// filter game tracks based on input value
		const inputValue = textField.value.toLowerCase();
		const filteredTracks = gameTracks.filter((track) =>
			track.title.toLowerCase().includes(inputValue)
		);

		// create datalist element
		const dataList = document.createElement("datalist");
		dataList.id = "track-titles";
		textField.setAttribute("list", "track-titles");
		textField.parentNode.insertBefore(dataList, textField.nextSibling);

		// set options for datalist
		filteredTracks.forEach((track) => {
			const option = document.createElement("option");
			option.value = track.title;
			dataList.appendChild(option);
		});
	}
});

exitButton.addEventListener("click", () => {
	window.location.href = `${baseUrl}home.html`;
});

modal.addEventListener("cancel", (event) => {
	event.preventDefault();
});

resultModal.addEventListener("cancel", (event) => {
	event.preventDefault();
});

// wait for both fetch and window to load before calling game()
Promise.all([
	fetch(baseUrl + gameModeQuery).then((response) => response.json()),
	new Promise((resolve) => window.addEventListener("load", resolve)),
])
	.then(([data]) => {
		textField.value = "";
		randomSayingNumber = getRandomNumber(sayings.length);
		for (let i = 0; i < data.length; i++) {
			gameTracks[i] = {
				title: data[i].title,
				url: data[i].url,
				previewLink: data[i].previewLink,
				artist: data[i].artist,
				image: data[i].image,
			};
		}

		if (checkPreviewLinks()) {
			randomNumber = getRandomNumber(gameTracks.length);
			localStorage.setItem("randomNumber", randomNumber);
			game(countdown, randomNumber);
		} else {
			// Handle the case when there are not enough previewLinks
			roundCounter.innerHTML = "";
			if (gameModeQuery === "playlistTracks") {
				notPlayable.innerHTML = "The playlist you selected is too short!";
			} else if (gameModeQuery === "artistTracks") {
				notPlayable.innerHTML = `The artist you selected does not have enough previewable tracks!`;
			} else {
				notPlayable.innerHTML = `You did not generate enough Spotify data to play this game!`;
			}
			const anchor = document.createElement("a");
			anchor.innerHTML = "Choose another Mode!";
			anchor.setAttribute("href", "/play");
			anchor.style.color = "white";

			const breakEl = document.createElement("br");

			notPlayable.appendChild(breakEl);
			notPlayable.appendChild(anchor);
			chooseAnotherMode.innerHTML = "Choose another mode!";
			console.log("Not enough previewLinks");
		}
	})
	.catch((error) => {
		console.error(error);
	});

//audio player
{
	class AudioPlayer extends HTMLElement {
		playing = false;
		volume = 0.3;
		prevVolume = 0.4;
		initialized = false;
		barWidth = 3;
		barGap = 1;
		bufferPercentage = 75;
		nonAudioAttributes = new Set(["bar-width", "bar-gap", "buffer-percentage"]);

		constructor() {
			super();

			this.attachShadow({ mode: "open" });
			this.render();
		}

		static get observedAttributes() {
			return [
				// audio tag attributes
				// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
				"src",
				"muted",
				"crossorigin",
				"loop",
				"preload",
				"autoplay",
				// the name of the audio
				"title",
				// the size of the frequency bar
				"bar-width",
				// the size of the gap between the bars
				"bar-gap",
				// the percentage of the frequency buffer data to represent
				// if the dataArray contains 1024 data points only a percentage of data will
				// be used to draw on the canvas
				"buffer-percentage",
			];
		}

		async attributeChangedCallback(name, oldValue, newValue) {
			switch (name) {
				case "src":
					this.initialized = false;
					this.render();
					this.initializeAudio();
					break;
				case "muted":
					this.toggleMute(Boolean(this.audio?.getAttribute("muted")));
					break;
				case "bar-width":
					this.barWidth = Number(newValue) || 3;
					break;
				case "bar-gap":
					this.barGap = Number(newValue) || 1;
					break;
				case "buffer-percentage":
					this.bufferPercentage = Number(newValue) || 75;
					break;
				default:
			}

			this.updateAudioAttributes(name, newValue);
		}

		updateAudioAttributes(name, value) {
			if (!this.audio || this.nonAudioAttributes.has(name)) return;

			// if the attribute was explicitly set on the audio-player tag
			// set it otherwise remove it
			if (this.attributes.getNamedItem(name)) {
				this.audio.setAttribute(name, value ?? "");
			} else {
				this.audio.removeAttribute(name);
			}
		}

		pauseAudio() {
			this.audio.pause();
		}

		resetAudio() {
			this.audio.currentTime = 0;
		}

		initializeAudio() {
			if (this.initialized) return;

			this.initialized = true;

			this.audioCtx = new AudioContext();
			this.gainNode = this.audioCtx.createGain();
			this.analyserNode = this.audioCtx.createAnalyser();
			this.track = this.audioCtx.createMediaElementSource(this.audio);

			this.analyserNode.fftSize = 2048;
			this.bufferLength = this.analyserNode.frequencyBinCount;
			this.dataArray = new Uint8Array(this.bufferLength);
			this.analyserNode.getByteFrequencyData(this.dataArray);

			this.track
				.connect(this.gainNode)
				.connect(this.analyserNode)
				.connect(this.audioCtx.destination);

			this.changeVolume();
		}

		updateFrequency() {
			if (!this.playing) return;

			this.analyserNode.getByteFrequencyData(this.dataArray);

			this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.canvasCtx.fillStyle = "rgba(0, 0, 0, 0)";
			this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			const barCount =
				this.canvas.width / (this.barWidth + this.barGap) - this.barGap;
			const bufferSize = (this.bufferLength * this.bufferPercentage) / 100;
			let x = 0;

			// this is a loss representation of the frequency
			// some data are loss to fit the size of the canvas
			for (let i = 0; i < barCount; i++) {
				// get percentage of i value
				const iPerc = Math.round((i * 100) / barCount);
				// what the i percentage maps to in the frequency data
				const pos = Math.round((bufferSize * iPerc) / 100);
				const frequency = this.dataArray[pos];
				// frequency value in percentage
				const frequencyPerc = (frequency * 100) / 255;
				// frequency percentage value in pixel in relation to the canvas height
				const barHeight = (frequencyPerc * this.canvas.height) / 100;
				// flip the height so the bar is drawn from the bottom
				const y = this.canvas.height - barHeight;

				this.canvasCtx.fillStyle = `rgba(255, 255, 255)`;
				this.canvasCtx.fillRect(x, y, this.barWidth, barHeight);

				x += this.barWidth + this.barGap;
			}

			requestAnimationFrame(this.updateFrequency.bind(this));
		}

		attachEvents() {
			this.volumeBar.parentNode.addEventListener(
				"click",
				(e) => {
					if (e.target === this.volumeBar.parentNode) {
						this.toggleMute();
					}
				},
				false
			);

			this.playPauseBtn.addEventListener(
				"click",
				this.togglePlay.bind(this),
				false
			);

			this.volumeBar.addEventListener(
				"input",
				this.changeVolume.bind(this),
				false
			);

			this.progressBar.addEventListener(
				"input",
				(e) => this.seekTo(this.progressBar.value),
				false
			);

			this.audio.addEventListener("loadedmetadata", () => {
				this.progressBar.max = this.audio.duration;
				this.durationEl.textContent = this.getTimeString(this.audio.duration);
				this.updateAudioTime();
			});

			this.audio.addEventListener("timeupdate", () => {
				this.updateAudioTime(this.audio.currentTime);
			});

			this.audio.addEventListener(
				"ended",
				() => {
					this.playing = false;
					this.playPauseBtn.textContent = "play";
					this.playPauseBtn.classList.remove("playing");
				},
				false
			);

			this.audio.addEventListener(
				"pause",
				() => {
					this.playing = false;
					this.playPauseBtn.textContent = "play";
					this.playPauseBtn.classList.remove("playing");
				},
				false
			);

			this.audio.addEventListener(
				"play",
				() => {
					this.playing = true;
					this.playPauseBtn.textContent = "pause";
					this.playPauseBtn.classList.add("playing");
					this.updateFrequency();
				},
				false
			);
		}

		async togglePlay() {
			if (this.audioCtx.state === "suspended") {
				await this.audioCtx.resume();
			}

			if (this.playing) {
				return this.audio.pause();
			}

			this.audio.play();
			this.dispatchPlayEvent();
			return this.audio.play();
		}

		getTimeString(time) {
			const secs = `${parseInt(`${time % 60}`, 10)}`.padStart(2, "0");
			const min = parseInt(`${(time / 60) % 60}`, 10);

			return `${min}:${secs}`;
		}

		changeVolume() {
			this.volume = Number(this.volumeBar.value);

			if (Number(this.volume) > 1) {
				this.volumeBar.parentNode.className = "volume-bar over";
			} else if (Number(this.volume) > 0) {
				this.volumeBar.parentNode.className = "volume-bar half";
			} else {
				this.volumeBar.parentNode.className = "volume-bar";
			}

			if (this.gainNode) {
				this.gainNode.gain.value = this.volume;
			}
		}

		toggleMute(muted = null) {
			this.volumeBar.value = muted || this.volume === 0 ? this.prevVolume : 0;
			this.changeVolume();
		}

		seekTo(value) {
			this.audio.currentTime = value;
		}

		updateAudioTime() {
			this.progressBar.value = this.audio.currentTime;
			this.currentTimeEl.textContent = this.getTimeString(
				this.audio.currentTime
			);

			// Emit a timeupdate event with the current time
			this.dispatchEvent(
				new CustomEvent("timeupdate", {
					detail: { currentTime: this.audio.currentTime },
				})
			);
		}

		dispatchPlayEvent() {
			const event = new Event("playButtonPressed");
			this.dispatchEvent(event);
		}

		style() {
			return `
      <style>
        :host {
          width: 100%;
          max-width: 400px;
          font-family: sans-serif;
        }
        
        * {
            box-sizing: border-box;
        }
        
        .audio-player {
          background: #6b6b6b;
          border-radius: 5px;
          padding: 5px;
          color: #fff;
          display: flex;
          align-items: center;
          position: relative;
          margin: 0 0 0px;
        }
        
        .play-btn {
            width: 30px;
            min-width: 30px;
            height: 30px;
            background: url("audio-player-icon-sprite.png") 0 center/500% 100% no-repeat;
            appearance: none;
            border: none;
            text-indent: -999999px;
            overflow: hidden;
        }
        
        .play-btn.playing {
            background: url("audio-player-icon-sprite.png") 25% center/500% 100% no-repeat;
        }
        
        .volume-bar {
            width: 30px;
            min-width: 30px;
            height: 30px;
            background: url("audio-player-icon-sprite.png") 50% center/500% 100% no-repeat;
            position: relative;
        }
        
        .volume-bar.half {
            background: url("audio-player-icon-sprite.png") 75% center/500% 100% no-repeat;
        }
        .volume-bar.over {
            background: url("audio-player-icon-sprite.png") 100% center/500% 100% no-repeat;
        }
        
        .volume-field {
            display: none;
            position: absolute;
            appearance: none;
            height: 20px;
            right: 100%;
            top: 50%;
            transform: translateY(-50%) rotate(180deg);
            z-index: 5;
            margin: 0;
            border-radius: 2px;
            background: #ffffff;
        }
        
        .volume-field::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 10px;
            background: #6d78ff;
        }
        
        .volume-field::-moz-range-thumb {
            appearance: none;
            height: 20px;
            width: 10px;
            background: #6d78ff
        }
        
        .volume-field::-ms-thumb  {
            appearance: none;
            height: 20px;
            width: 10px;
            background: #6d78ff
        }
        
        .volume-bar:hover .volume-field {
            display: block;
        }
        
        .progress-indicator {
            display: flex;
            justify-content: flex-end;
            position: relative;
            flex: 1;
            font-size: 12px;
            align-items: center;
            height: 20px;
        }
        
        .progress-bar {
            flex: 1;
            position: absolute;
            top: 50%;
            left: 0;
            z-index: 2;
            transform: translateY(-50%);
            width: 100%;
            appearance: none;
            margin: 0;
            overflow: hidden;
            background: none;
        }
        
        .progress-bar::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 0;
            box-shadow: -300px 0 0 300px #ffffff38;
        }
        
        .progress-bar::-moz-range-thumb {
            appearance: none;
            height: 20px;
            width: 0;
            box-shadow: -300px 0 0 300px #ffffff21;
        }
        
        .progress-bar::-ms-thumb {
            appearance: none;
            height: 20px;
            width: 0;
            box-shadow: -300px 0 0 300px #ffffff21;
        }
        
        .duration,
        .current-time {
            position: relative;
            z-index: 1;
            text-shadow: 0 0 2px #111;
			font-size: 0px;
        }
        
        .duration {
            margin-left: 2px;
            margin-right: 5px;
        }
        
        .duration::before {
            content: '/';
            display: inline-block;
            margin-right: 2px;
        }
        
        canvas {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            opacity: 0.4;
        }
      </style>
    `;
		}

		render() {
			this.shadowRoot.innerHTML = `
       ${this.style()}
        <figure class="audio-player">
          <audio style="display: none"></audio>
          <button class="play-btn" type="button">play</button>
          <div class="progress-indicator">
              <span class="current-time">0:0</span>
              <input type="range" max="100" value="0" class="progress-bar">
              <span class="duration">0:00</span>
              <canvas class="visualizer" style="width: 100%; height: 20px"></canvas>
          </div>
          <div class="volume-bar">
              <input type="range" min="0" max="2" step="0.01" value="${
								this.volume
							}" class="volume-field">
          </div>
        </figure>
      `;

			this.audio = this.shadowRoot.querySelector("audio");
			this.playPauseBtn = this.shadowRoot.querySelector(".play-btn");
			this.volumeBar = this.shadowRoot.querySelector(".volume-field");
			this.progressIndicator = this.shadowRoot.querySelector(
				".progress-indicator"
			);
			this.currentTimeEl = this.progressIndicator.children[0];
			this.progressBar = this.progressIndicator.children[1];
			this.durationEl = this.progressIndicator.children[2];
			this.canvas = this.shadowRoot.querySelector("canvas");

			this.canvasCtx = this.canvas.getContext("2d");
			// support retina display on canvas for a more crispy/HD look
			const scale = window.devicePixelRatio;
			this.canvas.width = Math.floor(this.canvas.width * scale);
			this.canvas.height = Math.floor(this.canvas.height * scale);
			this.volumeBar.value = this.volume;

			// if rendering or re-rendering all audio attributes need to be reset
			for (let i = 0; i < this.attributes.length; i++) {
				const attr = this.attributes[i];
				this.updateAudioAttributes(attr.name, attr.value);
			}

			this.attachEvents();
		}
	}

	customElements.define("audio-player", AudioPlayer);
}
