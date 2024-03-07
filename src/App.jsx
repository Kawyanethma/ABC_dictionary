import "regenerator-runtime";
import "./App.scss";
import { useEffect, useState } from "react";
import speech, { useSpeechRecognition } from "react-speech-recognition";
import Lottie from "react-lottie";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { IconButton, TextField, Button, Drawer } from "@mui/material";
import { PlayArrow, Pause, Cancel, Settings } from "@mui/icons-material";
import getMeaning from "./components/DictionaryAPI";
import { defaultOptionsLoading, defaultOptionsMic, defaultOptions } from "./assets/lotties/options";
import { useGlobalState } from "./state";
import TextToSpeech from "./tts";
import customTheme from "./themes";
import NoInternet from "./NoInternet";

function App() {
  const synth = window.speechSynthesis;
  const outerTheme = useTheme();
  const [utterance, setUtterance] = useState("");
  const [voice, setVoice] = useGlobalState("voice");
  const [pitch] = useGlobalState("pitch");
  const [rate] = useGlobalState("rate");
  const [volume] = useGlobalState("volume");

  const [isStop, setIsStop] = useState(true);
  const [isLoading] = useGlobalState("isLoading");
  const [open, setOpen] = useState(false);

  const [data] = useGlobalState("data");
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
  
  const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();


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

  useEffect(() => {
    if (!isLoading) {
      update();
    }
  }, [data]);

  useEffect(() => {
    settypedWord(transcript);
    console.log(typedWord);
    console.log(transcript);
    if (listening && transcript != false) {
      getMeaning(typedWord);
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getMeaning(typedWord);
    }
  };

  const toggleDrawer = (newOpen) => () => {
    handleStop();
    setOpen(newOpen);
  };

  function update() {
    if (!isLoading && data != "") {
      setdisplayWord(data.word);
      setphonetic(data.phonetic);
      setPartOfSpeech(data.meanings[0].partOfSpeech);
      setDef(data.meanings[0].definitions[0].definition);
      setExample(data.meanings[0].definitions[0].example);
    }
  }

  return (
    <NoInternet>
    <div className="container">
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
            onClick={() => getMeaning(typedWord)}
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
    </NoInternet>
  );
}

export default App;
