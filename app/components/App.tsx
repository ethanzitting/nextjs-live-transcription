"use client";

import { FC } from "react";
import { useDeepgramContext } from "../context/DeepgramContextProvider";
import { useMicrophoneContext } from "../context/MicrophoneContextProvider";
import Visualizer from "./Visualizer";
import { useAudioTranscriptionHandler } from "./hooks/useAudioTranscriptionHandler";
import { useConnectToDeepgramOnMicrophoneReady } from "./hooks/useConnectToDeepgramOnMicrophoneReady";
import { useConnectionKeepAlive } from "./hooks/useConnectionKeepAlive";
import { useOnMount } from "./hooks/useOnMount";

export const App: FC = () => {
  const { connection, connectToDeepgram, connectionState } = useDeepgramContext();
  const { setupMicrophone, microphone, startMicrophone, microphoneState } =
    useMicrophoneContext();

  useOnMount(setupMicrophone);
  
  useConnectToDeepgramOnMicrophoneReady();

  const { caption } = useAudioTranscriptionHandler({
    microphone,
    connection,
    connectionState,
    startMicrophone,
  });

  useConnectionKeepAlive({
    connection,
    microphoneState,
    connectionState,
  });

  return (
    <>
      <div className="flex h-full antialiased">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col flex-auto h-full">
            {/* height 100% minus 8rem */}
            <div className="relative w-full h-full">
              {microphone && <Visualizer microphone={microphone} />}
              <div className="absolute bottom-[8rem]  inset-x-0 max-w-4xl mx-auto text-center">
                {caption && <span className="bg-black/70 p-8">{caption}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
