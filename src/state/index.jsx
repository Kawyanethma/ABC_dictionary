import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
    data: '',
    isLoading: false,
    voice: null,
    pitch: 1,
    rate: 1,
    volume: 1,
    });

export { setGlobalState, useGlobalState };