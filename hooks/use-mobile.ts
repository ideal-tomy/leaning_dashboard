"use client";

import { useEffect, useState } from "react";

/** Viewport width &lt; breakpoint (default md = 768) */
export function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const fn = () => setMobile(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [breakpoint]);
  return mobile;
}
