import { useEffect, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import CircularProgress from '@mui/material/CircularProgress';
import 'regenerator-runtime'
import speech, { useSpeechRecognition } from 'react-speech-recognition';
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Lottie from "react-lottie";
import animationData from "./assets/lotties/wave.json";
import animationData1 from "./assets/lotties/mic.json";
import close from "./assets/close.png";
import min from "./assets/minimize-sign.png";
import max from "./assets/maximize.png";
import "./App.scss";
import axios from "axios";

function App() {
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
  const [isStop, setIsStop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      update();
    }
  };

  const getMeaning = async () => {
    try {
      setIsLoading(true);
      const response = await axios(`https://api.dictionaryapi.dev/api/v2/entries/en/${typedWord}`);
      setData(response.data[0]);
    } catch (e) {
      console.log(e.name);
    } finally{
      setIsLoading(false);
    }
  };
useEffect(() => {

  if(transcript && listening) {
    settypedWord(transcript);
    console.log(typedWord);
    console.log(isLoading);
  }
  if(!isLoading && !listening && transcript!=false){
    // update()
  }

}, [transcript, listening])

  useEffect(() => {
    if (typedWord == "" && displayWord!="Welcome") {
      if (data==null) {
        setdisplayWord("null")
      }
      setdisplayWord("dictionary");
      setphonetic("/ˈdɪkʃəˌnɛɹi/");
      setPartOfSpeech("Search english");
      setDef("Strat typing any word or talk to mic ! 😊");
      setExample("Examples are Display here ! 💫");
    } else {
      getMeaning();
    }
  }, [typedWord]);

  function update() {
    console.log(isLoading);
    setdisplayWord("Loading");
      if (!isLoading){
        setdisplayWord(data.word);
        setphonetic(data.phonetic);
        setPartOfSpeech(data.meanings[0].partOfSpeech);
        setDef(data.meanings[0].definitions[0].definition);
        setExample(data.meanings[0].definitions[0].example);
      }else{
        update();
      }
      
    }
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
              value={listening? `${transcript}`:null}
              placeholder={listening? "Listening...":"Start typing any word"}
              onKeyDown={handleKeyDown}
              onChange={(e) => settypedWord(e.target.value)}
            />
            <IconButton
              className="voice-button"
              variant="contained"
              onClick={() => speech.startListening()}
            >
                <Lottie
                className="mic"
                options={defaultOptionsMic}
                height={60}
                width={60}
                isStopped={!listening}
                isClickToPauseDisabled={true}
                />
              {/* <KeyboardVoiceIcon /> */}
            </IconButton>
          </div>
        </ThemeProvider>
        <Button
          className="search-button"
          variant="contained"
          onClick={() => update()}
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

    <div className="right">
      <div className="text-solid">
        <div className="play-h1">
          <h1>{displayWord}</h1>
          <IconButton
            className="play-button"
            variant="contained"
            onClick={() => 
              // (isStop ? setIsStop(false) : setIsStop(true))
              speech.stopListening()
            }
          >
            {listening ? <PlayArrowIcon /> : <PauseIcon />}
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
    </div>
  </div>
  );
}

export default App;
