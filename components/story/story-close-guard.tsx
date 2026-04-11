"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type StoryCloseGuardProps = {
  children: React.ReactNode;
  isPaused: boolean;
  onPause: () => void;
  onRequestClose: () => void;
};

export function StoryCloseGuard({
  children,
  isPaused,
  onPause,
  onRequestClose,
}: StoryCloseGuardProps) {
  const [mobileExitArmed, setMobileExitArmed] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onRequestClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRequestClose]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function armExitHint() {
    setMobileExitArmed(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setMobileExitArmed(false);
      timeoutRef.current = null;
    }, 2200);
  }

  function handleBackdropPointerDown(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (!isMobile) return;
    if (event.target !== event.currentTarget) return;
    if (!isPaused) {
      onPause();
      armExitHint();
      return;
    }
    if (mobileExitArmed) {
      onRequestClose();
      return;
    }
    armExitHint();
  }

  return (
    <div
      className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(53,92,214,0.28),transparent_42%),linear-gradient(180deg,#07111f_0%,#0b1325_52%,#070d18_100%)]"
      onPointerDown={handleBackdropPointerDown}
    >
      {children}
      <div
        className={cn(
          "pointer-events-none fixed left-1/2 top-5 z-[65] -translate-x-1/2 rounded-full border border-white/15 bg-black/70 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur transition-all duration-300",
          mobileExitArmed
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0"
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <AlertCircle className="size-4" />
          もう一度、外側をタップすると閉じます
        </span>
      </div>
    </div>
  );
}
