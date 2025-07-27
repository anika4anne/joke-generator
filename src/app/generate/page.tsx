"use client";

import { useState } from "react";
import Link from "next/link";
import { getJokesByCategory, jokes } from "../../data/jokes";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [generatedJoke, setGeneratedJoke] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
          selectedCategory ?? "general",
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
      setGeneratedJoke("Sorry, I had trouble thinking of a joke. Try again!");
    } finally {
      setIsGenerating(false);
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
          </nav>
        </div>
      </header>

      <div className="h-16" />

      <div className="flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-wide md:text-6xl">
            Generate a <span className="text-[hsl(200,100%,70%)]">Joke</span>
          </h1>
          <p className="mt-3 text-lg text-white/70 italic">
            Create your own custom jokes! 🎭
          </p>
        </div>

        <div className="w-full max-w-md">
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
                <option value="relationships">💕 Relationships & Dating</option>
                <option value="language">📝 Language & Words</option>
                <option value="time">⏰ Time & Calendar</option>
                <option value="people">👥 People</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/80">
                {selectedCategory === "people"
                  ? "Enter person's name and info:"
                  : "Enter a topic or prompt:"}
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
                  💡 Tip: Include their name, job, or personality traits for
                  better jokes! ^_^
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="group relative transform rounded-lg bg-gradient-to-r from-[hsl(200,100%,70%)] to-[hsl(200,100%,60%)] px-8 py-4 text-lg font-bold text-[#15162c] shadow-lg transition-all duration-300 hover:scale-105 hover:from-[hsl(200,100%,80%)] hover:to-[hsl(200,100%,70%)] hover:shadow-xl focus:ring-2 focus:ring-white/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  AI is thinking...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <i className="fas fa-magic"></i>
                  Generate Joke
                </span>
              )}
            </button>
          </form>
        </div>

        {generatedJoke && (
          <div className="w-full max-w-md">
            <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/15 p-8 shadow-xl backdrop-blur-sm">
              <div className="space-y-4 text-center">
                <h3 className="text-lg font-semibold text-[hsl(200,100%,70%)]">
                  Your Generated Joke:
                </h3>
                <p className="text-lg leading-relaxed text-white">
                  {generatedJoke}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="fixed right-4 bottom-4 text-sm text-white/60">
        © 2025 Created by Anika
      </footer>
    </main>
  );
}
