import { useEffect, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import CircularProgress from "@mui/material/CircularProgress";
import SettingsIcon from "@mui/icons-material/Settings";
import CancelIcon from "@mui/icons-material/Cancel";
import "regenerator-runtime";
import speech, { useSpeechRecognition } from "react-speech-recognition";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Lottie from "react-lottie";
import loadingIcon from "./assets/lotties/loading.json"
import animationData from "./assets/lotties/wave.json";
import animationData1 from "./assets/lotties/mic.json";
import close from "./assets/close.png";
import min from "./assets/minimize-sign.png";
import max from "./assets/maximize.png";
import "./App.scss";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import axios from "axios";
import TextToSpeech from "./tts";
import TtsVar from "./ttsVar";

function App() {
  const synth = window.speechSynthesis;
  const [utterance, setUtterance] = useState(null);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isStop, setIsStop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [anchor, setAnchor] = useState(null);

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


  useEffect(() => {
    const u = new SpeechSynthesisUtterance(`${displayWord}. this word is a ${partOfSpeech}. Definition is. ${def}`);
    setUtterance(u);
    const voices = synth.getVoices();
      setVoice(voices[2]);
    u.onend = () =>{
      setIsStop(true);
    }

    return () => {
      synth.cancel();
      synth.removeEventListener("voiceschanged", () => {
        setVoice(null);
      });
    };
  }, [displayWord]);

  const handlePlay = () => {
    setIsStop(false)
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

  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices.find((v) => v.name === event.target.value));
    console.log(voice.name);
  };

  const handlePitchChange = (event) => {
    setPitch(parseFloat(event.target.value));
  };

  const handleRateChange = (event) => {
    setRate(parseFloat(event.target.value));
  };

  const handleVolumeChange = (event) => {
    setVolume(parseFloat(event.target.value));
  };

  const SettingshandleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
    console.log(open);
  };

  const open = Boolean(anchor);
  const id = open ? "simple-popper" : undefined;

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
    if(!isLoading){
      console.log("data is updated");
      console.log(data.word);
      update();
    }
  }, [data])
  

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
    // else  {
    //   getMeaning();
    // }
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
      <div data-tauri-drag-region class="titlebar">
        <div
          class="titlebar-button max"
          onClick={() => appWindow.toggleMaximize()}
        >
          <img src={max} alt="maximize" />
        </div>
        <div class="titlebar-button min" onClick={() => appWindow.minimize()}>
          <img src={min} alt="minimize" onClick={() => appWindow.minimize()} />
        </div>
        <div class="titlebar-button close" onClick={() => appWindow.close()}>
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
                value={listening ? `${transcript}` : null}
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
                  listening? speech.stopListening() : speech.startListening()
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
          Powered by dictionaryapi.dev and OpenAI API
          <br /> build with tauri + react + vite
          <br /> 1.0v
        </p>
      </div>

      {isLoading? <div className="loading"><Lottie
            options={defaultOptionsLoading}
            height={300}
            width={300}
            isPaused={isStop}
            isClickToPauseDisabled={true}
          /></div>:<div className="right">
        <div className="popUp">
          <IconButton
            className="settings"
            aria-describedby={id}
            type="button"
            onClick={SettingshandleClick}
          >
            {open ? (
              <CancelIcon style={{ fontSize: 20 }} />
            ) : (
              <SettingsIcon style={{ fontSize: 20 }} />
            )}
          </IconButton>
          <BasePopup id={id} open={open} anchor={anchor}>
          <TtsVar>
          <TextToSpeech text={"hello whatsup"} isStoped={isStop}/>
          </TtsVar>
          </BasePopup>
        </div>
        <div className="text-solid">
          <div className="play-h1">
            <h1>{displayWord}</h1>
            <IconButton
              className="play-button"
              variant="contained"
              onClick={isStop? handlePlay:handleStop}
            >
              {isStop ? <PlayArrowIcon /> : <PauseIcon />}
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
        </div>
      </div>}
    </div>
  );
}

export default App;
