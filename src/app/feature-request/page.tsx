"use client";

import { useState } from "react";
import Link from "next/link";

export default function FeatureRequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    featureTitle: "",
    featureDescription: "",
    category: "",
    priority: "medium",
    additionalInfo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Feature request submitted:", formData);

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        featureTitle: "",
        featureDescription: "",
        category: "",
        priority: "medium",
        additionalInfo: "",
      });
    } catch (error) {
      console.error("Error submitting feature request:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat px-4 py-20 text-white"
      style={{ backgroundImage: 'url("/bg.jpg")' }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png.png"
              alt="Joke Generator Logo"
              className="h-10 w-10 rounded-full object-cover shadow-lg ring-2 ring-white/20"
            />
            <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Joke Generator
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 font-semibold text-white/90 transition-all duration-200 hover:bg-white/15 hover:text-white hover:shadow-lg"
            >
              <i className="fas fa-home text-sm transition-transform duration-200 group-hover:scale-110" />
              <span>Home</span>
            </Link>
            <Link
              href="/generate"
              className="group flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 font-semibold text-white/90 transition-all duration-200 hover:bg-white/15 hover:text-white hover:shadow-lg"
            >
              <i className="fas fa-magic text-sm transition-transform duration-200 group-hover:scale-110" />
              <span>Generate</span>
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white drop-shadow-lg">
            Feature Request
          </h1>
          <p className="text-xl text-white/90">
            Help us improve Joke Generator! Share your ideas for new features.
          </p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-black/40 p-8 shadow-2xl backdrop-blur-sm">
          {submitStatus === "success" ? (
            <div className="text-center">
              <div className="mb-6 text-6xl">🎉</div>
              <h2 className="mb-4 text-3xl font-bold text-green-400">
                Thank You!
              </h2>
              <p className="mb-6 text-lg text-white/90">
                Your feature request has been submitted successfully. We'll
                review it and get back to you soon!
              </p>
              <button
                onClick={() => setSubmitStatus("idle")}
                className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-cyan-300 hover:to-blue-400"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-white/90"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-white/90"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="featureTitle"
                  className="mb-2 block text-sm font-semibold text-white/90"
                >
                  Feature Title *
                </label>
                <input
                  type="text"
                  id="featureTitle"
                  name="featureTitle"
                  value={formData.featureTitle}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
                  placeholder="Brief title for your feature request"
                />
              </div>

              <div>
                <label
                  htmlFor="featureDescription"
                  className="mb-2 block text-sm font-semibold text-white/90"
                >
                  Feature Description *
                </label>
                <textarea
                  id="featureDescription"
                  name="featureDescription"
                  value={formData.featureDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
                  placeholder="Describe your feature request in detail..."
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold text-white/90"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
                  >
                    <option value="">Select a category</option>
                    <option value="ui-ux">UI/UX Improvements</option>
                    <option value="new-features">New Features</option>
                    <option value="joke-categories">Joke Categories</option>
                    <option value="ai-enhancements">AI Enhancements</option>
                    <option value="performance">Performance</option>
                    <option value="accessibility">Accessibility</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="priority"
                    className="mb-2 block text-sm font-semibold text-white/90"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="additionalInfo"
                  className="mb-2 block text-sm font-semibold text-white/90"
                >
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
                  placeholder="Any, examples, or suggestions... ^_^"
                />
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex items-center gap-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-cyan-300 hover:to-blue-400 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-sm" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane text-sm transition-transform duration-200 group-hover:scale-110" />
                      <span>Submit Feature Request</span>
                    </>
                  )}
                </button>
              </div>

              {submitStatus === "error" && (
                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/20 p-4 text-center">
                  <p className="text-red-300">
                    Sorry, there was an error submitting your request. Please
                    try again.
                  </p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-white/60">
          <p>Created by Anika ^_^</p>
        </div>
      </div>
    </main>
  );
}
