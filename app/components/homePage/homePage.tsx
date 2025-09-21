"use client";

import { FC } from "react";
import { useMicrophoneContext } from "../microphone/microphoneContextProvider";
import { AudioVisualizer } from "../audioVisualizer";
import { useAudioTranscriptionHandler } from "../hooks/useAudioTranscriptionHandler";
import { useConnectToDeepgramOnMicrophoneReady } from "../hooks/useConnectToDeepgramOnMicrophoneReady";
import { useKeepConnectionLive } from "../hooks/useKeepConnectionAlive";
import { useOnMount } from "../hooks/useOnMount";

export const HomePage: FC = () => {
  const { setupMicrophone } = useMicrophoneContext();

  useOnMount(setupMicrophone);

  useConnectToDeepgramOnMicrophoneReady();
  useKeepConnectionLive();

  const { caption } = useAudioTranscriptionHandler();

  return (
    <>
      <div className="flex h-full antialiased">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col flex-auto h-full">
            {/* height 100% minus 8rem */}
            <div className="relative w-full h-full">
              <AudioVisualizer />
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
