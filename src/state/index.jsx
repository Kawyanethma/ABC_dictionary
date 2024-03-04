import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
    voice: null,
    pitch: 1,
    rate: 1,
    volume: 1,
    });

export { setGlobalState, useGlobalState };