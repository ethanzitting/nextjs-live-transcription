import { useDeepgramContext } from "@/app/context/DeepgramContextProvider";
import { MicrophoneState, useMicrophoneContext } from "@/app/context/MicrophoneContextProvider";
import { useEffect } from "react";

export const useConnectToDeepgramOnMicrophoneReady = () => {
    const { connectToDeepgram } = useDeepgramContext();

  const { microphoneState } = useMicrophoneContext();
    
  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-3",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState]);
}
