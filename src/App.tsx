import { useState, useCallback, useEffect, useRef } from 'react';
import {
  TapToBegin,
  StageCanvas,
  DistantSkyCanvas,
  HillsSilhouette,
  RooftopsSilhouette,
  GreetingCenterpiece,
  DiyaParapet,
  ControlsHeader,
  ControlsFooter,
  Toast,
} from './components';
import { useRecipient } from './hooks/useRecipient';
import { useTheme } from './hooks/useTheme';
import { useSoundEffects } from './hooks/useSoundEffects';
import { useIntroSequence } from './hooks/useIntroSequence';
import { DIYA_POSITIONS, DEFAULT_WISH } from './data/mockData';

export function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [showTapOverlay, setShowTapOverlay] = useState(true);
  const [flashActive, setFlashActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // Initialize 6 terracotta diyas
  const [diyas, setDiyas] = useState(() =>
    DIYA_POSITIONS.map((pos) => ({
      id: pos.id,
      lit: false,
    }))
  );

  const { recipientName } = useRecipient();
  const { theme, cycleTheme } = useTheme();
  const {
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
  } = useSoundEffects();

  const { stage, replay: replayIntro } = useIntroSequence(hasStarted);

  // Handle stage audio & visuals transitions
  useEffect(() => {
    if (stage === 'launching') {
      playRocketFuse();
    } else if (stage === 'ascending') {
      playRocketWhoosh();
    } else if (stage === 'bursting') {
      playRocketBurst();
      setFlashActive(true);
      const timer = setTimeout(() => setFlashActive(false), 240);
      return () => clearTimeout(timer);
    }
  }, [stage, playRocketFuse, playRocketWhoosh, playRocketBurst]);

  // Parallax camera offset during ascent
  const isAscending = stage === 'launching' || stage === 'ascending';
  const hillsOffsetY = isAscending ? 28 : 0;
  const rooftopsOffsetY = isAscending ? 48 : 0;

  // Staged visibility states based on timeline
  const isBlooming = stage === 'blooming' || stage === 'revealing' || stage === 'settled';
  const isSettled = stage === 'settled';
  const showOm = stage === 'revealing' || stage === 'settled';
  const showRecipient = Boolean(recipientName) && (stage === 'revealing' || stage === 'settled');
  const showHeadline = stage === 'revealing' || stage === 'settled';
  const showWish = stage === 'revealing' || stage === 'settled';
  const showHint = isSettled;
  const showUI = isSettled;

  // Start ceremony
  const handleStart = useCallback(() => {
    initAudio();
    setShowTapOverlay(false);
    setHasStarted(true);
  }, [initAudio]);

  // Ambient gentle bursting music in the background when settled at the main scene
  useEffect(() => {
    if (isSettled && !isMuted) {
      startBackgroundBursts();
      return () => stopBackgroundBursts();
    } else {
      stopBackgroundBursts();
    }
  }, [isSettled, isMuted, startBackgroundBursts, stopBackgroundBursts]);

  // Light individual diya
  const handleLightDiya = useCallback(
    (id: number) => {
      setDiyas((prev) => {
        const next = prev.map((d) => (d.id === id ? { ...d, lit: true } : d));
        playDiyaLight();
        return next;
      });
    },
    [playDiyaLight]
  );

  // Celebratory burst when all diyas are lit
  const handleAllDiyasLit = useCallback(() => {
    playCelebration();
    showToastNotification('All sacred diyas kindled! Shubh Deepavali! 🪔✨');
  }, [playCelebration]);

  // Rooftop terrace tap
  const handleRooftopClick = useCallback(
    (_normX: number) => {
      if (!isSettled) return;
      playFirework();
    },
    [isSettled, playFirework]
  );

  // Share functionality
  const toastTimerRef = useRef<number | null>(null);

  const showToastNotification = useCallback((msg: string) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    setToastVisible(true);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = null;
    }, 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = recipientName ? `Happy Diwali ${recipientName}` : 'Happy Diwali';
    const text = 'May the light of a thousand diyas guide your path to joy, prosperity, and peace.';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        // Fallback to clipboard if share cancelled/unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToastNotification('Diwali greeting link copied to clipboard! ✨');
    } catch {
      showToastNotification('Could not copy link');
    }
  }, [recipientName]);

  // Replay ceremony
  const handleReplay = useCallback(() => {
    // Reset diyas to unlit
    setDiyas((prev) => prev.map((d) => ({ ...d, lit: false })));
    replayIntro();
  }, [replayIntro]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden select-none bg-bg-night font-body text-text-cream">
      {/* Tap to Begin Entry Overlay */}
      <TapToBegin visible={showTapOverlay} onStart={handleStart} />

      {/* Optical Blur Atmospheric Distant Sky Canvas */}
      <DistantSkyCanvas isActive={isSettled} onDistantBurst={playDistantBurst} />

      {/* Foreground Canvas: Stars, Lanterns, Sparkles, Interactive Tap Fireworks */}
      <StageCanvas isActive={isSettled} introStage={stage} onExplode={playFirework} />

      {/* Dynamic Ambient Horizon Glow Wash */}
      <div
        className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none z-[12] mix-blend-screen filter blur-3xl opacity-70 transition-all duration-1000 ease-out"
        style={{ background: theme.aura }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none z-[13] mix-blend-screen filter blur-2xl opacity-60 transition-all duration-1000 ease-out"
        style={{ background: theme.horizon }}
      />

      {/* Parallax Layer 1: Distant Rolling Hills Silhouette */}
      <HillsSilhouette offsetY={hillsOffsetY} />

      {/* Sacred Blooming Mandala */}
      {/* <Mandala isBlooming={isBlooming} isSettled={isSettled} /> */}

      {/* Parallax Layer 2: Seamless Indian Rooftops with String Lights */}
      <RooftopsSilhouette
        offsetY={rooftopsOffsetY}
        onRooftopClick={handleRooftopClick}
        bulbColors={theme.bulbColors}
      />

      {/* Greeting Centerpiece */}
      <GreetingCenterpiece
        recipientName={recipientName}
        showRecipient={showRecipient}
        showOm={showOm}
        showHeadline={showHeadline}
        showWish={showWish}
        showHint={showHint}
        wishText={DEFAULT_WISH}
      />

      {/* Foreground 6 Authentic Terracotta Diyas */}
      <DiyaParapet
        diyas={diyas}
        onLight={handleLightDiya}
        interactive={isSettled}
        onAllLit={handleAllDiyasLit}
      />

      {/* Traditional Paisley / Mango Frame Accent */}
      {/* <PaisleyFrame visible={isSettled} /> */}

      {/* Minimalist Controls: Top Bar (Sound Mute, Theme Switch, Share) */}
      <ControlsHeader
        visible={showUI}
        isMuted={isMuted}
        themeName={theme.name}
        themeColor={theme.color}
        onToggleMute={toggleMute}
        onCycleTheme={cycleTheme}
        onShare={handleShare}
      />

      {/* Footer Controls: Replay button, discreet "Made with love" */}
      <ControlsFooter visible={showUI} onReplay={handleReplay} />

      {/* Soft Flash on Rocket Burst */}
      {/* <div
        aria-hidden="true"
        className={`absolute inset-0 bg-[#FFF3D6] pointer-events-none z-[70] transition-opacity duration-200 ${
          flashActive ? 'opacity-30' : 'opacity-0'
        }`}
      /> */}

      {/* Toast Notification Pill */}
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}

export default App;
