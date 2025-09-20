import { useEffect, useRef, useState } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgramContext,
} from "../../context/DeepgramContextProvider";
import { MicrophoneEvents, useMicrophoneContext } from "../../context/MicrophoneContextProvider";

export const useAudioTranscriptionHandler = () => {
  const { connection, connectionState } = useDeepgramContext();
  const { microphone, startMicrophone } =
    useMicrophoneContext();
    
  const [caption, setCaption] = useState<string | undefined>("Powered by Deepgram");
  const captionTimeout = useRef<any>();

  useEffect(() => {
    if (!microphone) return;
    if (!connection) return;

    const handleAudioData = (e: BlobEvent) => {
      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close. 
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const handleTranscript = (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      let thisCaption = data.channel.alternatives[0].transcript;

      console.log("thisCaption", thisCaption);
      if (thisCaption !== "") {
        console.log('thisCaption !== ""', thisCaption);
        setCaption(thisCaption);
      }

      if (isFinal && speechFinal) {
        clearTimeout(captionTimeout.current);
        captionTimeout.current = setTimeout(() => {
          setCaption(undefined);
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, handleTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, handleAudioData);

      startMicrophone();
    }

    return () => {
      connection.removeListener(LiveTranscriptionEvents.Transcript, handleTranscript);
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, handleAudioData);
      clearTimeout(captionTimeout.current);
    };
  }, [connectionState]);

  return { caption };
};
