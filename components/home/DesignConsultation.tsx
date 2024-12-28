"use client";

import { Dialog, Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Eye,
  Home,
  LayoutPanelTop,
  Lightbulb,
  Palette,
  Sofa,
  Sparkles,
  Target,
  X
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

// Types for consultation form
interface ConsultationFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  spaceType: string;
  budget: string;
  timeline: string;
  message: string;
}

// Types for recommendation form
interface RecommendationFormData {
  name: string;
  email: string;
  roomType: string;
  style: string;
  colorPreferences: string[];
  functionalities: string[];
  existingFurniture: string;
  measurements: string;
  budget: string;
  timeline: string;
  specificRequests: string;
}

// Shared form error type
interface FormErrors {
  [key: string]: string;
}

// Enhanced consultation steps data
const consultationSteps = [
  {
    icon: <Home className="h-6 w-6" />,
    title: "Space Assessment",
    description: "Our expert designers analyze your space through detailed measurements, photographs, and architectural considerations to create a foundation for your perfect design.",
    image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/1_e9aef4a5-1e38-456b-a771-d6660744fcd7.jpg?v=1733076595",
    highlight: "Professional space analysis included"
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "3D Visualization",
    description: "Experience your space before it's built with our high-fidelity 3D renderings. View your future home from every angle and make informed decisions about your design.",
    image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/2_1a7dd976-2c15-4d11-a474-35cd6cdc2a34.jpg?v=1733076595",
    highlight: "Photorealistic 3D renderings"
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "Custom Design Planning",
    description: "Receive a personalized design plan that perfectly aligns with your lifestyle, incorporating carefully selected materials, colors, and furnishings.",
    image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/3_8ebce5a3-7f05-4e66-9f64-2b394b1f4352.jpg?v=1733076595",
    highlight: "Tailored to your preferences"
  },
  {
    icon: <LayoutPanelTop className="h-6 w-6" />,
    title: "Detailed Documentation",
    description: "Get comprehensive design documentation including floor plans, elevation drawings, material schedules, and detailed specifications for seamless implementation.",
    image: "https://cdn.shopify.com/s/files/1/0640/6868/1913/files/4_1400082d-fb8e-4e67-9189-85f8970a3850.jpg?v=1733076595",
    highlight: "Complete design package"
  }
];

// Recommendation service features
const recommendationFeatures = [
  {
    icon: <Target className="h-6 w-6" />,
    title: "Personalized Selection",
    description: "Get handpicked furniture and decor recommendations based on your style, space, and specific needs."
  },
  {
    icon: <Sofa className="h-6 w-6" />,
    title: "Perfect Fit Guarantee",
    description: "We ensure every piece fits your space perfectly with detailed measurements and space planning."
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Style Consultation",
    description: "Expert advice on combining pieces to create a cohesive and beautiful space."
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Special Sourcing",
    description: "Access to exclusive pieces and custom-made furniture options for unique spaces."
  }
];

// Style options for the recommendation form
const styleOptions = [
  "Modern Minimalist",
  "Scandinavian",
  "Industrial",
  "Mid-Century Modern",
  "Contemporary",
  "Traditional",
  "Transitional",
  "Bohemian",
  "Coastal",
  "Japanese Modern"
];

// Color scheme options
const colorOptions = [
  "Neutral",
  "Earth Tones",
  "Monochromatic",
  "Bold & Vibrant",
  "Pastel",
  "Cool Tones",
  "Warm Tones",
  "Black & White"
];

// Component starts here...

export default function DesignConsultation() {
  // State management for both services
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('consultation');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'consultation' | 'recommendation'>('consultation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

// Form states
const [consultationForm, setConsultationForm] = useState<ConsultationFormData>({
  name: '',
  email: '',
  phone: '',
  projectType: '',
  spaceType: '',
  budget: '',
  timeline: '',
  message: ''
});

const [recommendationForm, setRecommendationForm] = useState<RecommendationFormData>({
  name: '',
  email: '',
  roomType: '',
  style: '',
  colorPreferences: [],
  functionalities: [],
  existingFurniture: '',
  measurements: '',
  budget: '',
  timeline: '',
  specificRequests: ''
});

const [formErrors, setFormErrors] = useState<FormErrors>({});

// Form handling utilities
const validateConsultationForm = (): boolean => {
  const errors: FormErrors = {};
  
  if (!consultationForm.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!consultationForm.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(consultationForm.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!consultationForm.projectType) {
    errors.projectType = 'Please select a project type';
  }
  
  if (!consultationForm.spaceType) {
    errors.spaceType = 'Please select a space type';
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const validateRecommendationForm = (): boolean => {
  const errors: FormErrors = {};
  
  if (!recommendationForm.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!recommendationForm.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recommendationForm.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!recommendationForm.roomType) {
    errors.roomType = 'Please select a room type';
  }
  
  if (!recommendationForm.style) {
    errors.style = 'Please select a style preference';
  }

  if (recommendationForm.colorPreferences.length === 0) {
    errors.colorPreferences = 'Please select at least one color preference';
  }

  if (!recommendationForm.budget) {
    errors.budget = 'Please specify your budget range';
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleConsultationInputChange = useCallback((
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setConsultationForm(prev => ({
    ...prev,
    [name]: value
  }));
  // Clear error for this field if exists
  if (formErrors[name]) {
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }
}, [formErrors]);

const handleRecommendationInputChange = useCallback((
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setRecommendationForm(prev => ({
    ...prev,
    [name]: value
  }));
  // Clear error for this field if exists
  if (formErrors[name]) {
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }
}, [formErrors]);

const handleColorPreferenceChange = useCallback((color: string) => {
  setRecommendationForm(prev => ({
    ...prev,
    colorPreferences: prev.colorPreferences.includes(color)
      ? prev.colorPreferences.filter(c => c !== color)
      : [...prev.colorPreferences, color]
  }));
}, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const isValid = modalType === 'consultation' 
    ? validateConsultationForm()
    : validateRecommendationForm();

  if (!isValid) {
    return;
  }

  setIsSubmitting(true);
  setSubmitError(null);

  try {
    // Replace with your actual API endpoint
    const endpoint = modalType === 'consultation' 
      ? '/api/consultation-requests'
      : '/api/recommendation-requests';

    const formData = modalType === 'consultation'
      ? consultationForm
      : recommendationForm;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit ${modalType} request`);
    }

    setSubmitSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitSuccess(false);
      if (modalType === 'consultation') {
        setConsultationForm({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          spaceType: '',
          budget: '',
          timeline: '',
          message: ''
        });
      } else {
        setRecommendationForm({
          name: '',
          email: '',
          roomType: '',
          style: '',
          colorPreferences: [],
          functionalities: [],
          existingFurniture: '',
          measurements: '',
          budget: '',
          timeline: '',
          specificRequests: ''
        });
      }
    }, 2000);
    
  } catch (error) {
    setSubmitError(error instanceof Error ? error.message : 'Something went wrong');
  } finally {
    setIsSubmitting(false);
  }
};

// Performance optimization for smooth animations
useEffect(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-duration', '0s');
  }
}, []);

return (
  <>
    <section className="relative overflow-hidden bg-primary-50 py-4 sm:py-8 dark:bg-primary-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-accent-500/10" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-500/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main content header */}
        <div className="mb-12 sm:mb-16 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-block text-sm font-medium text-accent-500"
          >
            Design & Furnishing Services
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-3xl sm:text-4xl font-light tracking-tight text-primary-900 dark:text-primary-50"
          >
            Transform Your Space
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-base sm:text-lg text-primary-600 dark:text-primary-300"
          >
            Choose between our comprehensive design service or personalized furniture recommendations. 
            Our experts will guide you through every step of creating your perfect space.
          </motion.p>
        </div>

        {/* Service Selection Tabs */}
        <Tab.Group
          as="div"
          className="mb-0"
          onChange={(index) => setActiveTab(index === 0 ? 'consultation' : 'recommendation')}
        >
          <Tab.List className="flex space-x-2 rounded-xl bg-primary-100 p-1 dark:bg-primary-800">
            <Tab
              className={({ selected }) => `
                w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ring-white ring-opacity-60 ring-offset-2 ring-offset-accent-400
                focus:outline-none focus:ring-2
                ${
                  selected
                    ? 'bg-white text-accent-700 shadow dark:bg-primary-700 dark:text-primary-50'
                    : 'text-primary-600 hover:bg-white/[0.12] hover:text-accent-600 dark:text-primary-300'
                }
              `}
            >
              Design Consultation
            </Tab>
            <Tab
              className={({ selected }) => `
                w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ring-white ring-opacity-60 ring-offset-2 ring-offset-accent-400
                focus:outline-none focus:ring-2
                ${
                  selected
                    ? 'bg-white text-accent-700 shadow dark:bg-primary-700 dark:text-primary-50'
                    : 'text-primary-600 hover:bg-white/[0.12] hover:text-accent-600 dark:text-primary-300'
                }
              `}
            >
              Furniture Recommendations
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-4 mb-0">
            <Tab.Panel>
              {/* Design Consultation Panel Content */}
              <div className="grid gap-4 lg:gap-8 lg:grid-cols-2">
                {/* Interactive Steps Display */}
                <div className="relative order-2 lg:order-1">
                  <motion.div 
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden rounded-2xl bg-primary-100 dark:bg-primary-800"
                  >
                    <Image
                      src={consultationSteps[activeStep].image}
                      alt={consultationSteps[activeStep].title}
                      width={600}
                      height={400}
                      className="h-[300px] sm:h-[400px] w-full object-cover"
                      priority={activeStep === 0}
                      loading={activeStep === 0 ? "eager" : "lazy"}
                    />
                  </motion.div>
                  
                  <motion.div 
                    key={`highlight-${activeStep}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100 
                    }}
                    className="absolute top-6 left-6 inline-block"
                  >
                    <div className="bg-accent-500 px-4 py-2.5 rounded-lg shadow-lg">
                      <motion.p 
                        className="text-sm font-medium text-white whitespace-nowrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {consultationSteps[activeStep].highlight}
                      </motion.p>
                    </div>
                  </motion.div>
                </div>

                {/* Steps Navigation */}
                <div className="flex flex-col justify-center space-y-2 sm:space-y-4 order-1 lg:order-2">
                  {consultationSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`group rounded-xl overflow-hidden transition-all duration-200 ${
                        activeStep === index 
                          ? 'bg-primary-100 dark:bg-primary-800' 
                          : 'hover:bg-primary-100 dark:hover:bg-primary-800/50'
                      }`}
                    >
                      {/* Header - Always visible */}
                      <button
                        onClick={() => {
                          setActiveStep(index);
                          setExpandedStep(expandedStep === index ? null : index);
                        }}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`rounded-full p-2 ${
                            activeStep === index 
                              ? 'bg-accent-500 text-primary-50' 
                              : 'bg-primary-200 text-primary-600 dark:bg-primary-700 dark:text-primary-300'
                          }`}>
                            {step.icon}
                          </div>
                          <h3 className="font-medium text-primary-900 dark:text-primary-50">
                            {step.title}
                          </h3>
                        </div>
                        <ChevronDown 
                          className={`h-5 w-5 text-primary-600 dark:text-primary-300 transition-transform duration-200 ${
                            expandedStep === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Expandable Content */}
                      {expandedStep === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4"
                        >
                          <div className="pl-14"> {/* Align with title */}
                            <p className="text-sm text-primary-600 dark:text-primary-300 mb-4">
                              {step.description}
                            </p>
                            <div className="text-sm font-medium text-accent-500">
                              {step.highlight}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}

                  {/* Call to Action */}
                  <motion.div
                    className="flex flex-col sm:flex-row items-center gap-2 mb-0 pb-0"
                  >
                    <button
                      onClick={() => {
                        setModalType('consultation');
                        setIsModalOpen(true);
                      }}
                      className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 
                               rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-primary-50 
                               transition-all hover:bg-accent-600 focus:outline-none focus:ring-2 
                               focus:ring-accent-500 focus:ring-offset-2"
                    >
                      Start Your Design Journey
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <span className="text-sm text-center sm:text-left text-primary-600 dark:text-primary-300">
                      Includes free initial consultation
                    </span>
                  </motion.div>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              {/* Furniture Recommendations Panel Content */}
              <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
                {/* Features Display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendationFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-xl bg-primary-100 dark:bg-primary-800"
                    >
                      <div className="rounded-full w-12 h-12 flex items-center justify-center bg-accent-500 text-primary-50 mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-primary-600 dark:text-primary-300">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Service Overview */}
                <div className="flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-medium text-primary-900 dark:text-primary-50">
                      Personalized Furniture Selection
                    </h3>
                    <p className="text-primary-600 dark:text-primary-300">
                      Our experts will create a curated selection of furniture and decor pieces 
                      perfectly matched to your style, space, and budget. We handle everything 
                      from measurements to style coordination.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Complete room planning and layout optimization",
                        "Curated selection of furniture and decor items",
                        "Detailed measurements and space considerations",
                        "Style coordination and color palette matching",
                        "Special order and custom piece sourcing"
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 text-primary-600 dark:text-primary-300"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="flex flex-col sm:flex-row items-center gap-4 pt-4"
                    >
                      <button
                        onClick={() => {
                          setModalType('recommendation');
                          setIsModalOpen(true);
                        }}
                        className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 
                                 rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-primary-50 
                                 transition-all hover:bg-accent-600 focus:outline-none focus:ring-2 
                                 focus:ring-accent-500 focus:ring-offset-2"
                      >
                        Get Personalized Recommendations
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                      <span className="text-sm text-center sm:text-left text-primary-600 dark:text-primary-300">
                        Free initial style consultation
                      </span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Accessibility announcements */}
        <div className="sr-only" role="status" aria-live="polite">
          {activeTab === 'consultation' && `Showing ${consultationSteps[activeStep].title} step`}
          {activeTab === 'recommendation' && "Showing furniture recommendation options"}
        </div>
      </div>
    </section>

    {/* Demo Download Section - more negative margin */}
    <div className="-mt-6 mx-4 sm:mx-8 border-t border-primary-200/50 dark:border-primary-700/50 pt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-8 max-w-5xl mx-auto">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-1"
          >
            <h3 className="text-xl font-medium text-primary-900 dark:text-primary-50">
              See What You'll Get
            </h3>
            <p className="text-primary-600 dark:text-primary-300">
              Download a complete sample project package including 3D renders, floor plans, 
              material schedules, and detailed specifications.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-shrink-0 w-full sm:w-auto"
        >
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="w-full bg-accent-500 text-white rounded-xl px-8 py-4 shadow-lg 
                      hover:bg-accent-600 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-lg font-medium">Download Sample Project Package</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
            <span className="text-sm text-accent-100 mt-1 block">
              PDF & 3D Files Included (25MB)
            </span>
          </button>
        </motion.div>
      </div>
    </div>

    {/* Demo Download Modal */}
    <Dialog
      open={isDemoModalOpen}
      onClose={() => setIsDemoModalOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full rounded-2xl bg-primary-50 dark:bg-primary-900 p-6 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <Dialog.Title className="text-xl font-medium text-primary-900 dark:text-primary-50">
                Download Sample Project
              </Dialog.Title>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="rounded-full p-1 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-800
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-center py-8">
              <div className="mb-6">
                <LayoutPanelTop className="h-16 w-16 mx-auto text-accent-500 mb-4" />
                <p className="text-primary-600 dark:text-primary-300">
                  Demo project files will be added here. This is a placeholder for the download functionality.
                </p>
              </div>
              
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="w-full bg-accent-500 text-white rounded-lg px-4 py-2 
                          hover:bg-accent-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>

    {/* Modal */}
    <Dialog 
      open={isModalOpen} 
      onClose={() => !isSubmitting && setIsModalOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-2xl bg-primary-50 dark:bg-primary-900 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-medium text-primary-900 dark:text-primary-50">
                {modalType === 'consultation' ? 'Design Consultation Request' : 'Furniture Recommendation Request'}
              </Dialog.Title>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-800
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSubmitting}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {modalType === 'consultation' ? (
              <ConsultationForm
                formData={consultationForm}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onChange={handleConsultationInputChange}
              />
            ) : (
              <RecommendationForm
                formData={recommendationForm}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onChange={handleRecommendationInputChange}
                onColorChange={handleColorPreferenceChange}
              />
            )}

            {/* Form Feedback */}
            {submitError && (
              <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 text-sm">
                {submitError}
              </div>
            )}
            
            {submitSuccess && (
              <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-200 text-sm">
                Thank you! We'll be in touch shortly to schedule your {modalType}.
              </div>
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  </>
);
}

// Form Components
// Form Components
interface ConsultationFormProps {
  formData: ConsultationFormData;
  formErrors: FormErrors;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

function ConsultationForm({ formData, formErrors, isSubmitting, onSubmit, onChange }: ConsultationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                    bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                    focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                    transition-colors duration-200"
            value={formData.name}
            onChange={onChange}
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                    bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                    focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                    transition-colors duration-200"
            value={formData.email}
            onChange={onChange}
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
          )}
        </div>

        {/* Phone field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                    bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                    focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                    transition-colors duration-200"
            value={formData.phone}
            onChange={onChange}
          />
        </div>

        {/* Project Type field */}
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                    bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                    focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                    transition-colors duration-200"
            value={formData.projectType}
            onChange={onChange}
          >
            <option value="">Select type</option>
            <option value="full-home">Full Home Design</option>
            <option value="single-room">Single Room</option>
            <option value="kitchen">Kitchen Design</option>
            <option value="bathroom">Bathroom Design</option>
            <option value="outdoor">Outdoor Space</option>
          </select>
          {formErrors.projectType && (
            <p className="mt-1 text-sm text-red-500">{formErrors.projectType}</p>
          )}
        </div>

        {/* Space Type field */}
        <div>
          <label htmlFor="spaceType" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
            Space Type
          </label>
          <select
            id="spaceType"
            name="spaceType"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                    bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                    focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                    transition-colors duration-200"
            value={formData.spaceType}
            onChange={onChange}
          >
            <option value="">Select type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="office">Office Space</option>
            <option value="commercial">Commercial Space</option>
          </select>
          {formErrors.spaceType && (
            <p className="mt-1 text-sm text-red-500">{formErrors.spaceType}</p>
          )}
        </div>

        {/* Budget field */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
            Budget Range
          </label>
          <select
            id="budget"
            name="budget"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                    bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                    focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                    transition-colors duration-200"
            value={formData.budget}
            onChange={onChange}
          >
            <option value="">Select range</option>
            <option value="under-5k">Under €5,000</option>
            <option value="5k-10k">€5,000 - €10,000</option>
            <option value="10k-25k">€10,000 - €25,000</option>
            <option value="25k-50k">€25,000 - €50,000</option>
            <option value="50k-plus">€50,000+</option>
          </select>
        </div>

        {/* Timeline field */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
            Preferred Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                    bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                    focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                    transition-colors duration-200"
            value={formData.timeline}
            onChange={onChange}
          >
            <option value="">Select timeline</option>
            <option value="immediate">As soon as possible</option>
            <option value="1-3months">1-3 months</option>
            <option value="3-6months">3-6 months</option>
            <option value="6-plus">6+ months</option>
          </select>
        </div>

        {/* Message field */}
        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
            Tell us about your project
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                    bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                    focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50 resize-none
                    transition-colors duration-200"
            placeholder="Please share any specific requirements, ideas, or questions you have..."
            value={formData.message}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-primary-600 dark:text-primary-300 text-center sm:text-left">
          By submitting this form, you'll receive a response within 24 hours to schedule your free consultation.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 
                    rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-primary-50 
                    transition-all hover:bg-accent-600 focus:outline-none focus:ring-2 
                    focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              Submit Request
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
interface RecommendationFormProps {
  formData: RecommendationFormData;
  formErrors: FormErrors;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onColorChange: (color: string) => void;
}

function RecommendationForm({ 
  formData, 
  formErrors, 
  isSubmitting, 
  onSubmit, 
  onChange,
  onColorChange 
}: RecommendationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Contact Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50">
          Contact Information
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Name field */}
          <div>
            <label htmlFor="rec-name" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
              Full Name
            </label>
            <input
              type="text"
              id="rec-name"
              name="name"
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                      bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                      focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                      transition-colors duration-200"
              value={formData.name}
              onChange={onChange}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="rec-email" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
              Email Address
            </label>
            <input
              type="email"
              id="rec-email"
              name="email"
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                      bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                      focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                      transition-colors duration-200"
              value={formData.email}
              onChange={onChange}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Space Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50">
          Space Information
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Room Type field */}
          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
              Room Type
            </label>
            <select
              id="roomType"
              name="roomType"
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                      bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                      focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                      transition-colors duration-200"
              value={formData.roomType}
              onChange={onChange}
            >
              <option value="">Select room type</option>
              <option value="living-room">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="dining-room">Dining Room</option>
              <option value="home-office">Home Office</option>
              <option value="kitchen">Kitchen</option>
              <option value="bathroom">Bathroom</option>
              <option value="outdoor">Outdoor Space</option>
            </select>
            {formErrors.roomType && (
              <p className="mt-1 text-sm text-red-500">{formErrors.roomType}</p>
            )}
          </div>

          {/* Style Preference field */}
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
              Preferred Style
            </label>
            <select
              id="style"
              name="style"
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                      bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                      focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                      transition-colors duration-200"
              value={formData.style}
              onChange={onChange}
            >
              <option value="">Select style</option>
              {styleOptions.map((style) => (
                <option key={style} value={style.toLowerCase().replace(' ', '-')}>
                  {style}
                </option>
              ))}
            </select>
            {formErrors.style && (
              <p className="mt-1 text-sm text-red-500">{formErrors.style}</p>
            )}
          </div>

          {/* Measurements field */}
          <div className="sm:col-span-2">
            <label htmlFor="measurements" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
              Room Measurements
            </label>
            <input
              type="text"
              id="measurements"
              name="measurements"
              required
              disabled={isSubmitting}
              placeholder="e.g., 4.5m x 3.2m or 15ft x 10ft"
              className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                      bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                      focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                      transition-colors duration-200"
              value={formData.measurements}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {/* Style Preferences Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50">
          Style Preferences
        </h3>
        
        {/* Color Preferences */}
        <div>
          <label className="block text-sm font-medium text-primary-900 dark:text-primary-50 mb-3">
            Color Preferences
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colorOptions.map((color) => (
              <label
                key={color}
                className={`
                  relative flex items-center justify-center p-3 rounded-lg border
                  ${formData.colorPreferences.includes(color) 
                    ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20' 
                    : 'border-primary-200 dark:border-primary-700'}
                  cursor-pointer hover:border-accent-500 transition-colors duration-200
                `}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.colorPreferences.includes(color)}
                  onChange={() => onColorChange(color)}
                  disabled={isSubmitting}
                />
                <span className="text-sm text-primary-900 dark:text-primary-50">
                  {color}
                </span>
              </label>
            ))}
          </div>
          {formErrors.colorPreferences && (
            <p className="mt-1 text-sm text-red-500">{formErrors.colorPreferences}</p>
          )}
        </div>

        {/* Existing Furniture */}
        <div>
          <label htmlFor="existingFurniture" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
            Existing Furniture to Consider
          </label>
          <textarea
            id="existingFurniture"
            name="existingFurniture"
            rows={3}
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                    bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                    focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50 resize-none
                    transition-colors duration-200"
            placeholder="Please list any existing furniture you'd like to keep or incorporate into the new design..."
            value={formData.existingFurniture}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Budget and Timeline Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50">
          Budget and Timeline
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Budget field */}
          <div>
            <label htmlFor="rec-budget" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
              Furniture Budget Range
            </label>
            <select
              id="rec-budget"
              name="budget"
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                      bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                      focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                      transition-colors duration-200"
              value={formData.budget}
              onChange={onChange}
            >
              <option value="">Select range</option>
              <option value="under-2k">Under €2,000</option>
              <option value="2k-5k">€2,000 - €5,000</option>
              <option value="5k-10k">€5,000 - €10,000</option>
              <option value="10k-20k">€10,000 - €20,000</option>
              <option value="20k-plus">€20,000+</option>
            </select>
          </div>

          {/* Timeline field */}
          <div>
            <label htmlFor="rec-timeline" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
              Desired Completion Timeline
            </label>
            <select
              id="rec-timeline"
              name="timeline"
              required
              disabled={isSubmitting}
              className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                      bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                      focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50
                      transition-colors duration-200"
              value={formData.timeline}
              onChange={onChange}
            >
              <option value="">Select timeline</option>
              <option value="asap">As soon as possible</option>
              <option value="1-month">Within 1 month</option>
              <option value="2-3-months">2-3 months</option>
              <option value="3-plus-months">3+ months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Requests */}
      <div>
        <label htmlFor="specificRequests" className="block text-sm font-medium text-primary-900 dark:text-primary-50">
          Specific Requirements or Requests
        </label>
        <textarea
          id="specificRequests"
          name="specificRequests"
          rows={4}
          disabled={isSubmitting}
          className="mt-1 block w-full rounded-lg border border-primary-200 dark:border-primary-700 
                  bg-white dark:bg-primary-800 px-4 py-2 text-primary-900 dark:text-primary-50
                  focus:border-accent-500 focus:ring-accent-500 disabled:opacity-50 resize-none
                  transition-colors duration-200"
          placeholder="Any specific requirements, preferences, or special requests for your furniture recommendations..."
          value={formData.specificRequests}
          onChange={onChange}
        />
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-primary-600 dark:text-primary-300 text-center sm:text-left">
          Our experts will review your preferences and provide personalized furniture recommendations within 48 hours.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 
                    rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-primary-50 
                    transition-all hover:bg-accent-600 focus:outline-none focus:ring-2 
                    focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              Request Recommendations
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}