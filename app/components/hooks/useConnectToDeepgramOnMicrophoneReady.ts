import { useDeepgramContext } from "@/app/context/DeepgramContextProvider";
import {
  MicrophoneState,
  useMicrophoneContext,
} from "@/app/context/MicrophoneContextProvider";
import { useEffect } from "react";
import { useUpdatingRef } from "@/app/components/hooks/useUpdatingRef";

export const useConnectToDeepgramOnMicrophoneReady = () => {
  const { connectToDeepgram } = useDeepgramContext();

  const { microphoneState } = useMicrophoneContext();

  const connectToDeepgramRef = useUpdatingRef(connectToDeepgram);
  useEffect(() => {
    if (!connectToDeepgramRef.current) return;

    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgramRef.current({
        model: "nova-3",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
  }, [connectToDeepgramRef, microphoneState]);
};
