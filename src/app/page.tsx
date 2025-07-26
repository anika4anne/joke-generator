"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getRandomJoke,
  getJokesByCategory,
  jokes,
  type Joke,
} from "../data/jokes";

export default function HomePage() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedJoke, setGeneratedJoke] = useState("");
  const [joke, setJoke] = useState<Joke>(getRandomJoke());
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [currentQuizJoke, setCurrentQuizJoke] = useState<Joke | null>(null);

  // Placeholder for animation (wiggle)
  const emojiClass =
    "inline-block animate-bounce text-7xl md:text-8xl drop-shadow-lg mb-6";

  // Joke generation based on prompt
  function handleGenerateJoke(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Try to find jokes related to the prompt
    const promptLower = prompt.trim().toLowerCase();
    const relevantJokes = jokes.filter(
      (joke) =>
        joke.setup.toLowerCase().includes(promptLower) ||
        joke.punchline.toLowerCase().includes(promptLower) ||
        joke.category.toLowerCase().includes(promptLower),
    );

    if (relevantJokes.length > 0) {
      const randomRelevantJoke =
        relevantJokes[Math.floor(Math.random() * relevantJokes.length)];
      if (randomRelevantJoke) {
        setGeneratedJoke(
          `${randomRelevantJoke.setup} ${randomRelevantJoke.punchline}`,
        );
      }
    } else {
      // Fallback to a random joke
      const randomJoke = getRandomJoke();
      setGeneratedJoke(`${randomJoke.setup} ${randomJoke.punchline}`);
    }
  }

  // Quiz grading function
  function handleQuizSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentQuizJoke || !quizAnswer.trim()) return;

    const userAnswer = quizAnswer.trim().toLowerCase();
    const correctAnswer = currentQuizJoke.punchline.toLowerCase();

    // Simple matching - check if user's answer contains key words from the punchline
    const keyWords = correctAnswer.split(" ").filter((word) => word.length > 3);
    const hasKeyWords = keyWords.some((word) => userAnswer.includes(word));

    // Also check for exact match or close match
    const isExactMatch = userAnswer === correctAnswer;
    const isCloseMatch =
      correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer);

    if (isExactMatch || isCloseMatch || hasKeyWords) {
      setQuizResult("correct");
    } else {
      setQuizResult("incorrect");
    }
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
            <button
              className="flex items-center gap-2 font-semibold text-white/90 transition hover:text-[hsl(200,100%,70%)] focus:outline-none"
              onClick={() => {
                setShowQuiz(true);
                setCurrentQuizJoke(getRandomJoke());
                setQuizAnswer("");
                setQuizResult(null);
              }}
            >
              <i className="fas fa-question-circle" /> Quiz
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

      {/* Modal for Quiz */}
      {showQuiz && currentQuizJoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="animate-fade-in relative w-full max-w-md rounded-xl border border-white/20 bg-[#1a1333] p-8 shadow-2xl">
            <button
              className="absolute top-3 right-3 text-2xl font-bold text-white/60 hover:text-white focus:outline-none"
              onClick={() => {
                setShowQuiz(false);
                setQuizAnswer("");
                setQuizResult(null);
                setCurrentQuizJoke(null);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-[hsl(200,100%,70%)]">
              <i className="fas fa-question-circle" /> Joke Quiz
            </h2>

            <div className="mb-6">
              <p className="mb-4 text-lg text-white/90">
                <strong>Setup:</strong> {currentQuizJoke.setup}
              </p>
              <p className="text-lg text-white/90">
                <strong>Your task:</strong> Complete the punchline!
              </p>
            </div>

            <form onSubmit={handleQuizSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                className="rounded-lg border-2 border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm transition-all focus:border-[hsl(200,100%,70%)] focus:outline-none"
                placeholder="Type your punchline here..."
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-[hsl(200,100%,70%)] px-6 py-3 text-lg font-bold text-[#15162c] shadow-xl transition-all hover:bg-[hsl(200,100%,80%)] focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                Submit Answer
              </button>
            </form>

            {quizResult && (
              <div
                className={`mt-6 rounded-lg border p-4 text-center text-lg ${
                  quizResult === "correct"
                    ? "border-green-500 bg-green-500/20 text-green-300"
                    : "border-red-500 bg-red-500/20 text-red-300"
                }`}
              >
                {quizResult === "correct" ? (
                  <div>
                    <p className="mb-2">🎉 Correct! Great job!</p>
                    <p className="text-sm text-white/70">
                      The punchline was: "{currentQuizJoke.punchline}"
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2">❌ Not quite right. Try again!</p>
                    <p className="text-sm text-white/70">
                      The correct punchline was: "{currentQuizJoke.punchline}"
                    </p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setCurrentQuizJoke(getRandomJoke());
                    setQuizAnswer("");
                    setQuizResult(null);
                  }}
                  className="mt-3 rounded-lg bg-[hsl(200,100%,70%)] px-4 py-2 text-sm font-bold text-[#15162c] transition-all hover:bg-[hsl(200,100%,80%)]"
                >
                  Try Another Joke
                </button>
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
          <div className="min-h-[60px] text-center text-xl font-medium md:text-2xl">
            <p className="mb-2">{joke.setup}</p>
            <p className="text-[hsl(200,100%,70%)]">{joke.punchline}</p>
          </div>
          <button
            className="mt-2 rounded-full bg-[hsl(200,100%,70%)] px-8 py-3 text-lg font-bold text-[#15162c] shadow-md transition-all duration-200 hover:scale-105 hover:bg-[hsl(200,100%,80%)] focus:ring-2 focus:ring-white/50 focus:outline-none"
            onClick={() => setJoke(getRandomJoke())}
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
