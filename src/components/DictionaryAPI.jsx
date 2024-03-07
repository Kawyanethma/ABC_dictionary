import { setGlobalState } from "../state";
import axios from "axios";

const getMeaning = async (typedWord) => {
    const word = typedWord.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "");
    try {
      setGlobalState("isLoading", true);
      console.log("getMeaning is running");
      console.log(word);
      const response = await axios(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setGlobalState("data", response.data[0]);
    } catch (e) {
      console.log(e.name);
    } finally {
      setGlobalState("isLoading", false)
    }
  };

  export default getMeaning;