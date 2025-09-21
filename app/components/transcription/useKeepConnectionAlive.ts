import { useEffect, useRef } from "react";
import { useDeepgramContext } from "./deepgramContextProvider";
import { useMicrophoneContext } from "../microphone/microphoneContextProvider";
import { MicrophoneState } from "@/app/components/microphone/typesAndConstants";
import { LiveConnectionState } from "@deepgram/sdk";

export const useKeepConnectionLive = () => {
  const { connection, connectionState } = useDeepgramContext();
  const { microphoneState } = useMicrophoneContext();

  const keepAliveInterval = useRef<any>();

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
  }, [microphoneState, connectionState, connection]);
};
