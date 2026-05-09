"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
  hideCursorOnDone?: boolean;
};

export function TypewriterText({
  text,
  speed = 120,
  className = "",
  onDone,
  hideCursorOnDone = true,
}: Props) {
  const [displayed, setDisplayed] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [finished, setFinished] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setFinished(false);
    const timer = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setFinished(true);
        onDoneRef.current?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  useEffect(() => {
    if (finished && hideCursorOnDone) return;
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, [finished, hideCursorOnDone]);

  return (
    <span className={className}>
      {displayed}
      <span
        className="ml-0.5 inline-block align-middle transition-opacity duration-75"
        style={{
          width: "2px",
          height: "0.9em",
          backgroundColor: "currentColor",
          opacity: cursorVisible ? 1 : 0,
        }}
      />
    </span>
  );
}
