import { useEffect, useRef } from "react";
import {
  LiveConnectionState,
} from "../../context/DeepgramContextProvider";
import { MicrophoneState } from "../../context/MicrophoneContextProvider";
import { ListenLiveClient } from "@deepgram/sdk";

interface UseConnectionKeepAliveProps {
  connection: ListenLiveClient | null;
  microphoneState: MicrophoneState | null;
  connectionState: LiveConnectionState;
}

export const useConnectionKeepAlive = ({
  connection,
  microphoneState,
  connectionState,
}: UseConnectionKeepAliveProps) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);
};
