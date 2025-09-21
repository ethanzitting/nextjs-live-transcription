"use client";

import {
  createClient,
  LiveClient,
  LiveConnectionState,
  type LiveSchema,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";

import {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { getToken } from "@/app/components/transcription/utils";

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

const deepgramContext = createContext<DeepgramContextType>(
  defaultDeepgramContext,
);

export function useDeepgramContext(): DeepgramContextType {
  return useContext(deepgramContext);
}

interface DeepgramContextProviderProps {
  children: ReactNode;
}

export const DeepgramContextProvider: FunctionComponent<
  DeepgramContextProviderProps
> = ({ children }) => {
  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [connectionState, setConnectionState] = useState<LiveConnectionState>(
    LiveConnectionState.CLOSED,
  );

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

  const value = useMemo(() => {
    return {
      connection,
      connectToDeepgram,
      disconnectFromDeepgram,
      connectionState,
    };
  }, [connection, connectToDeepgram, disconnectFromDeepgram, connectionState]);

  return (
    <deepgramContext.Provider value={value}>
      {children}
    </deepgramContext.Provider>
  );
};
