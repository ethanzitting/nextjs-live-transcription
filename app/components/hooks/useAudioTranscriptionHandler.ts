import { useCallback, useEffect, useRef, useState } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgramContext,
} from "../../context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  useMicrophoneContext,
} from "../../context/MicrophoneContextProvider";

export const useAudioTranscriptionHandler = () => {
  const { connection, connectionState } = useDeepgramContext();
  const { microphone, startMicrophone } = useMicrophoneContext();

  const [caption, setCaption] = useState<string | undefined>(
    "Powered by Deepgram",
  );
  const captionTimeout = useRef<any>();

  const fixIosSafariBug = useCallback(
    (e: BlobEvent) => {
      if (!microphone) return;
      if (!connection) return;
      if (connectionState !== LiveConnectionState.OPEN) return;

      // iOS SAFARI FIX:
      // Prevent packetZero from being sent. If sent at size 0, the connection will close.
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    },
    [connection, connectionState, microphone],
  );

  useEffect(() => {
    if (!microphone) return;

    microphone.addEventListener(
      MicrophoneEvents.DataAvailable,
      fixIosSafariBug,
    );

    return () => {
      microphone.removeEventListener(
        MicrophoneEvents.DataAvailable,
        fixIosSafariBug,
      );
    };
  });

  const handleTranscriptTextStream = useCallback(
    (data: LiveTranscriptionEvent) => {
      console.log("Transcript event", data);
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
    },
    [],
  );

  useEffect(() => {
    if (!connection) return;

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(
        LiveTranscriptionEvents.Transcript,
        handleTranscriptTextStream,
      );

      startMicrophone();
    }

    return () => {
      connection.removeListener(
        LiveTranscriptionEvents.Transcript,
        handleTranscriptTextStream,
      );
      clearTimeout(captionTimeout.current);
    };
  }, [
    connection,
    connectionState,
    handleTranscriptTextStream,
    startMicrophone,
  ]);

  return { caption };
};
