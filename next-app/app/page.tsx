import TerminalDemo from "@/components/terminal-demo";
import ExpandableCardDemo from "@/components/expandable-card-demo-standard";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero placeholder */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
          AI / ML Engineer
        </p>
        <h1 className="mb-4 text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-6xl">
          Justin Hatch
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
          Building production agents at Modern Amenities. Lead Software Engineer at Oregon
          Blockchain Group. Available June 2026.
        </p>
      </section>

      {/* Terminal demo - showing the agent skills CRUD flow */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="mb-6 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Agent Skills
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Add any repo to the site with one command.
          </h2>
        </div>
        <TerminalDemo />
      </section>

      {/* Expandable cards - top projects */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Selected Work
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Featured projects
          </h2>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Click any project to expand.
          </p>
        </div>
        <ExpandableCardDemo />
      </section>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-8 text-center text-xs text-neutral-500">
        Next.js 16 · Tailwind v4 · TypeScript · shadcn / motion components
      </footer>
    </main>
  );
}
