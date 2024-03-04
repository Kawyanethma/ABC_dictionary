import React from "react";
import { useGlobalState, setGlobalState } from "./state";
import { Slider, Select, MenuItem, Button, Typography, IconButton } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import HtmlTooltip from "./components/HtmlTooltip";

const TextToSpeech = () => {
  const [voice] = useGlobalState("voice");
  const [pitch] = useGlobalState("pitch");
  const [rate] = useGlobalState("rate");
  const [volume] = useGlobalState("volume");

  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setGlobalState(
      "voice",
      voices.find((v) => v.name === event.target.value)
    );
  };

  const handlePitchChange = (event) => {
    setGlobalState("pitch", parseFloat(event.target.value));
  };

  const handleRateChange = (event) => {
    setGlobalState("rate", parseFloat(event.target.value));
  };

  const handleVolumeChange = (event) => {
    setGlobalState("volume", parseFloat(event.target.value));
  };

  const handleReset = () => {
    setGlobalState("voice", window.speechSynthesis.getVoices()[2]);
    setGlobalState("pitch", 1);
    setGlobalState("rate", 1);
    setGlobalState("volume", 1);
  }

  return (
    <div className="settings-menu">
      <h1>Settings</h1>
      <div className="settings-items">
        <div className="setting-comp">
          <label>Voice</label>
          <Select
            className="voice-select"
            value={voice?.name}
            onChange={handleVoiceChange}
            displayEmpty
            defaultValue={window.speechSynthesis.getVoices()[2].name}
            MenuProps={{
              sx: {
                "& .MuiList-root": {
                  backgroundColor: "#212121",
                  color: "white"
                },
                "&& .Mui-selected": {
                  backgroundColor: "#eeba2c36"
                }
              }
            }}
            inputProps={{ "aria-label": "Without label"}}
          >
            {window.speechSynthesis.getVoices().map((voice) => (
              <MenuItem className="voice-menu" key={voice.name} value={voice.name}>
                {voice.name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="setting-comp">
          <label>Pitch</label>
          <Slider
            className="slider"
            min={0.5}
            max={2}
            step={0.1}
            aria-label="Default"
            value={pitch}
            onChange={handlePitchChange}
          />
        </div>

        <div className="setting-comp">
          <label>Speed</label>
          <Slider
            className="slider"
            min={0.5}
            max={2}
            step={0.1}
            aria-label="Default"
            value={rate}
            onChange={handleRateChange}
          />
        </div>

        <div className="setting-comp">
          <label>Volume</label>
          <Slider
            className="slider"
            min={0}
            max={1}
            step={0.1}
            aria-label="Default"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
        <Button
            className="reset-button"
            onClick={handleReset}
          >
            Reset
          </Button>
      </div>
      <div  className="about-dev">
      <HtmlTooltip title={
          <>
            <b>{'Version:'}</b> 1.0.0<br/>
            <b>{'ABC Dictionary'}</b> <em>{"is open source."}</em><br/><br/>{"Developed by "}<br/><em>{'Kawyanethma'}</em>
          </>
        }>
      <IconButton><InfoIcon style={{ fontSize: 16, color: "#212121"}}/></IconButton>
      </HtmlTooltip>
      </div>
    </div>
  );
};

export default TextToSpeech;
