"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(false);
    }
    if (active && typeof active === "object") document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>
              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3 layoutId={`title-${active.title}-${id}`} className="font-bold text-neutral-700 dark:text-neutral-200">
                      {active.title}
                    </motion.h3>
                    <motion.p layoutId={`description-${active.description}-${id}`} className="text-neutral-600 dark:text-neutral-400">
                      {active.description}
                    </motion.p>
                  </div>
                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function" ? active.content() : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div>
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

// Cards wired to Justin's actual top projects (not the demo Lana Del Rey list).
const cards = [
  {
    description: "Modern Amenities · 2026",
    title: "Sales Agent",
    src: "https://placehold.co/800x600/0a2540/b8d4f0/png?text=Sales+Agent",
    ctaText: "View",
    ctaLink: "https://github.com/jhatch3",
    content: () => (
      <p>
        Production sales chatbot built on Claude + FastAPI, qualifying prospects across dozens of
        machines in a 3D/AR demo. Anthropic tool-use API emits structured CTAs the frontend
        renders deterministically. Red-teamed against 5 jailbreak vectors, all rejected via a
        single canonical refusal. Cut inference cost via prompt caching, added per-IP rate
        limiting, 24h token budget, and structured logs with cached-token counts.
      </p>
    ),
  },
  {
    description: "macOS sim · live AI bot · agent skills",
    title: "This Portfolio",
    src: "https://placehold.co/800x600/0a2540/b8d4f0/png?text=Portfolio",
    ctaText: "GitHub",
    ctaLink: "https://github.com/jhatch3/justin-portfolio",
    content: () => (
      <p>
        macOS desktop simulation with draggable, resizable windows, dock magnification, and ⌘K
        spotlight. Streaming Claude chatbot with prompt caching, sliding 24h rate limit, hardened
        against 12+ prompt-injection vectors. Custom agent skills (`/portfolio-projects`,
        `/portfolio-experience`, `/portfolio-now`) edit data.js + commit + push from any repo.
        Live data widgets: Coinbase WebSocket order book, real Yahoo Finance stock ticker via
        server proxy. iOS home-screen layout for phones; full macOS for desktop.
      </p>
    ),
  },
  {
    description: "Decentralized AI consensus · medical bills",
    title: "Lethe",
    src: "https://placehold.co/800x600/0a2540/b8d4f0/png?text=Lethe",
    ctaText: "GitHub",
    ctaLink: "https://github.com/jhatch3/lethe-",
    content: () => (
      <p>
        Decentralized AI consensus system that audits medical bills and disputes overcharges.
        Multi-agent verification across independent reviewers for tamper resistance.
        Privacy-preserving by design - never stores patient records. Python implementation.
      </p>
    ),
  },
  {
    description: "AI-governed prediction fund · Polymarket",
    title: "Evergreen Capital",
    src: "https://placehold.co/800x600/0a2540/b8d4f0/png?text=Evergreen",
    ctaText: "GitHub",
    ctaLink: "https://github.com/jhatch3/Evergreen-Capital",
    content: () => (
      <p>
        Decentralized, AI-governed prediction fund autonomously trading on Polymarket. Strategies
        generated by Google Gemini and executed via on-chain transactions. TypeScript core with
        pluggable strategy modules.
      </p>
    ),
  },
  {
    description: "Production churn prediction platform",
    title: "Retention Flow",
    src: "https://placehold.co/800x600/0a2540/b8d4f0/png?text=Retention+Flow",
    ctaText: "GitHub",
    ctaLink: "https://github.com/jhatch3/retention-flow",
    content: () => (
      <p>
        End-to-end customer churn prediction: ingestion, feature pipelines, model training, model
        serving. Reproducible MLOps - tracked experiments, versioned data, deployable model
        artifacts. Python + scikit-learn / XGBoost stack with proper cross-validation and holdout
        eval.
      </p>
    ),
  },
];
