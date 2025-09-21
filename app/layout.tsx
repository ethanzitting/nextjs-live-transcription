import { DeepgramContextProvider } from "./components/transcription/deepgramContextProvider";
import { MicrophoneContextProvider } from "./components/microphone/microphoneContextProvider";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-dvh">
      <body className={"h-full dark"}>
        <MicrophoneContextProvider>
          <DeepgramContextProvider>{children}</DeepgramContextProvider>
        </MicrophoneContextProvider>
      </body>
    </html>
  );
}
