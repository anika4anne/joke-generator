import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center gap-12 px-4 py-16">
        <h1 className="mt-32 text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Welcome to{" "}
          <span className="text-[hsl(280,100%,70%)]">Joke Generator</span>
        </h1>
      </div>
    </main>
  );
}
