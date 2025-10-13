"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function ScreensaverOverlay() {
  const [active, setActive] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [slotIdx, setSlotIdx] = useState<[number, number]>(() => [0, 1]);
  const [visibleSlot, setVisibleSlot] = useState<0 | 1>(0);
  const currentGlobalRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // idle activation
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // swap interval
  const fallbackRef = useRef<NodeJS.Timeout | null>(null); // fallback for image load
  const pendingSwapRef = useRef<{ slot: 0 | 1; idx: number } | null>(null);

  // Transition control state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageFadingIn, setImageFadingIn] = useState(false);
  const [imageFadeActive, setImageFadeActive] = useState(false);
  // timing constants (ms)
  const FADE_TO_BLACK_MS = 7500;
  const FADE_IN_MS = 7500;
  // how long each image stays visible before preparing the next one
  const DISPLAY_MS = 20 * 1000; // 20 seconds

  useEffect(() => {
    let mounted = true;

    async function fetchImages() {
      const BE_HOST = process.env.NEXT_PUBLIC_BE_HOST || (typeof window !== 'undefined' ? window.location.origin : '');
      const res = await fetch(`${BE_HOST}/api/images`);
      if (!res.ok) {
        return;
      }

      const data = await res.json();
      if (!mounted || !data || data.length === 0) {
          return;
      }

      const imagePaths: string[] = data
        .map((d: any) => String(`${BE_HOST}${d.image_path || ''}`).replace('/root', ''))
        .filter(Boolean);

      if (mounted) {
        setImages([...imagePaths]);
      }
    }

    fetchImages();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (images.length === 0) {
      return;
    }
    const first = 0;
    const second = images.length > 1 ? 1 : 0;
    setSlotIdx([first, second]);
    currentGlobalRef.current = first;
    setVisibleSlot(0);
  }, [images]);

  // Cycle images every 10s using double-buffered swap.
  // The hidden slot is prepared with the next src and we wait for its onLoad
  useEffect(() => {
    if (images.length <= 1) {
       return;
    }

    // clear any existing
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

  intervalRef.current = setInterval(() => {
      const hiddenSlot = (visibleSlot === 0 ? 1 : 0) as 0 | 1;
      const nextGlobal = (currentGlobalRef.current + 1) % images.length;

      // prepare hidden slot with the next image while the visible one remains displayed
      setSlotIdx((prev) => {
        const next: [number, number] = [...prev];
        next[hiddenSlot] = nextGlobal;
        return next;
      });

      // mark pending swap and wait for hidden image to load (or fallback)
      pendingSwapRef.current = { slot: hiddenSlot, idx: nextGlobal };

      // fallback: if load handler doesn't fire in time, force the swap after 1.5s
      if (fallbackRef.current) {
        clearTimeout(fallbackRef.current);
      }

      fallbackRef.current = setTimeout(() => {
        if (pendingSwapRef.current) {
          performSwap(pendingSwapRef.current.slot, pendingSwapRef.current.idx);
        }
      }, 1500);
  }, DISPLAY_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = null;
      
      if (fallbackRef.current) {
        clearTimeout(fallbackRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, visibleSlot]);

  // perform the visible/hidden swap: show `slot` and update the global index
  function performSwap(slot: 0 | 1, idx: number) {
    // Orchestrate a fade-to-black, swap, then slow fade-in of the new image.
    if (fallbackRef.current) {
      clearTimeout(fallbackRef.current);
      fallbackRef.current = null;
    }

    // start fade-to-black overlay
    setIsTransitioning(true);

    // after overlay is fully opaque, swap the visible slot and start fade-in
    setTimeout(() => {
      setVisibleSlot(slot);
      currentGlobalRef.current = idx;
      // begin the image fade-in phase
      setImageFadingIn(true);

      // trigger the image opacity transition on the next frame
      requestAnimationFrame(() => requestAnimationFrame(() => setImageFadeActive(true)));

      // when fade-in completes, clear transition flags
      setTimeout(() => {
        setImageFadingIn(false);
        setImageFadeActive(false);
        setIsTransitioning(false);
        pendingSwapRef.current = null;
      }, FADE_IN_MS);
    }, FADE_TO_BLACK_MS);
  }

  // helper to compose the className for a given slot (keeps class logic in one place)
  const slotClass = (slot: 0 | 1) => {
    const base = 'absolute inset-0 m-auto';
    const visibility = visibleSlot === slot ? 'opacity-100' : 'opacity-0';
    return `${base} ${visibility} h-screen w-auto object-contain rounded-lg shadow-2xl`;
  };

  // return a style object that includes an explicit `transition` string so duration
  // and easing are applied reliably regardless of generated CSS classes
  const imageStyle = (slot: 0 | 1) => {
    const duration = imageFadingIn && visibleSlot === slot ? FADE_IN_MS : 600;
    return { transition: `opacity ${duration}ms ease-in-out` } as React.CSSProperties;
  };

  // Listen for user activity to enable/disable screensaver and reset timers
  useEffect(() => {
    const resetTimer = () => {
      setActive(false);
      // reset to first image
      setSlotIdx((s) => [0, s[1] ?? 0]);
      currentGlobalRef.current = 0;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setActive(true);
      }, 120 * 1000); //120 * 1000ms => 120000ms => 2 minutes
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
      }
      
      if (fallbackRef.current) {
        clearTimeout(fallbackRef.current);
      }
    };
  }, []);

  if (!active || images.length === 0) {
    return null;
  }

  const wrapperClass = "fixed inset-0 w-screen h-screen bg-black z-[9999] flex items-center justify-center cursor-none";

  return (
    <div className={wrapperClass} onClick={() => setActive(false)}>
      <div className="relative h-screen w-screen flex items-center justify-center">
        {/* full-screen fade-to-black overlay used during transitions */}
        <div
          className="absolute inset-0 bg-black pointer-events-none transition-opacity"
          style={{ transitionDuration: `${FADE_TO_BLACK_MS}ms`, opacity: isTransitioning ? 1 : 0 }}
        />
        {/* Slot 0 - Next/Image with fill; height controlled via tailwind `h-screen` */}
        <Image
          src={images[slotIdx[0]]}
          alt="Screensaver image 0"
          fill
          onLoadingComplete={() => {
            const pending = pendingSwapRef.current;
            if (pending && pending.slot === 0 && pending.idx === slotIdx[0]) {
              performSwap(0, pending.idx);
            }
          }}
          className={slotClass(0)}
          style={imageStyle(0)}
        />

        {/* Slot 1 */}
        <Image
          src={images[slotIdx[1]]}
          alt="Screensaver image 1"
          fill
          onLoadingComplete={() => {
            const pending = pendingSwapRef.current;
            if (pending && pending.slot === 1 && pending.idx === slotIdx[1]) {
              performSwap(1, pending.idx);
            }
          }}
          className={slotClass(1)}
          style={imageStyle(1)}
        />
      </div>
    </div>
  );
}
