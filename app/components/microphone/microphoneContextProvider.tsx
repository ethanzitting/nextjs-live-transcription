"use client";

import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { MicrophoneState } from "@/app/components/microphone/typesAndConstants";

interface MicrophoneContext {
  microphone: MediaRecorder | null;
  startMicrophone: () => void;
  stopMicrophone: () => void;
  setupMicrophone: () => void;
  microphoneState: MicrophoneState | null;
}

const defaultMicrophoneContext: MicrophoneContext = {
  microphone: null,
  startMicrophone: () => {},
  stopMicrophone: () => {},
  setupMicrophone: () => {},
  microphoneState: null,
};

const microphoneContext = createContext<MicrophoneContext>(
  defaultMicrophoneContext,
);

export function useMicrophoneContext(): MicrophoneContext {
  return useContext(microphoneContext);
}

export const MicrophoneContextProvider: FC<PropsWithChildren> = ({
  children = undefined,
}) => {
  const [microphoneState, setMicrophoneState] = useState<MicrophoneState>(
    MicrophoneState.NotSetup,
  );
  const [microphone, setMicrophone] = useState<MediaRecorder | null>(null);

  const setupMicrophone = useCallback(async () => {
    setMicrophoneState(MicrophoneState.SettingUp);

    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
        },
      });

      const microphone = new MediaRecorder(userMedia);

      setMicrophoneState(MicrophoneState.Ready);
      setMicrophone(microphone);
      console.log("microphone setup complete", microphone);
    } catch (err: any) {
      setMicrophoneState(MicrophoneState.Error);
      console.error(err);

      throw err;
    }
  }, []);

  const stopMicrophone = useCallback(() => {
    setMicrophoneState(MicrophoneState.Pausing);

    if (microphone?.state === "recording") {
      microphone.pause();
      setMicrophoneState(MicrophoneState.Paused);
    }
  }, [microphone]);

  const startMicrophone = useCallback(() => {
    setMicrophoneState(MicrophoneState.Opening);

    if (microphone?.state === "paused") {
      microphone.resume();
    } else {
      microphone?.start(250);
    }

    setMicrophoneState(MicrophoneState.Open);
  }, [microphone]);

  const value = useMemo(() => {
    return {
      microphone,
      startMicrophone,
      stopMicrophone,
      setupMicrophone,
      microphoneState,
    };
  }, [
    microphone,
    startMicrophone,
    stopMicrophone,
    setupMicrophone,
    microphoneState,
  ]);

  return (
    <microphoneContext.Provider value={value}>
      {children}
    </microphoneContext.Provider>
  );
};
