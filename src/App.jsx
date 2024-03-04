import "regenerator-runtime";
import { useEffect, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import speech, { useSpeechRecognition } from "react-speech-recognition";
import Lottie from "react-lottie";

import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { IconButton, TextField, Button, Drawer } from "@mui/material";
import { PlayArrow, Pause, Cancel, Settings } from "@mui/icons-material";

import loadingIcon from "./assets/lotties/loading.json";
import animationData from "./assets/lotties/wave.json";
import animationData1 from "./assets/lotties/mic.json";
import close from "./assets/close.png";
import min from "./assets/minimize-sign.png";
import max from "./assets/maximize.png";
import "./App.scss";

import axios from "axios";
import TextToSpeech from "./tts";
import { useGlobalState, setGlobalState } from "./state";

function App() {
  const synth = window.speechSynthesis;
  const [utterance, setUtterance] = useState("");
  const [voice, setVoice] = useGlobalState("voice");
  const [pitch] = useGlobalState("pitch");
  const [rate] = useGlobalState("rate");
  const [volume] = useGlobalState("volume");

  const [isStop, setIsStop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState("");
  const [typedWord, settypedWord] = useState("");
  const [displayWord, setdisplayWord] = useState("Welcome");
  const [phonetic, setphonetic] = useState("/ˈwɛlkəm/");
  const [partOfSpeech, setPartOfSpeech] = useState("Noun");
  const [def, setDef] = useState(
    'The act of greeting someone’s arrival, especially by saying "Welcome!"; reception.'
  );
  const [example, setExample] = useState(
    "You are welcome to the ABC Dictionary, You can type or use your voice to search! 😊"
  );

  const toggleDrawer = (newOpen) => () => {
    handleStop();
    setOpen(newOpen);
  };

  useEffect(() => {
    const u = new SpeechSynthesisUtterance(
      `${displayWord}. this word is a ${partOfSpeech}. Definition is. ${def}`
    );
    setUtterance(u);
    const voices = synth.getVoices();
    setVoice(voices[2]);
    u.onend = () => {
      setIsStop(true);
    };

    return () => {
      synth.cancel();
      synth.removeEventListener("voiceschanged", () => {
        setVoice(null);
      });
    };
  }, [displayWord]);

  const handlePlay = () => {
    setIsStop(false);
    utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;
    synth.speak(utterance);
  };

  const handleStop = () => {
    setIsStop(true);
    synth.cancel();
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getMeaning();
    }
  };

  const getMeaning = async () => {
    const word = typedWord.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "");
    try {
      setIsLoading(true);
      console.log("getMeaning is running");
      console.log(word);
      const response = await axios(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setData(response.data[0]);
    } catch (e) {
      console.log(e.name);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      console.log("data is updated");
      console.log(data.word);
      update();
    }
  }, [data]);

  useEffect(() => {
    settypedWord(transcript);
    console.log(typedWord);
    console.log(transcript);
    if (listening && transcript != false) {
      getMeaning();
    }
    if (!listening && transcript != false && !isLoading) {
      resetTranscript;
    }
  }, [transcript, listening, isLoading]);

  useEffect(() => {
    if (typedWord == "" && displayWord != "Welcome") {
      if (data == null) {
        setdisplayWord("null");
      }
      setdisplayWord("dictionary");
      setphonetic("/ˈdɪkʃəˌnɛɹi/");
      setPartOfSpeech("Search english");
      setDef("Strat typing any word or talk to mic ! 😊");
      setExample("Examples are Display here ! 💫");
    }
  }, [typedWord]);

  function update() {
    console.log("update is runinng");
    console.log(typedWord);
    console.log(isLoading);
    if (!isLoading && data != "") {
      setdisplayWord(data.word);
      setphonetic(data.phonetic);
      setPartOfSpeech(data.meanings[0].partOfSpeech);
      setDef(data.meanings[0].definitions[0].definition);
      setExample(data.meanings[0].definitions[0].example);
    }
  }
  const defaultOptionsLoading = {
    loop: true,
    autoplay: true,
    animationData: loadingIcon,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsMic = {
    loop: true,
    autoplay: false,
    animationData: animationData1,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptions = {
    loop: true,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const customTheme = (outerTheme) =>
    createTheme({
      typography: {
        fontFamily: "Mono",
      },
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": "#212121",
              "--TextField-brandBorderHoverColor": "#3b3b33",
              "--TextField-brandBorderFocusedColor": "#212121",
              "& label.Mui-focused": {
                color: "black",
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: "var(--TextField-brandBorderColor)",
            },
            root: {
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderHoverColor)",
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              "&::before, &::after": {
                borderBottom: "2px solid var(--TextField-brandBorderColor)",
              },
              "&:hover:not(.Mui-disabled, .Mui-error):before": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderHoverColor)",
              },
              "&.Mui-focused:after": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              "&::before": {
                borderBottom: "2px solid var(--TextField-brandBorderColor)",
              },
              "&:hover:not(.Mui-disabled, .Mui-error):before": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderHoverColor)",
              },
              "&.Mui-focused:after": {
                borderBottom:
                  "2px solid var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
      },
    });

  const outerTheme = useTheme();

  return (
    <div className="container">
      <div data-tauri-drag-region className="titlebar">
        <div
          className="titlebar-button max"
          onClick={() => appWindow.toggleMaximize()}
        >
          <img src={max} alt="maximize" />
        </div>
        <div
          className="titlebar-button min"
          onClick={() => appWindow.minimize()}
        >
          <img src={min} alt="minimize" onClick={() => appWindow.minimize()} />
        </div>
        <div
          className="titlebar-button close"
          onClick={() => appWindow.close()}
        >
          <img src={close} alt="close" />
        </div>
      </div>

      <div className="left">
        <div className="logo">
          ABC...
          <br /> Dictionary
        </div>
        <div className="search">
          <ThemeProvider theme={customTheme(outerTheme)}>
            <div className="searchwithvoice">
              <TextField
                focused
                autoComplete="off"
                className="search-bar"
                id="standard-basic"
                label="Search English"
                variant="standard"
                value={listening ? `${transcript}` : `${typedWord}`}
                placeholder={
                  listening ? "Listening..." : "Start typing any word"
                }
                onKeyDown={handleKeyDown}
                onChange={(e) => settypedWord(e.target.value)}
              />
              <IconButton
                className="voice-button"
                variant="contained"
                onClick={() =>
                  listening ? speech.stopListening() : speech.startListening()
                }
              >
                <Lottie
                  className="mic"
                  options={defaultOptionsMic}
                  height={70}
                  width={70}
                  isStopped={!listening}
                  isClickToPauseDisabled={true}
                />
              </IconButton>
            </div>
          </ThemeProvider>
          <Button
            className="search-button"
            variant="contained"
            onClick={() => getMeaning()}
          >
            Search
          </Button>
        </div>
        <div className="wave">
          <Lottie
            options={defaultOptions}
            height={100}
            width={100}
            isPaused={isStop}
            isClickToPauseDisabled={true}
          />
        </div>
        <p className="about">
          Powered by dictionaryapi.dev and Web Speech API
          <br /> build with tauri + react + vite
          <br /> 1.0v
        </p>
      </div>

      {isLoading ? (
        <div className="loading">
          <Lottie
            options={defaultOptionsLoading}
            height={300}
            width={300}
            isPaused={isStop}
            isClickToPauseDisabled={true}
          />
        </div>
      ) : (
        <div className="right">
          <div className="text-solid">
            <div className="play-h1">
              <h1>{displayWord}</h1>
              <IconButton
                className="play-button"
                variant="contained"
                onClick={isStop ? handlePlay : handleStop}
              >
                {isStop ? <PlayArrow /> : <Pause />}
              </IconButton>
            </div>
            <p className="phonetic">{phonetic}</p>
            <div className="definition-area">
              <div className="custom-header">
                <p className="partOfSpeech">{partOfSpeech}</p>
                <p className="def">{def}</p>
                <p className="example">Example</p>
                <p className="example-text">{example}</p>
              </div>
            </div>
            <div className="side-menu">
              <IconButton
                className="settings"
                type="button"
                onClick={toggleDrawer(true)}
              >
                {open ? (
                  <Cancel style={{ fontSize: 20 }} />
                ) : (
                  <Settings style={{ fontSize: 20 }} />
                )}
              </IconButton>
              <Drawer className="settings" open={open} onClose={toggleDrawer(false)}>
                {<TextToSpeech />}
              </Drawer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
