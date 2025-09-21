import { useOnMount } from "@/app/components/hooks/useOnMount";
import { useMicrophoneContext } from "@/app/components/microphone/microphoneContextProvider";
import { useCallback, useEffect, useRef, useState } from "react";

const interpolateColor = (
  startColor: number[],
  endColor: number[],
  factor: number,
): number[] => {
  const result = [];
  for (let i = 0; i < startColor.length; i++) {
    result[i] = Math.round(
      startColor[i] + factor * (endColor[i] - startColor[i]),
    );
  }
  return result;
};

export const AudioVisualizer = () => {
  const { microphone } = useMicrophoneContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const initializeVisualizer = useCallback(() => {
    if (typeof window === "undefined") return;

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    setAnalyser(analyser);
    setDataArray(dataArray);
    setAudioContext(audioContext);
  }, []);
  useOnMount(initializeVisualizer);

  const draw = useCallback((): void => {
    if (!microphone || !audioContext || !analyser || !dataArray) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    if (!context) return;

    context.clearRect(0, 0, width, height);

    const barWidth = 10;
    let x = 0;
    const startColor = [19, 239, 147];
    const endColor = [20, 154, 251];

    for (const value of dataArray) {
      const barHeight = (value / 255) * height * 2;

      const interpolationFactor = value / 255;

      const color = interpolateColor(startColor, endColor, interpolationFactor);

      context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`;
      context.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
  }, [analyser, audioContext, dataArray, microphone]);

  useEffect(() => {
    if (!microphone || !audioContext || !analyser || !dataArray) return;

    const source = audioContext.createMediaStreamSource(microphone.stream);
    source.connect(analyser);

    draw();
  }, [microphone, audioContext, analyser, dataArray, draw]);

  if (!microphone) return null;

  return <canvas ref={canvasRef} width={window.innerWidth}></canvas>;
};
