// src/app/page.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  Briefcase,
  Download,
  Award,
  Code,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "@/components/ProjectCard";
import {
  navItems,
  skills,
  projects,
  projectCategories,
  certifications,
} from "@/data/siteData";

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("All");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "projects", "education", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.span
            className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            JH
          </motion.span>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 mt-1"
                  />
                )}
              </button>
            ))}
            <a
              href="/resume.pdf"
              download="Justin_Hatch_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white text-sm font-medium transition-all duration-300"
            >
              <Download size={16} />
              Resume
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#0a0a0a]/95"
            >
              <div className="px-6 py-4 space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left text-gray-300 hover:text-white py-2"
                  >
                    {item.label}
                  </button>
                ))}
                <a
                  href="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69278c2a9ef8968226639adc/b36c31051_Justin-Hatch-Resume2.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 py-2"
                >
                  <Download size={16} />
                  Download Resume
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center relative px-6"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
          {/* Twinkling Stars */}
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                i % 4 === 0
                  ? "w-1.5 h-1.5 bg-white/60"
                  : i % 3 === 0
                  ? "w-1 h-1 bg-blue-200/50"
                  : "w-0.5 h-0.5 bg-white/40"
              }`}
              style={{
                left: `${5 + ((i * 17) % 90)}%`,
                top: `${8 + ((i * 23) % 85)}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6927420e784efb395d5a0a11/a9adef256_1753127063171.jpg"
                alt="Justin Hatch"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto border-4 border-cyan-500/30 shadow-lg shadow-cyan-500/20"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-white">Justin</span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Hatch
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-4 font-light">
              Data Science • Machine Learning • Software Engineering
            </p>

            <p className="text-gray-500 mb-10 flex items-center justify-center gap-2">
              <MapPin size={16} />
              Eugene, Oregon
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                onClick={() => scrollToSection("projects")}
                className="px-8 py-6 text-base"
              >
                View Projects
              </Button>
              <Button
                onClick={() => scrollToSection("contact")}
                variant="outline"
                className="px-8 py-6 text-base"
              >
                Get in Touch
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <a
                href="https://www.linkedin.com/in/justinhatch/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full bg-white/[0.02] border border-white/10 hover:bg-white/[0.08] hover:border-cyan-500/50 transition-all duration-300"
              >
                <Linkedin
                  size={22}
                  className="text-gray-400 group-hover:text-cyan-400 transition-colors"
                />
              </a>
              <a
                href="https://github.com/jhatch3"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full bg-white/[0.02] border border-white/10 hover:bg-white/[0.08] hover:border-cyan-500/50 transition-all duration-300"
              >
                <Github
                  size={22}
                  className="text-gray-400 group-hover:text-cyan-400 transition-colors"
                />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.button
          onClick={() => scrollToSection("about")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={32} className="text-gray-500" />
        </motion.button>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
            <p className="text-gray-500 mb-16 text-lg">
              Get to know my background and expertise
            </p>

            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Hello! I am Justin, a 4th year Computer Science student
                  specializing in Data Science, Machine Learning, and AI with
                  experience building end-to-end data systems, deploying ML
                  models, and developing full-stack applications. I am a
                  developer with a focus on applying data, experimentation, and
                  scalable engineering to deliver real-world impact.
                </p>

                <div className="pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Award size={20} className="text-cyan-400" />
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert) => (
                      <a
                        key={cert.name}
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-[11px] text-gray-100 px-3 py-1 font-medium tracking-wide transition-all hover:border-cyan-400 hover:bg-cyan-500/20"
                      >
                        {cert.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Code size={20} className="text-cyan-400" />
                  Technical Skills
                </h3>
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    <p className="text-sm text-gray-500 uppercase tracking-wider">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-white/10 text-sm text-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-32 px-6 relative bg-gradient-to-b from-transparent via-blue-950/20 to-transparent"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Selected{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Projects
                  </span>
                </h2>
                <p className="text-gray-500 text-lg">
                  Highlights from my technical work
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {projectCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setProjectFilter(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      projectFilter === category
                        ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(
                  (p) => projectFilter === "All" || p.category === projectFilter
                )
                .map((project, index) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    index={index}
                  />
                ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Education
              </span>{" "}
              & Experience
            </h2>
            <p className="text-gray-500 mb-16 text-lg">
              My academic journey and professional experience
            </p>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Education */}
              <div className="space-y-8">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                  <GraduationCap size={20} className="text-cyan-400" />
                  Education
                </h3>

                <div className="relative pl-8 border-l-2 border-cyan-500/30">
                  <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
                  <div className="pb-8">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <h4 className="text-xl font-semibold text-white">
                        University of Oregon
                      </h4>
                      <span className="text-sm text-gray-500">
                        Sept 2022 - June 2026
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3">
                      B.S. Computer Science — Data Science, ML & AI
                      Specialization
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="rounded-full bg-emerald-500/15 border border-emerald-400/40 text-[11px] text-emerald-100 px-3 py-1 font-medium">
                        Dean&apos;s List
                      </Badge>
                      <Badge className="rounded-full bg-blue-500/15 border border-blue-400/40 text-[11px] text-blue-100 px-3 py-1 font-medium">
                        GPA: 3.66
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="text-gray-400">Activities:</span> DSCI
                      Club, Oregon Software Consulting Group, Oregon Blockchain
                      Group, Quack Hacks II
                    </p>
                  </div>
                </div>

                {/* Relevant Coursework */}
                <div className="mt-2 rounded-2xl bg-white/[0.03] border border-white/15 p-5">
                  <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-[0.18em] mb-3">
                    Relevant Coursework
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Data Science I–II",
                      "Stats for Data Science",
                      "Probabilistic Methods in AI",
                      "Machine Learning",
                      "Database Processing",
                      "Calculus I–II",
                      "Discrete Math I–II",
                      "Linear Algebra I–II",
                      "Data Structures",
                      "Algorithms",
                      "Operating Systems",
                      "C/C++",
                      "CS I–III",
                      "Computer Organization",
                      "Data Mining",
                      "Digital Forensics",
                    ].map((course) => (
                      <span
                        key={course}
                        className="px-2.5 py-1 rounded-full bg-white/5 text-[11px] text-gray-200 border border-white/10 whitespace-nowrap"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-8">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                  <Briefcase size={20} className="text-cyan-400" />
                  Experience
                </h3>

                {[
                  {
                    title: "Software Developer",
                    company: "Oregon Blockchain Group",
                    date: "Oct 2025 - Present",
                    description:
                      "Contributing to production-grade blockchain solutions. Researching Web3 technologies and decentralized architectures.",
                  },
                  {
                    title: "Jr Software Developer",
                    company: "Software Consulting Group",
                    date: "Oct 2025 - Present",
                    description:
                      "Developing AI-powered web platforms with Flask, MySQL, and OpenAI APIs. Deploying containerized apps on AWS.",
                  },
                  {
                    title: "Business Operations Assistant",
                    company: "UO Housing Administration",
                    date: "Oct 2023 - Present",
                    description:
                      "Managing data entry for 70+ vendors. Reconciling and auditing cash for 20+ dining vendors.",
                  },
                ].map((exp) => (
                  <div
                    key={exp.title}
                    className="relative pl-8 border-l-2 border-cyan-500/30"
                  >
                    <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
                    <div className="pb-8">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-white">
                          {exp.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {exp.date}
                        </span>
                      </div>
                      <p className="text-cyan-400 text-sm">{exp.company}</p>
                      <p className="text-gray-400 text-sm mt-2">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Let&apos;s{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Connect
              </span>
            </h2>
            <p className="text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
              I&apos;m currently seeking opportunities in Data Science, Machine
              Learning Engineering, and Backend Software Engineering. Feel free
              to reach out!
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
              <a
                href="mailto:jjhatch03@gmail.com"
                className="group flex items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                  <Mail size={24} className="text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-white">jjhatch03@gmail.com</p>
                </div>
              </a>

              <a
                href="tel:503-719-1783"
                className="group flex items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                  <Phone size={24} className="text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-white">(503) 719-1783</p>
                </div>
              </a>
            </div>

            <div className="flex items-center justify-center gap-4">
              <a
                href="https://www.linkedin.com/in/justinhatch/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-full bg-white/[0.02] border border-white/10 hover:bg-white/[0.08] hover:border-cyan-500/50 transition-all duration-300"
              >
                <Linkedin
                  size={24}
                  className="text-gray-400 group-hover:text-cyan-400 transition-colors"
                />
              </a>
              <a
                href="https://github.com/jhatch3"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-full bg-white/[0.02] border border-white/10 hover:bg-white/[0.08] hover:border-cyan-500/50 transition-all duration-300"
              >
                <Github
                  size={24}
                  className="text-gray-400 group-hover:text-cyan-400 transition-colors"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2025 Justin Hatch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
