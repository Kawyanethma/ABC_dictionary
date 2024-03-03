import React, { useContext, useState, useEffect } from "react";
import { Context } from "./ttsVar";

const TextToSpeech = ({ }) => {

  const [state, setState] = useContext(Context);

  const [utterance, setUtterance] = useState(null);
  // const [voice, setVoice] = useState(null);
  // const [pitch, setPitch] = useState(1);
  // const [rate, setRate] = useState(1);
  // const [volume, setVolume] = useState(1);

  useEffect(() =>  {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance("hello");
    
    setUtterance(u);


    // Add an event listener to the speechSynthesis object to listen for the voiceschanged event
    synth.addEventListener("voiceschanged", () => {
      const voices = synth.getVoices();
      setState("voice",voices[2]);
      // setVoice(voices[0]);
    });
    
    return () => {
      synth.cancel();
      synth.removeEventListener("voiceschanged", () => {
        setState("voice",null);
        // setVoice(null);
      });
    };
    
  }, []);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    console.log(state.pitch);
    utterance.voice = state.voice;
    utterance.pitch = state.pitch;
    utterance.rate = state.rate;
    utterance.volume = state.volume;
    synth.speak(utterance);
    console.log(state.voice);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    setIsPaused(false);
    synth.cancel();
  };

  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setState('voice',voices.find((v) => v.name === event.target.value));
  };

  const handlePitchChange = (event) => {
    // setPitch(parseFloat(event.target.value));
    const pitch = parseFloat(event.target.value)
    setState('pitch',6);
  };

  const handleRateChange = (event) => {
    setRate(parseFloat(event.target.value));
  };

  const handleVolumeChange = (event) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <div>
      <label>
        Voice:
        <select value={state.voice?.name} onChange={handleVoiceChange}>
          {window.speechSynthesis.getVoices().map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Pitch:
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={state.pitch}
          onChange={handlePitchChange}
        />
      </label>

      <br />

      <label>
        Speed:
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={state.rate}
          onChange={handleRateChange}
        />
      </label>
      <br />
      <label>
        Volume:
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={state.volume}
          onChange={handleVolumeChange}
        />
      </label>

      <br />

      <button onClick={handlePlay}>Play</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};

export default TextToSpeech;
