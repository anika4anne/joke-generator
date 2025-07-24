"use client";

import { useState } from "react";

export default function HomePage() {
  const [joke, setJoke] = useState(
    "Why don't scientists trust atoms? Because they make up everything!",
  );

  // Placeholder for animation (wiggle)
  const emojiClass =
    "inline-block animate-bounce text-7xl md:text-8xl drop-shadow-lg mb-6";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 text-white">
      <div className="flex w-full max-w-xl flex-col items-center gap-8">
        <span className={emojiClass} role="img" aria-label="laughing emoji">
          😂
        </span>
        <h1 className="text-center text-4xl font-extrabold tracking-tight md:text-6xl">
          Welcome to{" "}
          <span className="text-[hsl(200,100%,70%)]">Joke Generator</span>
        </h1>
        <div className="flex w-full flex-col items-center gap-4 rounded-xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-md">
          <p className="min-h-[60px] text-center text-xl font-medium md:text-2xl">
            {joke}
          </p>
          <button
            className="mt-2 rounded-full bg-[hsl(200,100%,70%)] px-8 py-3 text-lg font-bold text-[#15162c] shadow-md transition-all duration-200 hover:scale-105 hover:bg-[hsl(200,100%,80%)] focus:ring-2 focus:ring-white/50 focus:outline-none"
            onClick={() =>
              setJoke(
                "Why did the chicken join a band? Because it had the drumsticks!",
              )
            }
          >
            Generate Joke
          </button>
        </div>
        <p className="mt-8 text-center text-sm text-white/60">
          Enjoy a random joke every time you click!
          <br />
          Built with Next.js & Tailwind CSS
        </p>
      </div>
    </main>
  );
}
