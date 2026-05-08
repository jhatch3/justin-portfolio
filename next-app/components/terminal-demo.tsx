"use client";
import { Terminal } from "@/components/ui/terminal";

export default function TerminalDemo() {
  return (
    <section className="w-full py-10 md:py-20">
      <Terminal
        commands={[
          "/portfolio-projects add this repo",
          "git commit -m 'projects: add lethe'",
          "git push origin main",
          "✓ Live in 60 seconds.",
        ]}
        outputs={{
          0: [
            "✔ Read git remote: jhatch3/lethe-",
            "✔ Fetched GitHub metadata",
            "✔ Inferred tags: AI Agents, Healthcare, Python",
            "✔ Edited data.js",
          ],
          1: ["[main 8a3f1c2] projects: add lethe"],
          2: ["Counting objects: 3, done.", "Writing objects: 100% (3/3)", "To github.com/jhatch3/justin-portfolio.git"],
        }}
        username="justin@portfolio"
        typingSpeed={45}
        delayBetweenCommands={1000}
        enableSound={false}
      />
    </section>
  );
}
