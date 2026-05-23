"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type ScrollRevealVariant = "up" | "down" | "left" | "right" | "fade" | "scale";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  variant?: ScrollRevealVariant;
  /** Stagger delay in ms */
  delay?: number;
  /** Animation duration in ms */
  duration?: number;
  /** 0–1, how much of element must be visible */
  threshold?: number;
  /** Only animate the first time into view */
  once?: boolean;
  as?: "div" | "section" | "article" | "li";
};

export default function ScrollReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
  duration = 700,
  threshold = 0.12,
  once = true,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const style = {
    "--reveal-delay": `${delay}ms`,
    "--reveal-duration": `${duration}ms`,
  } as CSSProperties;

  return createElement(
    Tag,
    {
      ref,
      className: [
        "scroll-reveal",
        `scroll-reveal-${variant}`,
        visible ? "scroll-reveal-visible" : "",
        className,
      ]
        .filter(Boolean)
        .join(" "),
      style,
    },
    children
  );
}
