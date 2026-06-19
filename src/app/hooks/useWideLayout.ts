import { useState, useEffect } from "react";

export function useWideLayout(breakpoint = 900) {
  const query = `(min-width: ${breakpoint}px)`;
  const [wide, setWide] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return wide;
}
