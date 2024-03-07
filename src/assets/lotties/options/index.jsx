import loadingAnimationData from "../loading.json";
import waveAnimationData from "../wave.json";
import micAnimationData from "../mic.json";
import NoInternet from "../noConnection.json";

const defaultOptionsLoading = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsMic = {
    loop: true,
    autoplay: false,
    animationData: micAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptions = {
    loop: true,
    autoplay: false,
    animationData: waveAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const defaultOptionsNoInternet = {
    loop: false,
    autoplay: true,
    animationData: NoInternet ,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


    export { defaultOptionsLoading, defaultOptionsMic, defaultOptions, defaultOptionsNoInternet };