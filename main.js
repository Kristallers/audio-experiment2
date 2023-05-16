import "./style.css";
import { setupCounter } from "./counter.js";

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

const playback = () => {
	const playSound = ctx.createBufferSource();
	playSound.buffer = audio;
	playSound.connect(ctx.destination);
	playSound.start(ctx.currentTime);
};

const playButton = document.getElementById("playButton");
playButton.addEventListener("click", playback);
