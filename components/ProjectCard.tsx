// src/components/ProjectCard.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Github, Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/siteData";
interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden hover:bg-white/[0.04] transition-all duration-500"
    >
      {/* Background Image */}
      {project.image && (
        <div className="absolute inset-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]/70" />
        </div>
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {project.title}
            </h3>
            <p className="text-gray-500 text-sm">{project.subtitle}</p>
          </div>
            <div className="flex gap-3 mt-4">
            {/* GitHub Link */}
            <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            >
                <Github
                size={18}
                className="text-gray-300 group-hover:text-cyan-400 transition-colors"
                />
            </a>

            {/* Live Demo Link — only shows if demo exists */}
            {project.demo && (
                <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                >
                <ExternalLink
                    size={18}
                    className="text-gray-300 group-hover:text-blue-400 transition-colors"
                />
                </a>
            )}
            </div>
        </div>

        {project.awards && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.awards.map((award) => (
              <Badge
                key={award}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 text-[10px] px-2 py-0.5"
              >
                <Award size={10} className="mr-1" />
                {award}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-gray-300 border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>

        <p
          className={`text-gray-400 text-sm leading-relaxed ${
            expanded ? "" : "line-clamp-2"
          }`}
        >
          {project.description}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300 transition-colors mt-3"
        >
          {expanded ? "Show less" : "Show more"}
          <ChevronDown
            size={16}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </motion.div>
  );
}
