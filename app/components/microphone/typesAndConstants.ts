export enum MicrophoneEvents {
  DataAvailable = "dataavailable",
  Error = "error",
  Pause = "pause",
  Resume = "resume",
  Start = "start",
  Stop = "stop",
}

export enum MicrophoneState {
  NotSetup = "not setup",
  SettingUp = "setting up",
  Ready = "ready",
  Opening = "opening",
  Open = "open",
  Error = "error",
  Pausing = "pausing",
  Paused = "paused",
}
