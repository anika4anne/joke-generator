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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [generatedJoke, setGeneratedJoke] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [joke, setJoke] = useState<Joke>(getRandomJoke());
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [currentQuizJoke, setCurrentQuizJoke] = useState<Joke | null>(null);

  async function generateAIJoke(
    category: string,
    topic: string,
  ): Promise<string> {
    try {
      const response = await fetch("/api/generate-joke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          topic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate joke");
      }

      const data = (await response.json()) as { joke: string };
      return data.joke;
    } catch (error) {
      console.error("Error generating AI joke:", error);
      return "Sorry, I had trouble thinking of a joke. Try again!";
    }
  }

  async function handleGenerateJoke(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsGenerating(true);

    try {
      if (selectedCategory === "people" && prompt.trim()) {
        const personInfo = prompt.trim();
        const personName = personInfo.split(",")[0]?.trim() ?? "Someone";
        const personDetails = personInfo.split(",").slice(1).join(",").trim();

        const aiJoke = await generateAIJoke(
          "people",
          `${personName}, ${personDetails}`,
        );
        setGeneratedJoke(aiJoke);
        return;
      }

      if (prompt.trim()) {
        const aiJoke = await generateAIJoke(
          selectedCategory || "general",
          prompt.trim(),
        );
        setGeneratedJoke(aiJoke);
        return;
      }

      let jokesToChooseFrom = jokes;

      if (selectedCategory) {
        jokesToChooseFrom = getJokesByCategory(selectedCategory);
      }

      if (jokesToChooseFrom.length === 0) {
        jokesToChooseFrom = jokes;
      }

      const randomJoke =
        jokesToChooseFrom[Math.floor(Math.random() * jokesToChooseFrom.length)];
      if (randomJoke) {
        setGeneratedJoke(`${randomJoke.setup} ${randomJoke.punchline}`);
      }
    } catch (error) {
      console.error("Error generating joke:", error);
      setGeneratedJoke("Sorry, something went wrong. Try again!");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleQuizSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentQuizJoke || !quizAnswer.trim()) return;

    const userAnswer = quizAnswer.trim().toLowerCase();
    const correctAnswer = currentQuizJoke.punchline.toLowerCase();

    const keyWords = correctAnswer.split(" ").filter((word) => word.length > 3);
    const hasKeyWords = keyWords.some((word) => userAnswer.includes(word));

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
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-white"
      style={{
        backgroundImage: 'url("/bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/20 bg-gradient-to-r from-[#2e026d]/95 via-[#1a1333]/95 to-[#15162c]/95 shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png.png"
              alt="Joke Generator Logo"
              className="h-10 w-10 rounded-full object-cover shadow-lg"
            />
            <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Joke Generator
            </span>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="group flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-md"
            >
              <i className="fas fa-home text-sm transition-transform duration-200 group-hover:scale-110" />
              <span>Home</span>
            </Link>

            <button
              className="group flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-md focus:ring-2 focus:ring-[hsl(200,100%,70%)]/50 focus:outline-none"
              onClick={() => setShowHowToPlay(true)}
            >
              <i className="fas fa-question-circle text-sm transition-transform duration-200 group-hover:scale-110" />
              <span>How to Play</span>
            </button>

            <button
              className="group flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-md focus:ring-2 focus:ring-[hsl(200,100%,70%)]/50 focus:outline-none"
              onClick={() => setShowGenerate(true)}
            >
              <i className="fas fa-magic text-sm transition-transform duration-200 group-hover:scale-110" />
              <span>Generate</span>
            </button>

            <button
              className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-[hsl(200,100%,70%)] to-[hsl(200,100%,60%)] px-4 py-2 font-semibold text-[#15162c] shadow-lg transition-all duration-200 hover:scale-105 hover:from-[hsl(200,100%,80%)] hover:to-[hsl(200,100%,70%)] hover:shadow-xl focus:ring-2 focus:ring-white/50 focus:outline-none"
              onClick={() => {
                setShowQuiz(true);
                setCurrentQuizJoke(getRandomJoke());
                setQuizAnswer("");
                setQuizResult(null);
              }}
            >
              <i className="fas fa-book text-sm transition-transform duration-200 group-hover:scale-110" />
              <span>Quiz</span>
            </button>
          </nav>
        </div>
      </header>

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
      {showGenerate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="animate-fade-in relative w-full max-w-md rounded-xl border border-white/20 bg-[#1a1333] p-8 shadow-2xl">
            <button
              className="absolute top-3 right-3 text-2xl font-bold text-white/60 hover:text-white focus:outline-none"
              onClick={() => {
                setShowGenerate(false);
                setPrompt("");
                setSelectedCategory("");
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
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">
                  Choose a category (optional):
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border-2 border-white/30 bg-white/10 px-4 py-3 text-white backdrop-blur-sm transition-all focus:border-[hsl(200,100%,70%)] focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="animals">🐾 Animals</option>
                  <option value="food">🍕 Food & Cooking</option>
                  <option value="science">🔬 Science & Technology</option>
                  <option value="school">📚 School & Education</option>
                  <option value="work">💼 Work & Jobs</option>
                  <option value="health">🏥 Health & Medicine</option>
                  <option value="sports">⚽ Sports & Exercise</option>
                  <option value="travel">✈️ Travel & Transportation</option>
                  <option value="music">🎵 Music & Entertainment</option>
                  <option value="weather">🌤️ Weather & Nature</option>
                  <option value="money">💰 Money & Finance</option>
                  <option value="relationships">
                    💕 Relationships & Dating
                  </option>
                  <option value="language">📝 Language & Words</option>
                  <option value="time">⏰ Time & Calendar</option>
                  <option value="people">👥 People</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80">
                  {selectedCategory === "people"
                    ? "Enter person's name and info:"
                    : "Or enter a specific topic:"}
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border-2 border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm transition-all focus:border-[hsl(200,100%,70%)] focus:outline-none"
                  placeholder={
                    selectedCategory === "people"
                      ? "ex. John, a teacher who loves pizza..."
                      : "ex. cats, school, pizza, doctors..."
                  }
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                {selectedCategory === "people" && (
                  <p className="text-xs text-white/60">
                    💡 Tip: Add details like their job, hobbies, or personality
                    traits for better jokes!
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="rounded-lg bg-[hsl(200,100%,70%)] px-6 py-3 text-lg font-bold text-[#15162c] shadow-xl transition-all hover:bg-[hsl(200,100%,80%)] focus:ring-2 focus:ring-white/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#15162c] border-t-transparent"></div>
                    AI is thinking...
                  </span>
                ) : (
                  "Generate Joke"
                )}
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
                <strong>Question:</strong> {currentQuizJoke.setup}
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
                      The punchline was: &ldquo;{currentQuizJoke.punchline}
                      &rdquo;
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2">❌ Not quite right. Try again!</p>
                    <p className="text-sm text-white/70">
                      The correct punchline was: &ldquo;
                      {currentQuizJoke.punchline}&rdquo;
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

      <div className="h-16" />

      <div className="flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="relative">
          <span className="mb-6 inline-block rotate-2 transform text-8xl drop-shadow-lg transition-transform duration-300 hover:rotate-0 md:text-9xl">
            😂
          </span>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-wide md:text-6xl">
            Welcome to my{" "}
            <span className="relative text-[hsl(200,100%,70%)]">
              Joke Generator
              <div className="absolute -bottom-1 left-0 h-1 w-full -skew-x-12 transform bg-[hsl(200,100%,70%)]"></div>
            </span>
          </h1>
          <p className="mt-3 text-lg text-white/70 italic">
            Because life is better with laughter! 😊
          </p>
        </div>

        <div className="relative w-full">
          <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/15 p-8 shadow-xl backdrop-blur-sm">
            <div className="space-y-4 text-center">
              <div className="flex min-h-[80px] flex-col justify-center">
                <p className="mb-3 text-xl leading-relaxed font-medium md:text-2xl">
                  &ldquo;{joke.setup}&rdquo;
                </p>
                <p className="text-xl leading-relaxed font-bold text-[hsl(200,100%,70%)] md:text-2xl">
                  &ldquo;{joke.punchline}&rdquo;
                </p>
              </div>

              <button
                className="group relative transform rounded-full bg-gradient-to-r from-[hsl(200,100%,70%)] to-[hsl(200,100%,60%)] px-8 py-4 text-lg font-bold text-[#15162c] shadow-lg transition-all duration-300 hover:scale-105 hover:-rotate-1 hover:from-[hsl(200,100%,80%)] hover:to-[hsl(200,100%,70%)] hover:shadow-xl focus:ring-2 focus:ring-white/50 focus:outline-none"
                onClick={() => setJoke(getRandomJoke())}
              >
                <span className="relative z-10">Tell me another! 😄</span>
                <div className="absolute inset-0 scale-0 transform rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-100"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-sm text-white/60">Made with ❤️</p>
          <p className="text-xs text-white/40">
            Click the button above for new jokes!
          </p>
        </div>
      </div>

      <footer className="fixed right-4 bottom-4 text-sm text-white/60">
        © 2025 Created by Anika
      </footer>
    </main>
  );
}
