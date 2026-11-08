import { useRef, useCallback, useState, useEffect } from 'react';

export interface UseSoundEffectsReturn {
  readonly isMuted: boolean;
  readonly toggleMute: () => void;
  readonly initAudio: () => void;
  readonly playRocketFuse: () => void;
  readonly playRocketWhoosh: () => void;
  readonly playRocketBurst: () => void;
  readonly playDiyaLight: () => void;
  readonly playFirework: () => void;
  readonly playCelebration: () => void;
  readonly playDistantBurst: (volumeMultiplier?: number) => void;
  readonly startBackgroundBursts: () => void;
  readonly stopBackgroundBursts: () => void;
}

export function useSoundEffects(): UseSoundEffectsReturn {
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const isPlayingAmbientRef = useRef(false);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const initAudio = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (!isPlayingAmbientRef.current && !isMuted) {
      try {
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
        masterGain.connect(ctx.destination);
        ambientGainRef.current = masterGain;

        // Warm festive Indian drone (Sa-Pa drone - D note 146.8Hz + A note 220Hz + overtone 293.6Hz)
        const droneFreqs = [146.83, 220.00, 293.66, 440.00];
        droneFreqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Subtle slow chorus detune
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.2 + idx * 0.1, ctx.currentTime);
          lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
          lfo.connect(osc.frequency);
          lfo.start();

          oscGain.gain.setValueAtTime(0.05 / (idx + 1), ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start();
        });

        isPlayingAmbientRef.current = true;
      } catch (err) {
        console.warn('Ambient audio init failed:', err);
      }
    }
  }, [getAudioContext, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (ambientGainRef.current && audioCtxRef.current) {
        ambientGainRef.current.gain.setValueAtTime(next ? 0 : 0.04, audioCtxRef.current.currentTime);
      }
      return next;
    });
  }, []);

  // const playRocketFuse = useCallback(() => {
  //   if (isMuted) return;
  //   const ctx = getAudioContext();
  //   if (!ctx) return;

  //   // Filtered noise for fuse hiss
  //   const bufferSize = ctx.sampleRate * 0.4;
  //   const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  //   const data = buffer.getChannelData(0);
  //   for (let i = 0; i < bufferSize; i++) {
  //     data[i] = Math.random() * 2 - 1;
  //   }

  //   const noise = ctx.createBufferSource();
  //   noise.buffer = buffer;

  //   const filter = ctx.createBiquadFilter();
  //   filter.type = 'bandpass';
  //   filter.frequency.setValueAtTime(3200, ctx.currentTime);
  //   filter.Q.setValueAtTime(4, ctx.currentTime);

  //   const gain = ctx.createGain();
  //   gain.gain.setValueAtTime(0.08, ctx.currentTime);
  //   gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

  //   noise.connect(filter);
  //   filter.connect(gain);
  //   gain.connect(ctx.destination);
  //   noise.start();
  // }, [getAudioContext, isMuted]);





  //new ai 
  const playRocketFuse = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const duration = 0.85; // A longer duration for a proper launch sequence

    // Create a shared white noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // ==========================================
    // LAYER 1: The Air Whoosh (Sweeping Bandpass)
    // ==========================================
    const whooshSrc = ctx.createBufferSource();
    whooshSrc.buffer = buffer;

    const whooshFilter = ctx.createBiquadFilter();
    whooshFilter.type = 'bandpass';
    // Sweep from a low rushing wind to a high-pitched hiss (acceleration)
    whooshFilter.frequency.setValueAtTime(400, t);
    whooshFilter.frequency.exponentialRampToValueAtTime(4500, t + duration);
    whooshFilter.Q.value = 1.5; // Wider resonance for a thicker wind sound

    const whooshGain = ctx.createGain();
    // Swell in volume as the rocket accelerates, then fade right before the burst
    whooshGain.gain.setValueAtTime(0.001, t);
    whooshGain.gain.exponentialRampToValueAtTime(0.2, t + duration * 0.7);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    whooshSrc.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whooshSrc.start(t);

    // ==========================================
    // LAYER 2: The Engine/Combustion Rumble
    // ==========================================
    const rumbleSrc = ctx.createBufferSource();
    rumbleSrc.buffer = buffer;

    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    // Keep it muffled but let slightly higher frequencies in as it burns
    rumbleFilter.frequency.setValueAtTime(150, t);
    rumbleFilter.frequency.linearRampToValueAtTime(600, t + duration);

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.3, t);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    rumbleSrc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(ctx.destination);
    rumbleSrc.start(t);

  }, [getAudioContext, isMuted]);


  const playRocketWhoosh = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    // Upward pitch sweep
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1.8);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.9);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.0);
  }, [getAudioContext, isMuted]);

  // const playRocketBurst = useCallback(() => {
  //   if (isMuted) return;
  //   const ctx = getAudioContext();
  //   if (!ctx) return;

  //   // Low boom oscillator
  //   const osc = ctx.createOscillator();
  //   const oscGain = ctx.createGain();
  //   osc.type = 'triangle';
  //   osc.frequency.setValueAtTime(140, ctx.currentTime);
  //   osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.8);

  //   oscGain.gain.setValueAtTime(0.25, ctx.currentTime);
  //   oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

  //   osc.connect(oscGain);
  //   oscGain.connect(ctx.destination);
  //   osc.start();
  //   osc.stop(ctx.currentTime + 0.9);

  //   // Crackle noise burst
  //   const bufferSize = ctx.sampleRate * 0.6;
  //   const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  //   const data = buffer.getChannelData(0);
  //   for (let i = 0; i < bufferSize; i++) {
  //     data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
  //   }

  //   const noise = ctx.createBufferSource();
  //   noise.buffer = buffer;
  //   const noiseFilter = ctx.createBiquadFilter();
  //   noiseFilter.type = 'lowpass';
  //   noiseFilter.frequency.setValueAtTime(1600, ctx.currentTime);

  //   const noiseGain = ctx.createGain();
  //   noiseGain.gain.setValueAtTime(0.18, ctx.currentTime);
  //   noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

  //   noise.connect(noiseFilter);
  //   noiseFilter.connect(noiseGain);
  //   noiseGain.connect(ctx.destination);
  //   noise.start();
  // }, [getAudioContext, isMuted]);


  //new ai code 
  const playRocketBurst = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // ==========================================
    // LAYER 1: The Deep Boom (Sub-bass impact)
    // ==========================================
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();

    // Sine gives a cleaner, heavier thump than triangle
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(160, t);
    // Rapidly pitch down to simulate the concussive wave
    boomOsc.frequency.exponentialRampToValueAtTime(20, t + 1.2);

    boomGain.gain.setValueAtTime(0.6, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start(t);
    boomOsc.stop(t + 1.2);

    // ==========================================
    // LAYER 2: The Main Explosion (White Noise)
    // ==========================================
    const bufferSize = ctx.sampleRate * 1.5;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Standard white noise
      noiseData[i] = Math.random() * 2 - 1;
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;

    // Filter sweeps down to simulate sound muffling as it travels
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(4000, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(300, t + 1.2);

    const noiseGain = ctx.createGain();
    // Quick attack, exponential decay
    noiseGain.gain.setValueAtTime(0.001, t);
    noiseGain.gain.linearRampToValueAtTime(0.5, t + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSrc.start(t);

    // ==========================================
    // LAYER 3: The Sizzle/Sparks (Sparse Crackle)
    // ==========================================
    const crackleBuffer = ctx.createBuffer(1, ctx.sampleRate * 1.0, ctx.sampleRate);
    const crackleData = crackleBuffer.getChannelData(0);

    for (let i = 0; i < crackleBuffer.length; i++) {
      // Create sparse spikes instead of continuous noise for a "crackle" effect
      if (Math.random() > 0.97) {
        crackleData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.4));
      } else {
        crackleData[i] = 0;
      }
    }

    const crackleSrc = ctx.createBufferSource();
    crackleSrc.buffer = crackleBuffer;

    // Highpass keeps only the crisp, piercing fizzle sounds
    const crackleFilter = ctx.createBiquadFilter();
    crackleFilter.type = 'highpass';
    crackleFilter.frequency.value = 3500;

    const crackleGain = ctx.createGain();
    crackleGain.gain.setValueAtTime(0, t);
    crackleGain.gain.linearRampToValueAtTime(0.4, t + 0.1);
    crackleGain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);

    crackleSrc.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(ctx.destination);
    crackleSrc.start(t);

  }, [getAudioContext, isMuted]);


  const playDiyaLight = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Gentle sacred bell/chime harmonic
    const freqs = [587.33, 880.00, 1174.66]; // D5, A5, D6
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.07 / (i + 1), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    });
  }, [getAudioContext, isMuted]);

  // const playFirework = useCallback(() => {
  //   if (isMuted) return;
  //   const ctx = getAudioContext();
  //   if (!ctx) return;

  //   const t = ctx.currentTime;

  //   // Small pop
  //   const osc = ctx.createOscillator();
  //   const gain = ctx.createGain();
  //   osc.type = 'sine';
  //   osc.frequency.setValueAtTime(320 + Math.random() * 140, t);
  //   osc.frequency.exponentialRampToValueAtTime(75, t + 0.28);

  //   gain.gain.setValueAtTime(0.12, t);
  //   gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

  //   osc.connect(gain);
  //   gain.connect(ctx.destination);
  //   osc.start(t);
  //   osc.stop(t + 0.3);

  //   // Subtle sizzle crackle
  //   const bufferSize = Math.floor(ctx.sampleRate * 0.25);
  //   const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  //   const data = buffer.getChannelData(0);
  //   for (let i = 0; i < bufferSize; i++) {
  //     data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
  //   }

  //   const noise = ctx.createBufferSource();
  //   noise.buffer = buffer;
  //   const filter = ctx.createBiquadFilter();
  //   filter.type = 'highpass';
  //   filter.frequency.setValueAtTime(1800, t);

  //   const noiseGain = ctx.createGain();
  //   noiseGain.gain.setValueAtTime(0.05, t);
  //   noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

  //   noise.connect(filter);
  //   filter.connect(noiseGain);
  //   noiseGain.connect(ctx.destination);
  //   noise.start(t + 0.02);
  // }, [getAudioContext, isMuted]);



  const playFirework = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // ==========================================
    // LAYER 1: The Concussive Crack (Casing Burst)
    // ==========================================
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    // A triangle wave gives a slightly harsher, sharper "snap" than a sine wave
    osc.type = 'triangle';
    // Start very high and drop almost instantly to simulate the physical "crack"
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

    // Very fast, hard attack
    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.6);

    // ==========================================
    // LAYER 2: The Blast Wash (Air Displacement)
    // ==========================================
    const blastDuration = 0.4;
    const blastBuffer = ctx.createBuffer(1, ctx.sampleRate * blastDuration, ctx.sampleRate);
    const blastData = blastBuffer.getChannelData(0);

    // Dense white noise for the immediate explosion body
    for (let i = 0; i < blastBuffer.length; i++) {
      blastData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
    }

    const blastNoise = ctx.createBufferSource();
    blastNoise.buffer = blastBuffer;

    const blastFilter = ctx.createBiquadFilter();
    blastFilter.type = 'lowpass';
    // Sweep the filter down rapidly. As the explosion expands, it loses high frequencies.
    blastFilter.frequency.setValueAtTime(4000, t);
    blastFilter.frequency.exponentialRampToValueAtTime(200, t + 0.35);

    const blastGain = ctx.createGain();
    blastGain.gain.setValueAtTime(0.4, t);
    blastGain.gain.exponentialRampToValueAtTime(0.001, t + blastDuration);

    blastNoise.connect(blastFilter);
    blastFilter.connect(blastGain);
    blastGain.connect(ctx.destination);
    blastNoise.start(t);

    // ==========================================
    // LAYER 3: The Spark Scatter (Trailing Crackle)
    // ==========================================
    const sparkDuration = 1.2;
    const sparkBuffer = ctx.createBuffer(1, ctx.sampleRate * sparkDuration, ctx.sampleRate);
    const sparkData = sparkBuffer.getChannelData(0);

    for (let i = 0; i < sparkBuffer.length; i++) {
      // Sparse noise! Only generate a spike 3% of the time to sound like individual burning fragments
      if (Math.random() > 0.97) {
        sparkData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.45));
      } else {
        sparkData[i] = 0;
      }
    }

    const sparkNoise = ctx.createBufferSource();
    sparkNoise.buffer = sparkBuffer;

    const sparkFilter = ctx.createBiquadFilter();
    sparkFilter.type = 'highpass';
    sparkFilter.frequency.setValueAtTime(2200, t); // Keep it crisp and metallic

    const sparkGain = ctx.createGain();
    // The sparks actually get slightly louder right after the main blast, then slowly fade
    sparkGain.gain.setValueAtTime(0, t);
    sparkGain.gain.linearRampToValueAtTime(0.2, t + 0.05);
    sparkGain.gain.exponentialRampToValueAtTime(0.001, t + sparkDuration);

    sparkNoise.connect(sparkFilter);
    sparkFilter.connect(sparkGain);
    sparkGain.connect(ctx.destination);
    sparkNoise.start(t);

  }, [getAudioContext, isMuted]);


  const playCelebration = useCallback(() => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    // Triumphant Diwali chord arpeggio
    const arpeggio = [293.66, 369.99, 440.00, 587.33, 739.99, 880.00];
    arpeggio.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 1.2);
    });
  }, [getAudioContext, isMuted]);

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const burstTimerRef = useRef<number | null>(null);

  /**
   * Delicate distant firework burst with soft thump, gentle crackle, and festive musical chime
   */
  // const playDistantBurst = useCallback((volumeMultiplier = 1) => {
  //   if (isMutedRef.current) return;
  //   const ctx = getAudioContext();
  //   if (!ctx) return;

  //   try {
  //     const t = ctx.currentTime;

  //     // 1. Soft muffled distant thump (sine drop 68Hz -> 28Hz)
  //     const osc = ctx.createOscillator();
  //     const oscGain = ctx.createGain();
  //     osc.type = 'sine';
  //     osc.frequency.setValueAtTime(65 + Math.random() * 25, t);
  //     osc.frequency.exponentialRampToValueAtTime(26, t + 0.42);

  //     const oscVol = (0.045 + Math.random() * 0.025) * volumeMultiplier;
  //     oscGain.gain.setValueAtTime(oscVol, t);
  //     oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

  //     osc.connect(oscGain);
  //     oscGain.connect(ctx.destination);
  //     osc.start(t);
  //     osc.stop(t + 0.48);

  //     // 2. Distant crackle/sparkle noise (bandpass filtered)
  //     const bufferSize = Math.floor(ctx.sampleRate * (0.28 + Math.random() * 0.18));
  //     const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  //     const data = buffer.getChannelData(0);
  //     for (let i = 0; i < bufferSize; i++) {
  //       const spike = Math.random() > 0.86 ? (Math.random() * 2 - 1) * 1.6 : (Math.random() * 2 - 1) * 0.35;
  //       data[i] = spike * Math.exp(-i / (ctx.sampleRate * 0.12));
  //     }

  //     const noise = ctx.createBufferSource();
  //     noise.buffer = buffer;
  //     const noiseFilter = ctx.createBiquadFilter();
  //     noiseFilter.type = 'bandpass';
  //     noiseFilter.frequency.setValueAtTime(1400 + Math.random() * 800, t);
  //     noiseFilter.Q.setValueAtTime(2.2, t);

  //     const noiseGain = ctx.createGain();
  //     const noiseVol = (0.03 + Math.random() * 0.02) * volumeMultiplier;
  //     noiseGain.gain.setValueAtTime(noiseVol, t);
  //     noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + bufferSize / ctx.sampleRate);

  //     noise.connect(noiseFilter);
  //     noiseFilter.connect(noiseGain);
  //     noiseGain.connect(ctx.destination);
  //     noise.start(t + 0.03);

  //     // 3. Delicate musical chime overtone (melodic bursting harmonics)
  //     // Indian classical pentatonic Raag Bhupali/Yaman tones: D4, E4, F#4, A4, B4, D5
  //     const notes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33];
  //     const noteFreq = notes[Math.floor(Math.random() * notes.length)];
  //     const chimeOsc = ctx.createOscillator();
  //     const chimeGain = ctx.createGain();
  //     chimeOsc.type = 'sine';
  //     chimeOsc.frequency.setValueAtTime(noteFreq, t + 0.02);

  //     const chimeVol = (0.022 + Math.random() * 0.015) * volumeMultiplier;
  //     chimeGain.gain.setValueAtTime(0, t);
  //     chimeGain.gain.linearRampToValueAtTime(chimeVol, t + 0.04);
  //     chimeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);

  //     chimeOsc.connect(chimeGain);
  //     chimeGain.connect(ctx.destination);
  //     chimeOsc.start(t + 0.02);
  //     chimeOsc.stop(t + 0.8);
  //   } catch {
  //     // AudioContext interrupted/not ready
  //   }
  // }, [getAudioContext]);


  const playDistantBurst = useCallback((volumeMultiplier = 1) => {
    if (isMutedRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;

      // ==========================================
      // GLOBAL FX: Distance Delay (City/Valley Echo)
      // ==========================================
      // Distant sounds bounce off buildings and hills, creating a rolling echo.
      const delayNode = ctx.createDelay();
      delayNode.delayTime.value = 0.25 + Math.random() * 0.15; // 250ms to 400ms echo

      const delayFeedback = ctx.createGain();
      delayFeedback.gain.value = 0.25; // Determines how many times it echoes

      // Create the feedback loop
      delayNode.connect(delayFeedback);
      delayFeedback.connect(delayNode);

      // Master output mix
      const masterOutput = ctx.createGain();
      masterOutput.connect(ctx.destination);
      delayNode.connect(masterOutput);

      // ==========================================
      // LAYER 1: The Rolling Thump (Low Rumble)
      // ==========================================
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';

      osc.frequency.setValueAtTime(60 + Math.random() * 20, t);
      osc.frequency.exponentialRampToValueAtTime(25, t + 1.0); // Longer frequency drop

      const oscVol = (0.06 + Math.random() * 0.03) * volumeMultiplier;
      oscGain.gain.setValueAtTime(0, t);
      // Slower attack: Distance smooths out sharp transients, turning them into rumbles
      oscGain.gain.linearRampToValueAtTime(oscVol, t + 0.08);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4); // Extended rolling tail

      osc.connect(oscGain);
      oscGain.connect(masterOutput); // Send to main out
      oscGain.connect(delayNode);    // Send to echo
      osc.start(t);
      osc.stop(t + 1.5);

      // ==========================================
      // LAYER 2: The Muffled Crackle (Air wash)
      // ==========================================
      const bufferSize = Math.floor(ctx.sampleRate * 0.5);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Softer noise spikes for distance
        const spike = Math.random() > 0.90 ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.2;
        data[i] = spike * Math.exp(-i / (ctx.sampleRate * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';

      // Much lower frequency than before! Distance kills high treble.
      noiseFilter.frequency.setValueAtTime(600 + Math.random() * 400, t);
      noiseFilter.Q.setValueAtTime(1.5, t); // Wider, washier sound

      const noiseGain = ctx.createGain();
      const noiseVol = (0.02 + Math.random() * 0.015) * volumeMultiplier;

      noiseGain.gain.setValueAtTime(0, t);
      noiseGain.gain.linearRampToValueAtTime(noiseVol, t + 0.06); // Soft, washing transient
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterOutput);
      noiseGain.connect(delayNode);
      noise.start(t);

      // ==========================================
      // LAYER 3: Delicate musical chime overtone
      // ==========================================
      // Indian classical pentatonic Raag Bhupali/Yaman tones: D4, E4, F#4, A4, B4, D5
      const notes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33];
      const noteFreq = notes[Math.floor(Math.random() * notes.length)];

      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';

      // Add a tiny pitch bend to simulate wind/atmospheric distortion on the tone
      chimeOsc.frequency.setValueAtTime(noteFreq + 3, t);
      chimeOsc.frequency.linearRampToValueAtTime(noteFreq, t + 0.15);

      const chimeVol = (0.015 + Math.random() * 0.01) * volumeMultiplier;
      chimeGain.gain.setValueAtTime(0, t);
      chimeGain.gain.linearRampToValueAtTime(chimeVol, t + 0.15); // Very soft fade-in
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(masterOutput);
      chimeGain.connect(delayNode);
      chimeOsc.start(t);
      chimeOsc.stop(t + 1.3);

      // Clean up audio graph nodes after decay tail finishes to prevent memory/CPU accumulation
      window.setTimeout(() => {
        try {
          delayNode.disconnect();
          delayFeedback.disconnect();
          masterOutput.disconnect();
        } catch {
          // Context might already be closed
        }
      }, 2000);

    } catch {
      // AudioContext interrupted/not ready
    }
  }, [getAudioContext]);



  const stopBackgroundBursts = useCallback(() => {
    if (burstTimerRef.current !== null) {
      window.clearTimeout(burstTimerRef.current);
      burstTimerRef.current = null;
    }
  }, []);

  const startBackgroundBursts = useCallback(() => {
    stopBackgroundBursts();

    const scheduleNext = () => {
      // Random interval between 2.2 and 4.2 seconds
      const delay = Math.random() * 2000 + 2200;
      burstTimerRef.current = window.setTimeout(() => {
        if (!isMutedRef.current) {
          playDistantBurst(0.65);
        }
        scheduleNext();
      }, delay);
    };

    scheduleNext();
  }, [stopBackgroundBursts, playDistantBurst]);

  useEffect(() => {
    return () => {
      stopBackgroundBursts();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => { });
      }
    };
  }, [stopBackgroundBursts]);

  return {
    isMuted,
    toggleMute,
    initAudio,
    playRocketFuse,
    playRocketWhoosh,
    playRocketBurst,
    playDiyaLight,
    playFirework,
    playCelebration,
    playDistantBurst,
    startBackgroundBursts,
    stopBackgroundBursts,
  };
}
