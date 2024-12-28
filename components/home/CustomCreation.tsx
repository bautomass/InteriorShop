"use client"

import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Package,
  Pencil,
  Wrench,
  Trees
} from 'lucide-react';
import { useState } from 'react';

const CustomCreation = () => {
  const [activeProject, setActiveProject] = useState(0);

  const customProjects = [
    {
      title: "Minimalist Dining Set",
      client: "Sarah & James, Copenhagen",
      description: "A custom 8-seater dining set crafted from reclaimed teak.",
      timeline: "12 weeks",
      image: "/api/placeholder/800/500",
      progress: [
        { stage: "Design Consultation", status: "completed" },
        { stage: "Material Selection", status: "completed" },
        { stage: "Crafting", status: "completed" },
        { stage: "Quality Check", status: "completed" },
        { stage: "Delivery", status: "completed" }
      ]
    },
    {
      title: "Modern Home Office",
      client: "Marcus, Stockholm",
      description: "Integrated workspace with adjustable standing desk and storage.",
      timeline: "8 weeks",
      image: "/api/placeholder/800/500",
      progress: [
        { stage: "Design Consultation", status: "completed" },
        { stage: "Material Selection", status: "completed" },
        { stage: "Crafting", status: "in-progress" },
        { stage: "Quality Check", status: "pending" },
        { stage: "Delivery", status: "pending" }
      ]
    },
    {
      title: "Reading Nook",
      client: "Emma & Lars, Oslo",
      description: "Built-in seating with integrated bookshelf and lighting.",
      timeline: "6 weeks",
      image: "/api/placeholder/800/500",
      progress: [
        { stage: "Design Consultation", status: "completed" },
        { stage: "Material Selection", status: "in-progress" },
        { stage: "Crafting", status: "pending" },
        { stage: "Quality Check", status: "pending" },
        { stage: "Delivery", status: "pending" }
      ]
    }
  ];

  const process = [
    {
      icon: <Pencil className="h-6 w-6" />,
      title: "Design Consultation",
      description: "Share your vision and space requirements with our design team."
    },
    {
      icon: <Trees className="h-6 w-6" />,
      title: "Material Selection",
      description: "Choose from our curated selection of sustainable materials."
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Expert Crafting",
      description: "Our master craftsmen bring your piece to life."
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "White Glove Delivery",
      description: "Careful delivery and installation in your space."
    }
  ];

  return (
    <section className="bg-primary-50 py-24 dark:bg-primary-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-sm font-medium text-accent-500">
            Custom Creation
          </span>
          <h2 className="mb-4 text-4xl font-light text-primary-900 dark:text-primary-50">
            Bring Your Vision to Life
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-primary-600 dark:text-primary-300">
            Experience the journey of creating furniture that's uniquely yours,
            crafted to your exact specifications and needs.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {process.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-2xl bg-primary-100 p-6 transition-all hover:bg-primary-200 dark:bg-primary-800 dark:hover:bg-primary-700"
            >
              <div className="mb-4 text-accent-500">{step.icon}</div>
              <h3 className="mb-2 text-lg font-medium text-primary-900 dark:text-primary-50">
                {step.title}
              </h3>
              <p className="text-primary-600 dark:text-primary-300">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Current Projects */}
        <div className="rounded-3xl bg-primary-100 p-8 dark:bg-primary-800">
          <h3 className="mb-8 text-2xl font-light text-primary-900 dark:text-primary-50">
            Custom Projects in Progress
          </h3>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              {customProjects.map((project, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveProject(index)}
                  className={`w-full rounded-xl p-4 text-left transition-all ${
                    activeProject === index
                      ? 'bg-primary-50 dark:bg-primary-900'
                      : 'hover:bg-primary-50 dark:hover:bg-primary-900'
                  }`}
                >
                  <h4 className="mb-1 text-lg font-medium text-primary-900 dark:text-primary-50">
                    {project.title}
                  </h4>
                  <p className="mb-2 text-sm text-primary-600 dark:text-primary-300">
                    {project.client}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-accent-500">
                      Timeline: {project.timeline}
                    </span>
                    <div className="h-1 flex-1 rounded-full bg-primary-200 dark:bg-primary-700">
                      <div
                        className="h-full rounded-full bg-accent-500"
                        style={{
                          width: `${
                            (project.progress.filter(p => p.status === 'completed').length /
                              project.progress.length) *
                            100
                          }%`
                        }}
                      />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.div
              key={activeProject}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl bg-primary-50 p-6 dark:bg-primary-900"
            >
              <img
                src={customProjects[activeProject].image}
                alt={customProjects[activeProject].title}
                className="mb-6 rounded-lg"
                loading="lazy"
              />
              <div className="space-y-4">
                {customProjects[activeProject].progress.map((stage, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4"
                  >
                    <CheckCircle
                      className={`h-5 w-5 ${
                        stage.status === 'completed'
                          ? 'text-accent-500'
                          : stage.status === 'in-progress'
                          ? 'text-primary-400'
                          : 'text-primary-300'
                      }`}
                    />
                    <span className="text-primary-900 dark:text-primary-50">
                      {stage.stage}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <a
            href="/custom-creation"
            className="group inline-flex items-center gap-2 rounded-full bg-primary-900 px-6 py-3 text-sm font-medium text-primary-50 transition-all hover:bg-primary-800 dark:bg-primary-50 dark:text-primary-900 dark:hover:bg-primary-200"
          >
            Start Your Custom Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CustomCreation;