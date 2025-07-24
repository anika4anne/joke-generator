"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedJoke, setGeneratedJoke] = useState("");
  const [joke, setJoke] = useState(
    "Why don't scientists trust atoms? Because they make up everything!",
  );

  // Placeholder for animation (wiggle)
  const emojiClass =
    "inline-block animate-bounce text-7xl md:text-8xl drop-shadow-lg mb-6";

  // Mock joke generation based on prompt
  function handleGenerateJoke(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    // Simple mock logic
    setGeneratedJoke(
      `Why did the ${prompt.trim().toLowerCase()} cross the road? To get to the punchline!`,
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] px-4 text-white">
      {/* Simple Topbar */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-[#2e026d]/90 to-[#15162c]/90 shadow-md backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <span className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-[hsl(200,100%,70%)] drop-shadow">
            <i className="fas fa-laugh-wink text-2xl" /> Joke Generator
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-white/90 transition hover:text-[hsl(200,100%,70%)]"
            >
              <i className="fas fa-home" /> Home
            </Link>
            <button
              className="flex items-center gap-2 font-semibold text-white/90 transition hover:text-[hsl(200,100%,70%)] focus:outline-none"
              onClick={() => setShowHowToPlay(true)}
            >
              <i className="fas fa-question-circle" /> How to Play
            </button>
            <button
              className="flex items-center gap-2 font-semibold text-white/90 transition hover:text-[hsl(200,100%,70%)] focus:outline-none"
              onClick={() => setShowGenerate(true)}
            >
              <i className="fas fa-magic" /> Generate
            </button>
          </nav>
        </div>
      </header>

      {/* Modal for How to Play */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="animate-fade-in relative w-full max-w-md rounded-xl border border-white/20 bg-[#1a1333] p-8 shadow-2xl">
            <button
              className="absolute top-3 right-3 text-2xl font-bold text-white/60 hover:text-white focus:outline-none"
              onClick={() => setShowHowToPlay(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="mb-4 text-2xl font-bold text-[hsl(200,100%,70%)]">
              How to Play
            </h2>
            <ol className="list-inside list-decimal space-y-2 text-lg text-white/90">
              <li>
                Click the{" "}
                <span className="font-bold text-[hsl(200,100%,70%)]">
                  Generate Joke
                </span>{" "}
                button.
              </li>
              <li>Read and enjoy the joke that appears!</li>
              <li>Click again for a new joke.</li>
              <li>Share the laughter with friends!</li>
            </ol>
          </div>
        </div>
      )}

      {/* Modal for Generate Joke by Prompt */}
      {showGenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="animate-fade-in relative w-full max-w-md rounded-xl border border-white/20 bg-[#1a1333] p-8 shadow-2xl">
            <button
              className="absolute top-3 right-3 text-2xl font-bold text-white/60 hover:text-white focus:outline-none"
              onClick={() => {
                setShowGenerate(false);
                setPrompt("");
                setGeneratedJoke("");
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-[hsl(200,100%,70%)]">
              <i className="fas fa-magic" /> Generate a Joke
            </h2>
            <form onSubmit={handleGenerateJoke} className="flex flex-col gap-4">
              <input
                type="text"
                className="rounded-lg border-2 border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm transition-all focus:border-[hsl(200,100%,70%)] focus:outline-none"
                placeholder="Enter a topic or prompt (e.g. cats, school)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-[hsl(200,100%,70%)] px-6 py-3 text-lg font-bold text-[#15162c] shadow-xl transition-all hover:bg-[hsl(200,100%,80%)] focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                Generate
              </button>
            </form>
            {generatedJoke && (
              <div className="mt-6 rounded-lg border border-white/20 bg-white/10 p-4 text-center text-lg text-white">
                {generatedJoke}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacer for topbar */}
      <div className="h-16" />

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
