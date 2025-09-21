import { useEffect, useRef } from "react";
import {
  LiveConnectionState,
  useDeepgramContext,
} from "../../context/DeepgramContextProvider";
import {
  MicrophoneState,
  useMicrophoneContext,
} from "../../context/MicrophoneContextProvider";

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
