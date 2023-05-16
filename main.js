import "./style.css";
import { setupCounter } from "./counter.js";
import { analyze, guess } from "web-audio-beat-detector";

document.querySelector("#app").innerHTML = `
  <div>hello (:</div>
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
};

const analyzeSong = () => {
	analyze(audioBuffer)
		.then((tempo) => {
			console.log(tempo);
		})
		.catch((err) => {
			console.log("audio could not be analyzed", err);
		});
};

const playButton = document.getElementById("playButton");
playButton.addEventListener("click", analyzeSong);
