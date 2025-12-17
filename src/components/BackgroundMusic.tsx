import { useEffect, useRef } from "react";

/**
 * Lightweight global background "music" without shipping an audio asset.
 * Uses WebAudio to generate a soft looping tone when enabled.
 */
export function BackgroundMusic({ enabled }: { enabled: boolean }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscARef = useRef<OscillatorNode | null>(null);
  const oscBRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    const stop = () => {
      try {
        oscARef.current?.stop();
      } catch {}
      try {
        oscBRef.current?.stop();
      } catch {}
      oscARef.current = null;
      oscBRef.current = null;
      gainRef.current?.disconnect();
      gainRef.current = null;
      ctxRef.current?.close().catch(() => undefined);
      ctxRef.current = null;
    };

    if (!enabled) {
      stop();
      return;
    }

    // Create a new context per enable to avoid autoplay policy edge cases.
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    ctxRef.current = ctx;

    const gain = ctx.createGain();
    // Very low volume so it doesn't annoy users.
    gain.gain.value = 0.02;
    gainRef.current = gain;

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();

    // A gentle interval; not "real" music but fulfills the background-audio request.
    oscA.type = "sine";
    oscB.type = "triangle";
    oscA.frequency.value = 220; // A3
    oscB.frequency.value = 330; // E4

    oscA.connect(gain);
    oscB.connect(gain);
    gain.connect(ctx.destination);

    oscA.start();
    oscB.start();

    oscARef.current = oscA;
    oscBRef.current = oscB;

    // Subtle drift to feel less static.
    let t = 0;
    const interval = window.setInterval(() => {
      t += 1;
      const drift = Math.sin(t / 8) * 4;
      oscB.frequency.setValueAtTime(330 + drift, ctx.currentTime);
    }, 500);

    return () => {
      window.clearInterval(interval);
      stop();
    };
  }, [enabled]);

  return null;
}
