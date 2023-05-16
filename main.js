import "./style.css";
import { setupCounter } from "./counter.js";
import { analyze, guess } from "web-audio-beat-detector";
import { gsap } from "gsap";

document.querySelector("#app").innerHTML = `
	<h1>you're the alpha, bitch</h1>  
	<button id="analyzeButton">analyze</button>
	<button id="playButton">play</button>
`;

const ctx = new AudioContext();
console.log(ctx);

let audio;

fetch("/ALPHA.mp3")
	.then((data) => data.arrayBuffer())
	.then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
	.then((decodedAudio) => {
		audio = decodedAudio;
	});

let audioBuffer;

fetch("/ALPHA.mp3")
	.then((response) => response.arrayBuffer())
	.then((arrayBuffer) => {
		return new Promise((resolve, reject) => {
			ctx.decodeAudioData(
				arrayBuffer,
				(decodedAudio) => {
					resolve(decodedAudio);
				},
				(error) => {
					reject(error);
				}
			);
		});
	})
	.then((decodedAudio) => {
		// Store the decoded audio buffer in an audioBuffer variable
		audioBuffer = decodedAudio;
	})
	.catch((error) => {
		console.error("Error loading audio:", error);
	});

const playback = () => {
	const playSound = ctx.createBufferSource();
	playSound.buffer = audio;
	playSound.connect(ctx.destination);
	playSound.start(ctx.currentTime);

	const alphaBeatsContainer = document.querySelector("#alphaBeats");
	setInterval(() => {
		// const alphaBeatCounter = document.createElement("p");
		// alphaBeatCounter.innerHTML = `Beat`;
		// alphaBeatsContainer.appendChild(alphaBeatCounter);
		var tl = gsap.timeline();
		tl.to("#beatCircle", { scale: 2, repeat: -1 });
	}, 566);
};

const analyzeSong = () => {
	guess(audioBuffer)
		.then(({ bpm, offset, tempo }) => {
			console.log("bpm", bpm);
			console.log("offset", offset);
			console.log("tempo", tempo);
		})
		.catch((err) => {
			console.log("audio could not be analyzed", err);
		});
};

const analyzeButton = document.getElementById("analyzeButton");
analyzeButton.addEventListener("click", analyzeSong);

const playButton = document.getElementById("playButton");
playButton.addEventListener("click", playback);
