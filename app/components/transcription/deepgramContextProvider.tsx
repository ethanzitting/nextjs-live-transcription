"use client";

import { useLogIfVariableChanges } from "@/app/components/hooks/useLogIfVariableChanges";
import {
  createClient,
  LiveClient,
  LiveConnectionState,
  type LiveSchema,
  type LiveTranscriptionEvent,
  LiveTranscriptionEvents
} from "@deepgram/sdk";

import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useState } from "react";

interface DeepgramContextType {
  connection: LiveClient | null;
  connectToDeepgram: (options: LiveSchema, endpoint?: string) => Promise<void>;
  disconnectFromDeepgram: () => void;
  connectionState: LiveConnectionState;
}

const defaultDeepgramContext: DeepgramContextType = {
  connection: null,
  connectToDeepgram: async () => {},
  disconnectFromDeepgram: () => {},
  connectionState: LiveConnectionState.CLOSED,
};

const DeepgramContext = createContext<DeepgramContextType>(
  defaultDeepgramContext,
);

export function useDeepgramContext(): DeepgramContextType {
  return useContext(DeepgramContext);
}

interface DeepgramContextProviderProps {
  children: ReactNode;
}

const getToken = async (): Promise<string> => {
  const response = await fetch("/api/authenticate", { cache: "no-store" });
  const result = await response.json();
  return result.access_token;
};

const DeepgramContextProvider: FunctionComponent<
  DeepgramContextProviderProps
> = ({ children }) => {
  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [connectionState, setConnectionState] = useState<LiveConnectionState>(
    LiveConnectionState.CLOSED,
  );

  useLogIfVariableChanges(connection, "connection");
  /**
   * Connects to the Deepgram speech recognition service and sets up a live transcription session.
   *
   * @param options - The configuration options for the live transcription session.
   * @param endpoint - The optional endpoint URL for the Deepgram service.
   * @returns A Promise that resolves when the connection is established.
   */
  const connectToDeepgram = useCallback(
    async (options: LiveSchema, endpoint?: string) => {
      const token = await getToken();
      const deepgram = createClient({ accessToken: token });

      const conn = deepgram.listen.live(options, endpoint);

      conn.addListener(LiveTranscriptionEvents.Open, () => {
        setConnectionState(LiveConnectionState.OPEN);
      });

      conn.addListener(LiveTranscriptionEvents.Close, () => {
        setConnectionState(LiveConnectionState.CLOSED);
      });

      setConnection(conn);
    },
    [],
  );

  const disconnectFromDeepgram = useCallback(async () => {
    if (connection) {
      connection.finish();
      setConnection(null);
    }
  }, [connection]);

  return (
    <DeepgramContext.Provider
      value={{
        connection,
        connectToDeepgram,
        disconnectFromDeepgram,
        connectionState,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

export {
  DeepgramContextProvider,
  LiveConnectionState,
  LiveTranscriptionEvents,
  type LiveTranscriptionEvent,
};
